import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/view/home').default,
      redirect: '/mainPage',
      children: [
        {
          path: '/mainPage',
          name: 'mainPage',
          component: require('@/view/navPage/mainPage').default,
          meta: {
            pageNav: 0
          }
        },
        {
          path: '/ownFm',
          name: 'ownFm',
          component: require('@/view/navPage/ownFm').default,
          meta: {
            pageNav: 1
          }
        },
        {
          path: '/videoNav',
          name: 'videoNav',
          component: require('@/view/navPage/videoNav').default,
          meta: {
            pageNav: 2
          }
        },
        {
          path: '/friendNav',
          name: 'friendNav',
          component: require('@/view/navPage/friendNav').default,
          meta: {
            pageNav: 3
          }
        },
        {
          path: '/itunesNav',
          name: 'itunesNav',
          component: require('@/view/navPage/itunesNav').default,
          meta: {
            pageNav: 5
          }
        },
        {
          path: '/downLoadNav',
          name: 'downLoadNav',
          component: require('@/view/navPage/downLoadNav').default,
          meta: {
            pageNav: 6
          }
        },
        {
          path: '/cloudNav',
          name: 'cloudNav',
          component: require('@/view/navPage/cloudNav').default,
          meta: {
            pageNav: 7
          }
        },
        {
          path: '/radioNav',
          name: 'radioNav',
          component: require('@/view/navPage/radioNav').default,
          meta: {
            pageNav: 8
          }
        },
        {
          path: '/collectionNav',
          name: 'collectionNav',
          component: require('@/view/navPage/collectionNav').default,
          meta: {
            pageNav: 10
          }
        },
        {
          path: '/userPage',
          name: 'userPage',
          component: require('@/view/userPage').default,
          meta: {
            pageNav: ''
          }
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
