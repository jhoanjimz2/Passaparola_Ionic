export interface SmsSendCodeRequest {
  from: string;
  to: string;
  text: string;
  languageCode: string;
  hash?: string;
}
