'use client'

import dynamic from 'next/dynamic'

const DynamicCityRenderer = dynamic(
  () => import('@hypernovum/core/src/CityRenderer').then((mod) => mod.CityRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-green-700 font-mono text-sm animate-pulse">
          Initializing city renderer...
        </div>
      </div>
    ),
  },
)

export default DynamicCityRenderer
