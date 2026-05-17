export type ContractStatus = 'pending' | 'signed' | 'approved' | 'rejected';

export interface ContractUser {
  id: string;
  email: string;
  phoneNumber: string;
  userID: string;
  status: boolean;
  countryCode: string;
  rol: string;
  profile: {
    id: string;
    name: string;
    lastName: string;
    username: string;
    profilePictureUrlFile: string;
    idCardVerified: boolean;
    proofResidencyVerified: boolean;
  };
  country: {
    id: string;
    code: string;
    phonePrefix: string;
    name: string;
  };
}

export interface Contract {
  id: string;
  type: string | null;
  status: ContractStatus;
  documentUrl: string;
  expirationDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: ContractUser;
}

export interface ContractListResponse {
  data: Contract[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
}

export interface ContractListParams {
  limit?: number;
  offset?: number;
  keyword?: string;
  languageCode?: string;
}
