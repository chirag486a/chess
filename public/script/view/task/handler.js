

import { board } from "./selects.js";
import { listen } from "../util/utility.js";

const boardListener = function(handler){
  listen("click", board, handler)

}
export {boardListener}