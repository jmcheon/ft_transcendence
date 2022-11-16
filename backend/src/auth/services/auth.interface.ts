import { UserDetails } from 'src/utils/types';

export interface IAuthService {
  validateUser(userDetails: UserDetails);
  createUser(userDetails: UserDetails);
  getTokens(id: number);
  getAccessToken(id: number);
  getAccessToken(id: number);
}