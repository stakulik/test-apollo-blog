import type { IncomingMessage } from 'http';

import { UserData } from './user-data.interface';

export interface IncomingRequestContext {
  userData: UserData | null;
  req: IncomingMessage;
}
