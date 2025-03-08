"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(true)
  const [locationInput, setLocationInput] = useState("")
  const [isLocating, setIsLocating] = useState(false)

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-vector': {
            type: 'vector',
            tiles: [
              'https://tiles.stadiamaps.com/data/openmaptiles/{z}/{x}/{y}.pbf'
            ],
            maxzoom: 14
          }
        },
        layers: [
          // Background
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#f0f0f0'  // Light gray background
            }
          },
          // Water
          {
            id: 'water',
            type: 'fill',
            source: 'osm-vector',
            'source-layer': 'water',
            paint: {
              'fill-color': '#a3d9ff'  // Bright blue water
            }
          },
          // Parks and green areas
          {
            id: 'landuse',
            type: 'fill',
            source: 'osm-vector',
            'source-layer': 'landuse',
            paint: {
              'fill-color': [
                'match',
                ['get', 'class'],
                'park', '#b3e6b3',  // Brighter green for parks
                'cemetery', '#c8e6c8',
                'hospital', '#ffe6e6',
                'school', '#f0e6ff',
                'industrial', '#f0e6e6',
                '#f8f8f8'  // Default landuse color
              ]
            }
          },
          // Running paths and trails
          {
            id: 'highway_path',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['==', 'class', 'path']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ff9966',  // Orange-ish color for paths
              'line-dasharray': [1, 1],
              'line-width': 2
            }
          },
          // Minor roads with white fill
          {
            id: 'highway_minor',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'minor', 'service', 'track']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ffffff',  // White road fill
              'line-width': 3
            }
          },
          // Minor road casings
          {
            id: 'highway_minor_casing',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'minor', 'service', 'track']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#cccccc',  // Light gray casing
              'line-width': 4
            }
          },
          // Major roads with white fill
          {
            id: 'highway_major',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'primary', 'secondary', 'tertiary']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ffffff',  // White road fill
              'line-width': 4
            }
          },
          // Major road casings
          {
            id: 'highway_major_casing',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'primary', 'secondary', 'tertiary']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#bbbbbb',  // Medium gray casing
              'line-width': 5
            }
          },
          // Highways
          {
            id: 'highway_motorway',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'motorway', 'trunk']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ffcc99',  // Light orange fill
              'line-width': 4
            }
          },
          // Highway casings
          {
            id: 'highway_motorway_casing',
            type: 'line',
            source: 'osm-vector',
            'source-layer': 'transportation',
            filter: [
              'all',
              ['==', '$type', 'LineString'],
              ['in', 'class', 'motorway', 'trunk']
            ],
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ff9966',  // Darker orange casing
              'line-width': 5
            }
          },
          // City/neighborhood labels
          {
            id: 'place_label',
            type: 'symbol',
            source: 'osm-vector',
            'source-layer': 'place',
            layout: {
              'text-field': '{name:latin}',
              'text-font': ['Open Sans Regular'],
              'text-max-width': 8,
              'text-size': 14,
              'text-transform': 'uppercase'
            },
            paint: {
              'text-color': '#666666',
              'text-halo-color': 'rgba(255,255,255,0.9)',
              'text-halo-width': 2
            }
          },
          // Road labels
          {
            id: 'road_label',
            type: 'symbol',
            source: 'osm-vector',
            'source-layer': 'transportation_name',
            layout: {
              'symbol-placement': 'line',
              'text-anchor': 'center',
              'text-field': '{name:latin}',
              'text-font': ['Open Sans Regular'],
              'text-offset': [0, 0.15],
              'text-size': 12
            },
            paint: {
              'text-color': '#666666',
              'text-halo-blur': 0,
              'text-halo-color': 'rgba(255,255,255,0.9)',
              'text-halo-width': 2
            }
          }
        ],
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
        sprite: 'https://openmaptiles.github.io/osm-bright-gl-style/sprite'
      },
      center: [-74.0060, 40.7128], // New York City coordinates
      zoom: 12, // Zoom level for city overview
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl({
      showCompass: false, // Hide the compass/reset bearing button
      showZoom: true      // Show zoom buttons
    }), "top-right")

    // Don't try to get user location automatically
    // Instead, wait for user input through the location prompt

    map.current.on("load", () => {
      // Map is loaded and ready
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Go to the entered location
  const handleGoToLocation = async () => {
    if (!locationInput.trim() || !map.current) return
    
    try {
      // Use Nominatim geocoding service to convert location text to coordinates
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        
        // Fly to the location
        map.current.flyTo({
          center: [parseFloat(lon), parseFloat(lat)],
          zoom: 15,
          essential: true
        })
        
        // Hide the prompt
        setShowLocationPrompt(false)
      } else {
        alert("Location not found. Please try a different search.")
      }
    } catch (error) {
      console.error("Error finding location:", error)
      alert("Error finding location. Please try again.")
    }
  }

  // Handle locate me button
  const handleLocateMe = () => {
    if (!navigator.geolocation || !map.current) {
      alert("Geolocation is not supported by your browser.")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Fly to user's location
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true
        })
        
        // Hide the prompt
        setShowLocationPrompt(false)
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to get your location. Please check your browser permissions.")
        setIsLocating(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Location prompt - centered on all screen sizes */}
      {showLocationPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="bg-white p-4 sm:p-5 rounded-lg shadow-lg w-[90%] max-w-xs sm:max-w-sm overflow-auto m-4">
            <h2 className="text-base sm:text-lg font-bold mb-3 text-gray-800">Where would you like to run?</h2>
            
            <div className="mb-3 sm:mb-4">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter a location"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToLocation();
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={handleGoToLocation}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-2 sm:px-3 rounded transition-colors text-xs sm:text-sm whitespace-nowrap"
              >
                Go to Location
              </button>
              
              <button 
                type="button"
                onClick={handleLocateMe}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-2 sm:px-3 rounded transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm whitespace-nowrap"
                disabled={isLocating}
              >
                {isLocating ? (
                  <span>Locating...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Locate Me</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Semi-transparent overlay for background */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10"></div>
        </div>
      )}
      
      {/* Search button to reopen location prompt - positioned differently on mobile vs desktop */}
      {!showLocationPrompt && (
        <button
          onClick={() => setShowLocationPrompt(true)}
          className="fixed bottom-[26vh] md:bottom-4 left-2 sm:left-4 bg-white p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search for location"
          title="Search for location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  )
}

