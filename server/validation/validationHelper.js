import commonValidationRules from "./formValidationRules.js";
import FormValidator from "./FormValidator.js";

export default function validationHelper(data) {
  const fields = Object.keys(data);

  const currentValidationRules = FormValidator.checkValidity(
    commonValidationRules,
    fields
  );

  const customValidator = new FormValidator(currentValidationRules);
  const validation = customValidator.validate(data);

  return validation;
}
