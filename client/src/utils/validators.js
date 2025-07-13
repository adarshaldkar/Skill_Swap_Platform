export const validateSignUpData = (data) => {
  const errors = {};
  if (!data.fullName) errors.fullName = "Full name is required";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email address";
  }
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must contain at least 6 characters";
  }
  if (!data.contract || data.contract.length < 10) {
    errors.contract = "Contact number must be at least 10 digits";
  }
  return errors;
};

export const validateLoginData = (data) => {
  const errors = {};
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email address";
  }
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must contain at least 6 characters";
  }
  return errors;
};