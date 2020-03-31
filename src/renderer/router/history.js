const History = {
  _history: [], // 历史记录堆栈
  i: -1,
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$routerHistory', {
      get() {
        return History;
      }
    })
  },
  push(path) {
    this._history.push({
      path,
      index: this.i++
    });
  },
  pop() {
    this._history.pop();
  },
  canBack() {
    return this._history.length > 1;
  },
  canNext(){
    return this._history.length;
  }
}
export default History;