

import { board } from "./selects.js";
import { retriveRowCol } from "../util/utility.js";

const boardListener = function(handler){
  board.addEventListener("click", function (ev) {
    const [row, col] = retriveRowCol(ev.target);
    handler([row, col])
  })

}
export {boardListener}