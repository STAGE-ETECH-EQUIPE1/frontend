'use client'

import { Card, CardFooter, CardTitle } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PaymentFormSkeleton from '@/features/payment/components/initialization/PaymentFormSkeleton'
import PaymentFormSummary from '@/features/payment/components/initialization/PaymentFormSummary'
import PaymentFormPrice from '@/features/payment/components/initialization/PaymentFormPrice'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { usePaymentSecure } from '@/features/payment/hooks/usePaymentSecure'
import { wait } from '@/features/payment/services/paymentApi'
import { useParams, useRouter } from 'next/navigation'

export default function PaymentForm() {
  const { initSecureAcceptance } = usePaymentSecure();
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [showSecureAcceptance, setShowSecureAcceptance] = useState(false)
  const [secureAcceptanceData, setSecureAcceptanceData] = useState<Record<string, string> | null>(null)
  const [cybersourceUrl, setCybersourceUrl] = useState<string | null>(null)
  const [secureAcceptanceLoading, setSecureAcceptanceLoading] = useState(false)

  const handleSecureAcceptancePayment = async () => {
    setSecureAcceptanceLoading(true)
    try {
      await wait();
      const {cybersourceUrl, formData} = await initSecureAcceptance("2");
      if (cybersourceUrl && formData) {
        setSecureAcceptanceData(formData)
        setCybersourceUrl(`${cybersourceUrl}/pay`)
        setShowSecureAcceptance(true)
      }
      setIsLoading(false)

    } catch (error: unknown) {
      console.error(error)
    } finally {
      setSecureAcceptanceLoading(false)
    }
  }

  // Nouveau useEffect pour gérer les messages de l'iframe CyberSource
  useEffect(() => {
    if (showSecureAcceptance && iframeRef.current) {
      const handleMessage = (event: MessageEvent) => {
        const { code, transactionId, referenceDevis } = event.data;
        console.log(code, transactionId, referenceDevis)

        if (["ACCEPT", "REVIEW"].includes(code)) {
          const params = new URLSearchParams({
            reference: transactionId,
            referenceDevis: referenceDevis,
          });
          router.replace(`/${locale}/payment/resume?${params.toString()}`);
        } else if ([
          "DECLINE",
          "CANCEL",
          "ERROR",
          "PAYMENT_SUCCESS_SYSTEM_ERROR",
          "PAYMENT_OK_INVOICE_FAILED",
          "DEVIS_NOT_FOUND_AFTER_PAYMENT"
        ].includes(code)) {
          setShowSecureAcceptance(false);
          setSecureAcceptanceData({});
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout de sécurité
      const timeout = setTimeout(() => {
        setShowSecureAcceptance(false);
      }, 15 * 60 * 1000); // 15 minutes

      return () => {
        window.removeEventListener("message", handleMessage);
        clearTimeout(timeout);
      };
    }
  }, [locale, router, showSecureAcceptance])

  // Auto-submit du formulaire CyberSource
  useEffect(() => {
    if (showSecureAcceptance && secureAcceptanceData) {
      const timer = setTimeout(() => {
        const form = document.getElementById("cybersource-form") as HTMLFormElement;
        if (form) {
          form.submit();
        } else {
          console.error("Formulaire CyberSource non trouvé");
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showSecureAcceptance, secureAcceptanceData]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <CardTitle className="text-lg font-semibold text-gray-800 mb-6">
                Payment Information
              </CardTitle>

              {
                isLoading && <PaymentFormSkeleton />
              }

              <div id="payment-form-container" className={
                showSecureAcceptance ? "" : "hidden"
              }>
                <div className="relative">
                  <iframe
                    ref={iframeRef}
                    sandbox="allow-forms allow-scripts allow-same-origin"
                    id="cybersource-iframe"
                    name="cybersource-iframe"
                    height={"800"}
                    width={"100%"}
                    title="CyberSource Secure Acceptance"
                    className="responsive-iframe"
                    onLoad={() => {
                      const loader =
                        document.getElementById("cybersource-loader");
                      if (loader) {
                        loader.style.display = "none";
                      }
                    }}
                  ></iframe>
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
                    id="cybersource-loader"
                  >
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Chargement du paiement...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <CardFooter className="mt-6 flex items-center">
                <Image
                  width={250}
                  height={100}
                  src="/logo/cybersource-logo.svg"
                  alt="Cybersource"
                  className="h-8 mr-4"
                />

                <div className="flex space-x-2">
                  <Image
                    width={50}
                    height={100}
                    src="/logo/mastercard.png"
                    alt="Mastercard"
                    className="h-6"
                  />
                  <Image
                    width={50}
                    height={100}
                    src="/logo/visa.png"
                    alt="Visa"
                    className="h-6"
                  />
                </div>

                <Button
                  variant={"ghost"}
                  type="button"
                  className="ml-auto bg-blue-100 py-2 px-4 rounded cursor-pointer"
                  onClick={handleSecureAcceptancePayment}
                >
                  {secureAcceptanceLoading
                    ? "Traitement..."
                    : "Payer"
                  }
                  {secureAcceptanceLoading ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 ml-2" />
                  )}
                </Button>

              </CardFooter>

              <div
                id="error-message"
                className="hidden bg-red-50 border-l-4 border-red-500 p-4 mb-6"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3
                      className="text-sm font-medium text-red-800"
                      id="error-title"
                    >
                      Error loading payment form
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p id="error-details">
                        We&#39;re unable to load the secure payment form. Please
                        try again later or contact support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {
            cybersourceUrl && (<>
              <form
                id="cybersource-form"
                method="POST"
                action={cybersourceUrl ?? ""}
                target="cybersource-iframe"
              >
                {
                  Object.entries((secureAcceptanceData as Record<string, string>)).map(([key, value]) => {
                    return (
                      <input
                        key={key}
                        type="hidden"
                        name={key}
                        value={String(value)}
                      />
                    );
                  })
                }
              </form>
            </>)
          }

          <PaymentFormSummary />
        </div>

        <PaymentFormPrice />
      </div>
    </div>
  )
}
