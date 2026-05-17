export interface EmailSendCodeRequest {
  sender?: DataEmail;
  to: DataEmail[];
  subject: string;
  htmlContent?: string;
  htmlText?: string;
}

interface DataEmail {
  name: string;
  email: string;
}
