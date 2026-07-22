'use client'

import React, { useState, useEffect } from 'react'
import { submitAppointmentFeedbackAction, getAppointmentFeedbackAction } from '@/actions/appointments/appointmentFeedbackActions'
import type { AppointmentFeedbackRow } from '@/types/appointments'
import { X, Star, MessageSquare } from 'lucide-react'

interface Props {
  appointmentId: string
  onClose: () => void
}

export default function AppointmentFeedbackDialog({ appointmentId, onClose }: Props) {
  const [existingFeedback, setExistingFeedback] = useState<AppointmentFeedbackRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [ratings, setRatings] = useState({
    overall: 0,
    waitingTime: 0,
    doctor: 0,
    staff: 0,
    cleanliness: 0
  })
  const [comments, setComments] = useState('')

  useEffect(() => {
    async function loadData() {
      const res = await getAppointmentFeedbackAction(appointmentId)
      if (res.success && res.data) {
        setExistingFeedback(res.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (ratings.overall === 0) {
      setError('Overall rating is required.')
      return
    }
    setSubmitting(true)
    setError(null)
    const res = await submitAppointmentFeedbackAction(
      appointmentId,
      ratings.overall,
      ratings.waitingTime || undefined,
      ratings.doctor || undefined,
      ratings.staff || undefined,
      ratings.cleanliness || undefined,
      comments
    )
    if (res.success) {
      setExistingFeedback(res.data as AppointmentFeedbackRow)
    } else {
      setError(res.error)
    }
    setSubmitting(false)
  }

  const StarRating = ({ value, onChange, readonly = false }: { value: number, onChange?: (val: number) => void, readonly?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          className={`p-1 ${readonly ? 'cursor-default' : 'hover:scale-110 transition-transform'}`}
        >
          <Star className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  )

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl">Loading...</div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Patient Feedback</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-50">
          {existingFeedback ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Overall Rating</p>
                <div className="flex justify-center mb-4">
                  <StarRating value={existingFeedback.overall_rating} readonly />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mt-6 border-t border-slate-100 pt-6">
                  <div>
                    <span className="text-slate-500 block mb-1">Doctor Experience</span>
                    <StarRating value={existingFeedback.doctor_experience_rating || 0} readonly />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Waiting Time</span>
                    <StarRating value={existingFeedback.waiting_time_rating || 0} readonly />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Staff</span>
                    <StarRating value={existingFeedback.staff_rating || 0} readonly />
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Cleanliness</span>
                    <StarRating value={existingFeedback.cleanliness_rating || 0} readonly />
                  </div>
                </div>

                {existingFeedback.comments && (
                  <div className="mt-6 bg-slate-50 p-4 rounded-lg text-left">
                    <p className="text-slate-600 text-sm flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-blue-500" />
                      {existingFeedback.comments}
                    </p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-6">
                  Submitted at: {new Date(existingFeedback.submitted_at).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <label className="block font-bold text-slate-700 mb-2">Overall Satisfaction *</label>
                  <div className="flex justify-center">
                    <StarRating value={ratings.overall} onChange={(v) => setRatings({...ratings, overall: v})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor Experience</label>
                    <StarRating value={ratings.doctor} onChange={(v) => setRatings({...ratings, doctor: v})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Waiting Time</label>
                    <StarRating value={ratings.waitingTime} onChange={(v) => setRatings({...ratings, waitingTime: v})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Staff & Service</label>
                    <StarRating value={ratings.staff} onChange={(v) => setRatings({...ratings, staff: v})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cleanliness</label>
                    <StarRating value={ratings.cleanliness} onChange={(v) => setRatings({...ratings, cleanliness: v})} />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Comments</label>
                  <textarea
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    rows={4}
                    placeholder="Transcribe patient comments..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={`px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm transition ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                  {submitting ? 'Saving...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
