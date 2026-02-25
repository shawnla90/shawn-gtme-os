import PipelineBoard from '../../components/crm/PipelineBoard'

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">DEAL PIPELINE</h1>
        <p className="text-sm text-gray-500">Pipeline board view</p>
      </div>

      <PipelineBoard />
    </div>
  )
}
