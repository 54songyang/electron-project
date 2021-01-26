export const routers = [
  {
    path: '/',
    name: 'home',
    component: require('@/view/home').default,
    redirect: '/mainPage',
    children: [
      {
        path: '/mainPage',
        name: 'mainPage',
        component: require('@/view/navPage/mainPage/mainPage').default,
        meta: {
          pageNav: 0,
          topNav: 0,
          topName: 'mainPageTop'
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
          pageNav: 5,
          pageTitle: 'iTunes音乐'
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
          pageNav: 7,
          pageTitle: '我的音乐云盘'
        }
      },
      {
        path: '/radioNav',
        name: 'radioNav',
        component: require('@/view/navPage/radioNav').default,
        meta: {
          pageNav: 8,
          pageTitle: '我的电台'
        }
      },
      {
        path: '/collectionNav',
        name: 'collectionNav',
        component: require('@/view/navPage/collectionNav').default,
        meta: {
          pageNav: 9
        }
      },
      {
        path: '/setInfo',
        name: 'setInfo',
        component: require('@/view/navPage/setInfo').default,
        meta: {
          pageNav: '',
          pageTitle: '编辑个人信息'
        }
      },
      {
        path: '/userPage',
        name: 'userPage',
        component: require('@/view/userPage').default,
        meta: {
          pageNav: '',
        }
      },
      //首页详情
      {
        path: '/songSheet',
        name: 'songSheet',
        component: require('@/view/navPage/songSheet').default,
        meta: {
          pageNav: 0,
          topNav: 1,
          topName: 'mainPageTop'
        }
      },
      {
        path: '/recommend',
        name: 'recommend',
        component: require('@/view/navPage/recommend').default,
        meta: {
          pageNav: '',
          pageTitle: '独家放送'
        }
      },
      {
        path: '/newsong',
        name: 'newsong',
        component: require('@/view/navPage/newsong').default,
        meta: {
          pageNav: 0,
          topNav: 5,
          topName: 'mainPageTop'
        }
      },
      {
        path: '/personalizedMv',
        name: 'personalizedMv',
        component: require('@/view/navPage/personalizedMv').default,
        meta: {
          pageNav: 2
        }
      },
      {
        path: '/djprogram',
        name: 'djprogram',
        component: require('@/view/navPage/djprogram').default,
        meta: {
          pageNav: 0,
          topNav: 2,
          topName: 'mainPageTop'
        }
      },
      {
        path: '/rankingList',
        name: 'rankingList',
        component: require('@/view/navPage/rankingList').default,
        meta: {
          pageNav: 0,
          topNav: 3,
          topName: 'mainPageTop'
        }
      },
      {
        path: '/singer',
        name: 'singer',
        component: require('@/view/navPage/singer').default,
        meta: {
          pageNav: 0,
          topNav: 4,
          topName: 'mainPageTop'
        }
      },
    ]
  },
  {
    path: '/miniPage',
    name: 'miniPage',
    component: require('@/view/miniPage').default,
    meta: {
      pageNav: ''
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]