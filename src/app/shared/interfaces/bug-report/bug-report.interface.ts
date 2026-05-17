export interface BugReport {
  id?: string;
  description: string;
  userId: string;
  walletFrom: string;
  walletTo: string;
  images: string[];
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
