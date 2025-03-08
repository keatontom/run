"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/sidebar"
// Import map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  ),
})

export default function Home() {
  const [routeParams, setRouteParams] = useState({
    distance: 5,
    elevation: "flat",
    pathType: "trail",
    traffic: "low",
  })

  const [selectionCoordinates, setSelectionCoordinates] = useState<any>(null)

  const handleParamsChange = (params: any) => {
    setRouteParams({ ...routeParams, ...params })
  }

  const handleSelectionChange = (coords: any) => {
    setSelectionCoordinates(coords)
  }

  const handleGenerateRoute = async () => {
    if (!selectionCoordinates) {
      alert("Please select an area on the map first")
      return
    }

    // Here you would call your FastAPI backend
    console.log("Generating route with:", {
      routeParams,
      selectionCoordinates,
    })

    // Mock API call
    // const response = await fetch('https://your-fastapi-backend.fly.dev/generate-route', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ routeParams, selectionCoordinates })
    // })
    // const data = await response.json()
  }

  return (
    <main className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-white">
      <div className="relative flex-1 h-[75vh] md:h-full">
        <MapComponent />
      </div>
      <Sidebar routeParams={routeParams} onParamsChange={handleParamsChange} onGenerateRoute={handleGenerateRoute} />
    </main>
  )
}

