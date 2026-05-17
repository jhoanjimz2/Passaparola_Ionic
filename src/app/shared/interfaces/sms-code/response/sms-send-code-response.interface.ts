export interface SmsSendCodeResponse {
  entity: Entity;
  code: string;
}

interface Entity {
  id: string;
  clientId: string;
  status: string;
  statusCode?: any;
  from: string;
  country: string;
  to: string;
  normalizedTo: string;
  mccMnc?: any;
  charsCount: number;
  text: string;
  deliveredText: string;
  messagesCount: number;
  encoding: string;
  unicode: boolean;
  allowUnicode: boolean;
  charged: boolean;
  pricePerSms: number;
  priceUser: number;
  scheduledAt?: any;
  sentAt?: any;
  deliveredAt?: any;
  audienceContact?: any;
  metadata: Metadata;
}

interface Metadata {
  organizationName: string;
  organizationId: string;
  sendName: string;
  sendId: string;
}
