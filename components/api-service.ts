export interface RouteParams {
  distance: number
  elevation: string
  pathType: string
  traffic: string
}

export interface RouteRequest {
  routeParams: RouteParams
  selectionCoordinates: [number, number][]
}

export interface RouteResponse {
  route: [number, number][]
  distance: number
  elevation: number
  estimatedTime: number
}

export async function generateRoute(request: RouteRequest): Promise<RouteResponse> {
  // Replace with your actual API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-fastapi-backend.fly.dev"

  try {
    const response = await fetch(`${apiUrl}/generate-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating route:", error)
    throw error
  }
}

