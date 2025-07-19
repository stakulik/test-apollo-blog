import bcrypt from 'bcryptjs';

import { saltLength } from '../constants';

export const getHash = async (str: string): Promise<string> => bcrypt.hash(str, saltLength);
