import ContentList from '../components/ContentList'

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">CONTENT</h1>
        <p className="text-sm text-gray-500">Browse all content across platforms</p>
      </div>

      <ContentList />
    </div>
  )
}
