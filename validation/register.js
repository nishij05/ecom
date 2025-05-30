import validator from "validator";
import { isEmpty } from "./is-Empty";

export function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 to 30 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "Name must be required";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email must be required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password must be required";
  }
  if (!validator.isLength(data.password, { min: 6, max: 20 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Confirm password must be required";
  }
  if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
