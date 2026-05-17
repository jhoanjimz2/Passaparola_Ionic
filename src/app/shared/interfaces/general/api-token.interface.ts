export interface ApiToken {
  krathemis?: boolean;
  krathemisBasic?: boolean;
  unika?: boolean;
  unikaBasic?: boolean;
  applicationJson?: boolean;
  apiGateway?: boolean;
  showSpinner?: boolean;
  isPublic?: boolean;  // Nuevo flag
  skipAuth?: boolean;  // Para peticiones sin token
}
