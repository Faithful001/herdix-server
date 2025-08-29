import { Token } from '../enums/token.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  purpose: Token;
}
