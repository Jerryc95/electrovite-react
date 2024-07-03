// Used to check if a phone has is only in 123-456-7890 or (123) 456-7890 format,
// a number nad is 8 characters long.

export const checkPhone = (phone: string) => {
    // const phoneRegex = /^(\(\d{3}\)\s|\d{3}-)\d{3}-\d{4}$/;
    const phoneRegex = /^$|^(\(\d{3}\)\s|\d{3}-)\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };
  