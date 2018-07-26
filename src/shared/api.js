import { base, defaultHeaders } from "./api/config.mjs";
import responseHandler from "./api/responseHandler";

export const get = function (path, args = {} ) {
  const uri = `${base}/${path}`;
  const options = Object.assign({}, defaultHeaders);
  const { pagination } = args;
  return fetch(uri, defaultHeaders).then(responseHandler);
}
