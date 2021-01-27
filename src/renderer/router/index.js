import router from './history.js'
import store from '../store'
import { constantRoutes, resetRouter } from './router'
// resetRouter 初始化路由（退出登录？）
const playlist = store.state.page.playlist
let userRoute = [];
router.beforeEach(async (to, from, next) => {
  try {
    if (!playlist.length) {
      // *** 未登录跳转首页
    }
    //  else if (playlist.length && !userRoute.length) {
    //   const newList = playlist.filter(el => constantRoutes.every(el1 => el1.path !== el.path))
    //   userRoute = newList.map((el, index) => {
    //     return {
    //       path: `/ownMenu${el.id}`,
    //       name: `ownMenu${el.id}`,
    //       component: require('@/view/navPage/ownMenu').default,
    //       meta: {
    //         pageNav: index + 11
    //       }
    //     }
    //   })
    //   router.addRoutes(userRoute)
    // }
    next();
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
  } else if (router.backFlag) {
    router.backFlag = false;
    router.historyRecord.slice(0, ind + 1);
    router.historyRecord.push(to.path);
  } else {
    router.historyRecord.push(to.path);
  }
})
export default router
