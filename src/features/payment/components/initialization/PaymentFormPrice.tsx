import { PackResponse } from '@/types/service'
import { useTranslations } from 'next-intl'

export default function PaymentFormPrice({
  pack,
}: {
  pack: PackResponse | null
}) {
  const t = useTranslations('payment.summary')
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">{pack?.name}</span>
              <span className="font-medium">{pack?.price} €</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-lg font-semibold">{t('total')}</span>
              <span className="text-lg font-semibold">{pack?.price} €</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            {t('helpTitle')}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{t('helpText')}</p>
          <div className="flex items-center text-sm text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{t('helpPhone')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
