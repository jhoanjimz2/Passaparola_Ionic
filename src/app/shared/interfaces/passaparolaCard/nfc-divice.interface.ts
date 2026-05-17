export interface NfcDivice {
  countryCode: string;
  status?: boolean;
  isAssing?: boolean;
  nfcSerial: string;
  nfcType?: NfcType;
  nfcStatus?: NfcStatus;
  quantity: number;
  community: string;
  id?: string;
  userId: string;
  securityAmount: number;
}

interface NfcStatus {
  id?: string;
  description?: string;
  nfcStatusTranslation?: NfcTypeTranslation[];
  passaparolaCard?: string[];
}

interface NfcType {
  id?: string;
  description?: string;
  image?: string;
  nfcTypeTranslation?: NfcTypeTranslation[];
  passaparolaCard?: string[];
}

interface NfcTypeTranslation {
  id?: string;
  description?: string;
  languageCode?: string;
}
