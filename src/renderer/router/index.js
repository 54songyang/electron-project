import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/view/home').default,
      redirect:'/mainPage',
      children: [
        {
          path: '/mainPage',
          name: 'mainPage',
          component: require('@/view/mainPage').default,
        },
        {
          path: '/userPage',
          name: 'userPage',
          component: require('@/view/userPage').default,
        },
        {
          path: '/test',
          name: 'test',
          component: require('@/view/test').default,
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
