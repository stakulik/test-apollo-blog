const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  if (email.length === 0 || email.length > 254) {
    return false;
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }

  return emailRegex.test(email);
};
