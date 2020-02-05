export default {
  getObjFromArray
}

function getObjFromArray(arr, key, val) {
  return arr.find(item => item[key] === val) || {}
}
