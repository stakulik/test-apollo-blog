export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>'"&]/g, '');
};
