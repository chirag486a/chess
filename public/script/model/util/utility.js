const store = function (id, data) {
  localStorage.setItem(id, JSON.stringify(data));
  return data;
};
const read = function (id) {
  return JSON.parse(localStorage.getItem(id));
};
const remove = function (id) {
  localStorage.removeItem(id);
};



export {store, read, remove}