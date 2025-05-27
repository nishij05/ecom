import validator from "validator";
import { isEmpty } from "./is-Empty";

export function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email must be required";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password must be required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
