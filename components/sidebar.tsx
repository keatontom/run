"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  routeParams: {
    distance: number
    elevation: string
    pathType: string
    traffic: string
  }
  onParamsChange: (params: any) => void
  onGenerateRoute: () => void
}

export function Sidebar({ routeParams, onParamsChange, onGenerateRoute }: SidebarProps) {
  return (
    <div className="w-full md:w-80 h-[25vh] md:h-full border-t md:border-t-0 md:border-l border-gray-200 bg-white overflow-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="pb-1 md:pb-4 pt-2 md:pt-6">
          <CardTitle className="text-lg md:text-xl font-bold tracking-tight">Route Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-6 py-1 md:py-6">
          {/* Mobile layout: 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 md:block md:space-y-6">
            {/* Distance - Text input only */}
            <div>
              <Label htmlFor="distance" className="text-sm">Distance (km)</Label>
              <Input
                id="distance-input"
                type="number"
                min={1}
                max={42}
                value={routeParams.distance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParamsChange({ distance: Number(e.target.value) })}
                className="h-9 md:h-10"
              />
            </div>

            {/* Elevation */}
            <div>
              <Label htmlFor="elevation" className="text-sm">Elevation</Label>
              <Select value={routeParams.elevation} onValueChange={(value) => onParamsChange({ elevation: value })}>
                <SelectTrigger id="elevation" className="w-full h-9 md:h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="some-hills">Some Hills</SelectItem>
                  <SelectItem value="hilly">Hilly</SelectItem>
                  <SelectItem value="very-hilly">Very Hilly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Path Type */}
            <div>
              <Label htmlFor="pathType" className="text-sm">Path Type</Label>
              <Select value={routeParams.pathType} onValueChange={(value) => onParamsChange({ pathType: value })}>
                <SelectTrigger id="pathType" className="w-full h-9 md:h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Road</SelectItem>
                  <SelectItem value="trail">Trail</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Traffic */}
            <div>
              <Label htmlFor="traffic" className="text-sm">Traffic</Label>
              <Select value={routeParams.traffic} onValueChange={(value) => onParamsChange({ traffic: value })}>
                <SelectTrigger id="traffic" className="w-full h-9 md:h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Traffic</SelectItem>
                  <SelectItem value="medium">Medium Traffic</SelectItem>
                  <SelectItem value="high">High Traffic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-1 pb-2 md:pt-4">
          <Button onClick={onGenerateRoute} className="w-full bg-black hover:bg-gray-800 text-white h-9 md:h-10">
            Generate Route
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

