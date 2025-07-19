import bcrypt from 'bcryptjs';

export const compareHashes = async (
  data: string,
  encrypted: string,
): Promise<boolean> => bcrypt.compare(data, encrypted);
