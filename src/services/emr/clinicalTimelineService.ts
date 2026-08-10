import type { SupabaseClient } from '@supabase/supabase-js'
import type { TimelineEvent } from '@/types/emr'

export const clinicalTimelineService = {
  async getTimeline(supabase: SupabaseClient, visitId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = []
    
    // Concurrently fetch all related entities for this visit
    const [
      { data: visit },
      { data: diagnoses },
      { data: procedures },
      { data: prescriptions },
      { data: notes },
      { data: followups },
      { data: attachments },
      { data: referrals },
      { data: orders },
      { data: plans }
    ] = await Promise.all([
      supabase.from('visits').select('*').eq('id', visitId).maybeSingle(),
      supabase.from('diagnoses').select('*').eq('visit_id', visitId),
      supabase.from('procedures').select('*').eq('visit_id', visitId),
      supabase.from('prescriptions').select('*').eq('visit_id', visitId),
      supabase.from('clinical_notes').select('*').eq('visit_id', visitId),
      supabase.from('follow_up_plans').select('*').eq('visit_id', visitId),
      supabase.from('clinical_attachments').select('*').eq('visit_id', visitId),
      supabase.from('referrals').select('*').eq('visit_id', visitId),
      supabase.from('clinical_orders').select('*').eq('visit_id', visitId),
      supabase.from('treatment_plans').select('*').eq('visit_id', visitId)
    ])

    // Map each to TimelineEvent
    if (visit) {
      events.push({
        id: `vis-${visit.id}`,
        event_type: 'Visit Started',
        event_description: `Consultation marked as ${visit.consultation_status}`,
        event_date: visit.consultation_start_time || visit.created_at,
        source_table: 'visits',
        source_id: visit.id
      })
      if (visit.consultation_status === 'Completed') {
        events.push({
          id: `vis-end-${visit.id}`,
          event_type: 'Visit Completed',
          event_description: 'Consultation marked as Completed',
          event_date: visit.updated_at,
          source_table: 'visits',
          source_id: visit.id
        })
      }
    }

    diagnoses?.forEach(d => {
      events.push({
        id: `diag-${d.id}`,
        event_type: 'Diagnosis Added',
        event_description: `${d.diagnosis_type} Diagnosis: ${d.diagnosis_name} (${d.status})`,
        event_date: d.created_at,
        source_table: 'diagnoses',
        source_id: d.id
      })
    })

    procedures?.forEach(p => {
      events.push({
        id: `proc-${p.id}`,
        event_type: 'Procedure Logged',
        event_description: `${p.procedure_name} - ${p.status}`,
        event_date: p.created_at,
        source_table: 'procedures',
        source_id: p.id
      })
    })

    prescriptions?.forEach(p => {
      events.push({
        id: `rx-${p.id}`,
        event_type: 'Prescription Generated',
        event_description: `Prescription issued by doctor.`,
        event_date: p.created_at,
        source_table: 'prescriptions',
        source_id: p.id
      })
    })

    notes?.forEach(n => {
      events.push({
        id: `note-${n.id}`,
        event_type: 'Clinical Note Added',
        event_description: `${n.note_type} Note entered.`,
        event_date: n.entered_at,
        source_table: 'clinical_notes',
        source_id: n.id
      })
    })

    followups?.forEach(f => {
      events.push({
        id: `fu-${f.id}`,
        event_type: 'Follow-up Planned',
        event_description: `Follow-up set for ${f.followup_date}.`,
        event_date: f.created_at,
        source_table: 'follow_up_plans',
        source_id: f.id
      })
    })

    attachments?.forEach(a => {
      events.push({
        id: `att-${a.id}`,
        event_type: 'Attachment Uploaded',
        event_description: `${a.attachment_type}: ${a.file_name}`,
        event_date: a.uploaded_at,
        source_table: 'clinical_attachments',
        source_id: a.id
      })
    })

    referrals?.forEach(r => {
      events.push({
        id: `ref-${r.id}`,
        event_type: 'Referral Created',
        event_description: `Referred to ${r.referred_doctor || r.referred_hospital}`,
        event_date: r.created_at,
        source_table: 'referrals',
        source_id: r.id
      })
    })

    orders?.forEach(o => {
      events.push({
        id: `ord-${o.id}`,
        event_type: 'Clinical Order Placed',
        event_description: `${o.order_type} Order - Status: ${o.status}`,
        event_date: o.order_date,
        source_table: 'clinical_orders',
        source_id: o.id
      })
    })

    plans?.forEach(p => {
      events.push({
        id: `tp-${p.id}`,
        event_type: 'Treatment Plan Active',
        event_description: `Goal: ${p.treatment_goal}`,
        event_date: p.created_at,
        source_table: 'treatment_plans',
        source_id: p.id
      })
    })

    // Sort descending (newest first)
    events.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

    return events
  }
}
