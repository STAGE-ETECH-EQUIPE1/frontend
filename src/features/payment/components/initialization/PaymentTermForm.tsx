import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentTermForm() {
  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Réservation
            <span className="text-primary">N° XXXXXXXXXXXX</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Informations de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Nouveau bouton pour CyberSource Secure Acceptance */}
          <div className="space-y-6">
            <Alert variant="default" className="bg-[#f9f6e9] border-primary">
              <AlertCircle className="w-4 h-4 text-primary" />
              <AlertDescription>Vos données sont sécurisées</AlertDescription>
            </Alert>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm">
                Montant à payer
                <span className="font-semibold">1000 €</span>
              </div>
              <Button
                variant="ghost"
                className={`text-white hover:bg-primary/90 h-10 rounded-[10px]`}
              >
                Payer
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </Button>
            </div>
          </div>

          {/* Formulaire legacy extrait dans un composant séparé */}
        </CardContent>
      </Card>
    </div>
  )
}
