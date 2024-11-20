// 随机数生成方法
const createRandom = (minnum, maxnum) => {
  return Math.floor(Math.random() * (maxnum - minnum + 1)) + minnum;
};
// 节流
const throttleTimeAndTimer = (fun, wait) => {
  let preTime = Date.now();
  let timeout = null;
  return function () {
    let context = this;
    let args = [...arguments];
    let nowTime = Date.now();
    if (nowTime - preTime >= wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      preTime = Date.now();
      fun.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        fun.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
};

export { createRandom, throttleTimeAndTimer };
