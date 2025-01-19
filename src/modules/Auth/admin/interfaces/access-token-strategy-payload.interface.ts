export interface AdminAccessTokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}
