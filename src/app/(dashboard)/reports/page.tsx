import ReportBuilderClient from './ReportBuilderClient'

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Report Builder</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and export tabular data</p>
      </div>
      <ReportBuilderClient />
    </div>
  )
}