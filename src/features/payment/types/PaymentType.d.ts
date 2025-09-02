export interface PaymentSecureAcceptanceData {
  cybersourceUrl: string;
  formData: Record<string, string>
}

export interface PaymentData {
  message: string;
  isRefunded: boolean;
  decision: string;
  transactionId: string;
  billEmail: string;
  cardType: string;
  cardNumber: string;
  countryCode: string;
  postalCode: string;
  city: string;
  address: string;
  fullName: string;
  currency: string;
  price: string;
  id: number;
  [key: string]: string;
}