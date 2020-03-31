import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'

Vue.use(VueRouter)

const RouterConfig = {
  mode: 'hash',
  routes: routers,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}
var backFlag = false;
const router = new VueRouter(RouterConfig);
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
    console.log('123',this._history.slice(sta, end));
    this._history = this._history.slice(sta, end);
  },
  // canBack() {
  //   return this._history[this._index].index === this._index;
  // },
  // canNext() {
  //   return this._history.length;
  // }
}
router.goBack = function () {
  backFlag = true;
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

router.afterEach((to, from) => {
  const ind = router.historyRecord._index;
  if (router.isBack) {
    router.isBack = false;
  } else if (router.isNext) {
    router.isNext = false;
  } else if (backFlag) {
    backFlag = false;
    router.historyRecord.slice(0, ind + 1);
    router.historyRecord.push(to.path);
  } else {
    router.historyRecord.push(to.path);
  }
})

export default router