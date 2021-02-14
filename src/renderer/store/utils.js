export default {
  selectRandom(max) {
    let arr = [];
    for (let i = 0; i < max; i++) {
      let arrNum = parseInt(Math.random() * max);
      let flag = true;
      for (let j = 0; j <= arr.length; j++) {
        if (arrNum == arr[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        arr.push(arrNum);
      } else {
        i--;
      }
    }
    return arr;
  }
}