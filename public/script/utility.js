const nestLoop = function (handler) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      handler([i, j]);
    }
  }
};

const objLoop = function (obj, handler) {
  const keys = Object.keys(obj)
  for (const key of keys) {
    handler([key])
  }
}

export { nestLoop, objLoop };
