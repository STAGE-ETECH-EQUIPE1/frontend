import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ColorPaletteResponse } from '../../types/branding'

function ColorPaletteCard({ data }: { data: ColorPaletteResponse }) {
  console.log(data)

  return (
    <Card className="mx-5">
      <CardHeader>
        <CardTitle className="text-center">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {data.colors.map((color, index) => (
            <div
              className="color-swatch flex items-center rounded-lg p-2 cursor-pointer"
              style={{ backgroundColor: color.hex }}
              key={index}
            >
              <div className="flex-grow">
                <div className="text-white font-medium">{color.name}</div>
                <div className="text-white text-opacity-80 text-sm">
                  {color.position}
                </div>
              </div>
              <div className="copy-hex text-white bg-black bg-opacity-20 px-2 py-1 rounded text-xs">
                {color.hex}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors select-palette">
          Select Palette
        </button>
      </CardContent>
    </Card>
  )
}

export default ColorPaletteCard
