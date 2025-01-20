export interface BaseIdentity {
  id: string;
  name: string;
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
  refreshToken?: string;
}
