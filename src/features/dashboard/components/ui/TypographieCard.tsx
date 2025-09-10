import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographiesResponse } from '../../types/branding'

function TypographieCard({ data }: { data: TypographiesResponse }) {
  return (
    <Card className="font-sample p-4 border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-700 mb-2">
          {data['font-type']}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.fonts.map((font, index) => (
          <Card key={index} style={{ fontFamily: '"Inter", sans-serif' }}>
            <CardHeader>
              <h3>{font.name}</h3>
            </CardHeader>
            <CardContent className="flex justify-between gap-6">
              <p>
                <span className="font-semibold">Relevance : </span>
                {font.Relevance}
              </p>
              <p>
                <span className="font-semibold">Impact : </span>
                {font.Impact}
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default TypographieCard
