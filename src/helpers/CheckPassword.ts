// Used to check is a password has at least 1 uppercase letter,
// a number nad is 8 characters long.

export const checkPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};
