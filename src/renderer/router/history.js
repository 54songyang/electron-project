import router from './router'

router.backFlag = false;

router.historyRecord = {
  _history: [], // 历史记录堆栈
  _index: -1,
  push(path) {
    this._history.push({
      path,
      index: this._index++
    });
  },
  slice(sta, end) {
    this._history = this._history.slice(sta, end);
  },
  canBack() {
    return this._index >= 1
  },
  canNext() {
    return this._index < this._history.length - 1;
  }
}
router.goBack = function () {
  router.backFlag = true;
  const his = this.historyRecord._history;
  const ind = this.historyRecord._index;
  if (this.historyRecord._index == 0) return;
  this.isBack = true;
  this.historyRecord._index--;
  if (!his[ind - 1]) return;
  router.push(his[ind - 1].path);
}
router.goNext = function () {
  const his = this.historyRecord._history;
  const ind = this.historyRecord._index;
  if (!his[ind + 1]) return;
  this.isNext = true;
  router.push(his[ind + 1].path);
  this.historyRecord._index++;
}

export default router