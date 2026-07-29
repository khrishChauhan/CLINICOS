import type { SupabaseClient } from '@supabase/supabase-js'
import { labSampleRepository } from '@/repositories/laboratory/labSampleRepository'
import { sampleTrackingRepository } from '@/repositories/laboratory/sampleTrackingRepository'

export const labSampleService = {
  async getSamples(supabase: SupabaseClient, clinicId: string) {
    return labSampleRepository.getSamples(supabase, clinicId)
  },

  async getSampleById(supabase: SupabaseClient, clinicId: string, sampleId: string) {
    return labSampleRepository.getSampleById(supabase, clinicId, sampleId)
  },

  async createSample(
    supabase: SupabaseClient,
    clinicId: string,
    labOrderItemId: string,
    sampleType?: string,
    containerType?: string
  ) {
    // Basic business validation
    return labSampleRepository.createSample(supabase, clinicId, {
      lab_order_item_id: labOrderItemId,
      sample_type: sampleType,
      container_type: containerType,
      status: 'Pending'
    })
  },

  async collectSample(
    supabase: SupabaseClient,
    clinicId: string, // Kept for consistency, though RPC uses RLS/auth implicit isolation
    sampleId: string,
    collectorId: string,
    collectionSite: string,
    collectionMethod: string,
    remarks?: string
  ) {
    // We use the RPC defined in Phase 2 to execute the collection and status sync in a single transaction
    const { data, error } = await supabase.rpc('collect_sample_and_update_item', {
      p_sample_id: sampleId,
      p_collector_id: collectorId,
      p_collection_site: collectionSite,
      p_collection_method: collectionMethod,
      p_remarks: remarks || null
    })

    if (error) throw new Error(error.message)
    return data
  },

  async trackSample(
    supabase: SupabaseClient,
    clinicId: string,
    sampleId: string,
    trackedBy: string,
    fromLocation: string,
    toLocation: string,
    newStatus: 'In Transit' | 'Processing' | 'Completed' | 'Rejected'
  ) {
    // Add tracking event
    await sampleTrackingRepository.addTrackingEvent(supabase, {
      sample_id: sampleId,
      tracked_by: trackedBy,
      from_location: fromLocation,
      to_location: toLocation,
      status: newStatus
    })

    // Update main sample status
    return labSampleRepository.updateSample(supabase, clinicId, sampleId, { status: newStatus })
  }
}
