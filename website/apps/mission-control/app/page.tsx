import TasksBoard from './components/TasksBoard'
import SystemStatus from './components/SystemStatus'
import RecentMemories from './components/RecentMemories'
import NioStatus from './components/NioStatus'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* System Status */}
      <SystemStatus />
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Board - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <TasksBoard />
        </div>
        
        {/* Side Panel */}
        <div className="space-y-6">
          <NioStatus />
          <RecentMemories />
        </div>
      </div>
    </div>
  )
}