import FormValidator from "../validation/FormValidator.js";
import isJSON from "./isJSON.js";

const excludedParams = ["letterSubject", "letterHtml"];

export default function queryCreator(data) {
  return Object.keys(data).reduce((queryObject, param) => {
    if (isJSON(data[param])) {
      queryObject[param] = JSON.parse(data[param]);
    } else if (
      (!FormValidator.isEmpty(data[param]) || Array.isArray(data[param])) &&
      !excludedParams.includes(param)
    ) {
      queryObject[param] = data[param];
    }

    return queryObject;
  }, {});
}
