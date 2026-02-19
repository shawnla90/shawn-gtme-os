import OfficeView from '../components/OfficeView'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function OfficePage() {
  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          href="/"
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
        
        <div className="h-px bg-green-800 flex-1"></div>
        
        <div className="text-sm text-green-500">
          THE OFFICE - LIVE VIEW
        </div>
      </div>
      
      {/* Office View */}
      <OfficeView />
    </div>
  )
}