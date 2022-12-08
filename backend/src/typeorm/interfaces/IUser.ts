import { IBlock } from './IBlock';
import { IChatContent } from './IChatContent';
import { IChatMember } from './IChatMemeber';
import { IFriend } from './IFriend';

export interface IUser {
  id: number;
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
  created_at: Date;
  modified_at: Date;
  hashed_refresh_token: string;
  two_factor_activated: boolean;
  two_factor_secret: string;
  two_factor_valid: boolean;
  Friend: IFriend[];
  Block: IBlock[];
  ChatMember: IChatMember[];
  ChatContent: IChatContent[];
}
