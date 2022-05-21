import { User } from './user.model';

export interface TokenResponse {
  user: User;
  exp: number;
  ist: number;
}
