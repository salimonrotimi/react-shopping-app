import { validateInput } from "./input-security";

// FORM VALIDATION FOR SIGNUP:
const validateFormRegister = (formInputField) => {
  const newErrors = {};

  if (!validateInput.username(formInputField.username)) {
    newErrors.username =
      "Invalid. Username is required and must be 3-40 characters long.";
  }

  if (!validateInput.email(formInputField.email)) {
    newErrors.email = "Invalid email format.";
  }

  if (!validateInput.password(formInputField.password) || !validateInput.confirm_password(formInputField.confirm_password)) {
    newErrors.password =
      "Invalid. Password and confirm-password must be at least 6 characters, must contain a number and special character such as @$#!%*?&";
  }

  if (formInputField.password !== formInputField.confirm_password) {
    newErrors.matchPassword =
      "Match error! Password and confirm-password do not match.";
  }

  return newErrors;
};

// FORM VALIDATION FOR LOGIN:
const validateFormLogin = (formInputField) => {
  const newErrors = {};

  if (!validateInput.email(formInputField.email)) {
    newErrors.email = "Invalid email format.";
  }

  if (!validateInput.password(formInputField.password)) {
    newErrors.password =
      "Invalid. Password must be at least 6 characters and contains a number and special character such as @$#!%*?&.";
  }

  return newErrors;
};

// FORM VALIDATION FOR PASSWORD CHANGE:
const validateFormPassword = (formInputField) => {
  const newErrors = {};

  if (!validateInput.email(formInputField.email)) {
    newErrors.email = "Invalid email format.";
  }

  if (!validateInput.password(formInputField.password) || !validateInput.confirm_password(formInputField.confirm_password)) {
    newErrors.password =
      "Invalid. Password and confirm-password must be at least 6 characters, must contain a number and special character such as @$#!%*?&.";
  }

  if (formInputField.password !== formInputField.confirm_password) {
    newErrors.matchPassword =
      "Match error! Password and confirm-password do not match.";
  }

  return newErrors;
};

export { validateFormRegister, validateFormLogin, validateFormPassword };
