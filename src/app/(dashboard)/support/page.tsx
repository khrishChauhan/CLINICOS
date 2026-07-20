import React from 'react'

export default function SupportPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-500 mt-2">Get assistance with ClinicOS and view documentation.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg text-slate-800">Contact Support</h2>
          <p className="text-sm text-slate-600">Our technical support team is available 24/7 to help you with any issues.</p>
          <div className="space-y-2">
            <p className="text-sm"><strong>Email:</strong> support@clinicos.in</p>
            <p className="text-sm"><strong>Phone:</strong> +91 1800-123-4567</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Create Support Ticket
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-lg text-slate-800">Documentation & Guides</h2>
          <p className="text-sm text-slate-600">Browse our comprehensive knowledge base for tutorials and troubleshooting.</p>
          <ul className="space-y-3 text-sm text-blue-600">
            <li><a href="#" className="hover:underline">→ Getting Started with EMR</a></li>
            <li><a href="#" className="hover:underline">→ Managing Billing & Invoices</a></li>
            <li><a href="#" className="hover:underline">→ Pathology Lab Integrations</a></li>
            <li><a href="#" className="hover:underline">→ Staff Roles & Permissions</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
