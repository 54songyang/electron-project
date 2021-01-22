import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
import store from '../store'

Vue.use(VueRouter)

const RouterConfig = {
  mode: 'hash',
  routes: routers,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}
let backFlag = false;


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


router.beforeEach(async (to, from, next) => {
  try {
    let playlist = store.state.page.playlist;
    if (playlist && playlist.length > 0) {
      next()
    } else {
      const children = routers[0].children
      const userId = store.state.page.userInfo.account.id
      playlist = await store.dispatch("getUserPlaylist", userId)
      const newList = playlist.filter(el => children.every(el1 => el1.path !== el.path))
      const newRouter = newList.map((el, index) => {
        return {
          path: `/ownMenu${el.id}`,
          name: `ownMenu${el.id}`,
          component: require('@/view/navPage/ownMenu').default,
          meta: {
            pageNav: index + 11
          }
        }
      })
      routers[0].children = newRouter
      store.commit("SET_PLAYLIST", playlist)
      router.addRoutes(routers)
      next()
    }
  } catch (error) {
    console.log("error", error);
  }
})

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