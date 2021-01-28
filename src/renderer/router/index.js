import router from './history.js'
import { constantRoutes, resetRouter } from './router'
router.beforeEach(async (to, from, next) => {
  next();
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
