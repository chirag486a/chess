const arrayConverter = function (obj) {
  const keys = Object.keys(obj);
  const arr = [];
  keys.forEach((prop, index) => {

    if (obj[prop][0] === undefined) return;
    if (Array.isArray(obj[prop][0])) {
      for (const [row, col] of obj[prop]) {
        arr.push([row, col]);
      }
    }
    if (typeof obj[prop][0] === "number") {
      arr.push(obj[prop]);

    }
  });

  return arr;

};


export {arrayConverter} 