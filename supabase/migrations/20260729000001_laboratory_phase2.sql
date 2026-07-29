-- Laboratory Module Phase 2: Sample Collection & Tracking
-- Schema: laboratory
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. LabSamples
CREATE TABLE IF NOT EXISTS laboratory.lab_samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL, -- references core.clinics (added for easy isolation)
    lab_order_item_id UUID NOT NULL REFERENCES laboratory.lab_order_items(id) ON DELETE CASCADE,
    sample_barcode VARCHAR(50) UNIQUE,
    sample_type VARCHAR(50),
    container_type VARCHAR(50),
    collection_date TIMESTAMPTZ,
    collected_by UUID, -- references users(id)
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence and Trigger for Barcode (SMP-YYYYMMDD-XXXX)
CREATE SEQUENCE IF NOT EXISTS laboratory_sample_seq;

CREATE OR REPLACE FUNCTION laboratory.generate_lab_sample_barcode()
RETURNS TRIGGER AS $$
DECLARE
    today_str TEXT;
    seq_val INT;
BEGIN
    today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    seq_val := nextval('laboratory_sample_seq');
    NEW.sample_barcode := 'SMP-' || today_str || '-' || lpad(seq_val::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lab_sample_barcode
BEFORE INSERT ON laboratory.lab_samples
FOR EACH ROW
WHEN (NEW.sample_barcode IS NULL)
EXECUTE FUNCTION laboratory.generate_lab_sample_barcode();

-- 2. SampleCollections
CREATE TABLE IF NOT EXISTS laboratory.lab_sample_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID NOT NULL REFERENCES laboratory.lab_samples(id) ON DELETE CASCADE,
    collector_id UUID NOT NULL, -- references users(id)
    collection_method VARCHAR(100),
    collection_site VARCHAR(100),
    collection_time TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT
);

-- 3. SampleTracking
CREATE TABLE IF NOT EXISTS laboratory.lab_sample_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id UUID NOT NULL REFERENCES laboratory.lab_samples(id) ON DELETE CASCADE,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    tracked_by UUID NOT NULL, -- references users(id)
    tracking_time TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_lab_samples_item ON laboratory.lab_samples(lab_order_item_id);
CREATE INDEX idx_lab_samples_barcode ON laboratory.lab_samples(sample_barcode);
CREATE INDEX idx_lab_sample_collections_sample ON laboratory.lab_sample_collections(sample_id);
CREATE INDEX idx_lab_sample_tracking_sample ON laboratory.lab_sample_tracking(sample_id);

-- RLS
ALTER TABLE laboratory.lab_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_sample_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratory.lab_sample_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for lab_samples
CREATE POLICY lab_samples_isolation_policy ON laboratory.lab_samples
    FOR ALL TO authenticated
    USING (clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
    ));

-- Policies for lab_sample_collections
CREATE POLICY lab_sample_collections_isolation_policy ON laboratory.lab_sample_collections
    FOR ALL TO authenticated
    USING (sample_id IN (
        SELECT id FROM laboratory.lab_samples WHERE clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- Policies for lab_sample_tracking
CREATE POLICY lab_sample_tracking_isolation_policy ON laboratory.lab_sample_tracking
    FOR ALL TO authenticated
    USING (sample_id IN (
        SELECT id FROM laboratory.lab_samples WHERE clinic_id IN (
            SELECT clinic_id FROM public.users WHERE id = auth.uid()
        )
    ));

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: Transactional Collection of Sample & Order Status Sync
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION laboratory.collect_sample_and_update_item(
  p_sample_id UUID,
  p_collector_id UUID,
  p_collection_site VARCHAR,
  p_collection_method VARCHAR,
  p_remarks TEXT
) RETURNS JSONB AS $$
DECLARE
  v_lab_order_item_id UUID;
  v_sample_collection_id UUID;
  v_tracking_id UUID;
BEGIN
  -- 1. Get the lab_order_item_id
  SELECT lab_order_item_id INTO v_lab_order_item_id
  FROM laboratory.lab_samples
  WHERE id = p_sample_id;

  IF v_lab_order_item_id IS NULL THEN
    RAISE EXCEPTION 'Sample % not found', p_sample_id;
  END IF;

  -- 2. Insert Collection Record
  INSERT INTO laboratory.lab_sample_collections (
    sample_id, collector_id, collection_site, collection_method, remarks, collection_time
  ) VALUES (
    p_sample_id, p_collector_id, p_collection_site, p_collection_method, p_remarks, NOW()
  ) RETURNING id INTO v_sample_collection_id;

  -- 3. Update Sample Status
  UPDATE laboratory.lab_samples
  SET status = 'Collected',
      collected_by = p_collector_id,
      collection_date = NOW(),
      updated_at = NOW()
  WHERE id = p_sample_id;

  -- 4. Update Lab Order Item Status
  UPDATE laboratory.lab_order_items
  SET status = 'Sample Collected'
  WHERE id = v_lab_order_item_id;

  -- 5. Insert Initial Tracking Event
  INSERT INTO laboratory.lab_sample_tracking (
    sample_id, from_location, to_location, tracked_by, status, tracking_time
  ) VALUES (
    p_sample_id, p_collection_site, p_collection_site, p_collector_id, 'Collected', NOW()
  ) RETURNING id INTO v_tracking_id;

  RETURN jsonb_build_object(
    'sample_collection_id', v_sample_collection_id,
    'tracking_id', v_tracking_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
