const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (email: string): boolean => emailRegex.test(email);
