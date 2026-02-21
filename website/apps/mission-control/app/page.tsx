import TasksBoard from './components/TasksBoard'
import SystemStatus from './components/SystemStatus'
import RecentMemories from './components/RecentMemories'
import NioStatus from './components/NioStatus'
import SessionStatus from './components/SessionStatus'
import TodayFocus from './components/TodayFocus'
import Link from 'next/link'
import { Users, ArrowRight, Crown, Calendar } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* System Status */}
      <SystemStatus />
      
      <TodayFocus />

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/office" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-medium text-green-300">The Office</h3>
                  <p className="text-xs text-gray-400">Live agent workspace</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>
        
        <Link href="/team" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-green-300">Team Management</h3>
                  <p className="text-xs text-gray-400">Agent roster & roles</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>
        
        <Link href="/calendar" className="group">
          <div className="card hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-medium text-green-300">Mission Calendar</h3>
                  <p className="text-xs text-gray-400">Events & deployments</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Board - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <TasksBoard />
        </div>
        
        {/* Side Panel */}
        <div className="space-y-6">
          <NioStatus />
          <SessionStatus />
          <RecentMemories />
        </div>
      </div>
    </div>
  )
}