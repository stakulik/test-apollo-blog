import type { JwtPayload } from 'jsonwebtoken';

export interface JWTAuthPayload extends JwtPayload {
  user_data: { email: string };
}
