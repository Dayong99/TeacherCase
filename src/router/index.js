import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import db from '@/utils/localstorage'
import request from '@/utils/request'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const constRouter = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  }
]

const adminRouter = [
  {
    path: "/case",
    name: "案例管理",
    component: "Layout",
    meta: {
      title: "案例管理",
      icon: "el-icon-s-management",
      breadcrumb: true,
    },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: "/case",
        name: "案例查询",
        component: "febs/case/Index",
        meta: { title: "案例查询", icon: "", breadcrumb: true },
        hidden: false,
        alwaysShow: false,
      }
    ],
  },
  {
    path: "/system",
    name: "系统管理",
    component: "Layout",
    meta: {
      title: "系统管理",
      icon: "el-icon-setting",
      breadcrumb: true,
    },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: "/system/teacher",
        name: "老师管理",
        component: "febs/system/teacher/Index",
        meta: {
          title: "老师管理",
          icon: "",
          breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
      },
      {
        path: "/system/student",
        name: "学生管理",
        component: "febs/system/student/Index",
        meta: {
          title: "学生管理",
          icon: "",
          breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
      },
      {
        path: "/system/class",
        name: "专业期班",
        component: "febs/system/class/Index",
        meta: {
          title: "专业期班",
          icon: "",
          breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
      },
      {
        path: "/system/role",
        name: "角色管理",
        component: "febs/system/role/Index",
        meta: {
          title: "角色管理",
          icon: "",
          breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
      },
      {
        path: "/system/caseType",
        name: "案例类型",
        component: "febs/system/caseType/Index",
        meta: {
          title: "案例类型",
          icon: "",
          breadcrumb: true,
        },
        hidden: false,
        alwaysShow: false,
      },
    ],
  }]

const teacherRouter = [
  {
    path: "/case",
    name: "案例管理",
    component: "Layout",
    meta: {
      title: "案例管理",
      icon: "el-icon-s-management",
      breadcrumb: true,
    },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: "/case",
        name: "案例查询",
        component: "febs/case/Index",
        meta: { title: "案例查询", icon: "", breadcrumb: true },
        hidden: false,
        alwaysShow: false,
      }
    ],
  },
  {
    path: "/teaching_management",
    name: "案例教学",
    component: "Layout",
    meta: {
      title: "案例教学",
      icon: "el-icon-data-line",
      breadcrumb: true,
    },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: "/teaching_management",
        name: "教学管理",
        component: "febs/teaching_management/teaching/Index",
        meta: { title: "教学管理", icon: "", breadcrumb: true },
        hidden: false,
        alwaysShow: false,
      }
    ],
  },

]

const studentRouter = [



  {
    path: "/study",
    name: "我的学习",
    component: "Layout",
    meta: {
      title: "我的学习",
      icon: "el-icon-s-platform",
      breadcrumb: true,
    },
    hidden: false,
    alwaysShow: true,
    children: [
      {
        path: "/study/now_case",
        name: "当前案例",
        component: "febs/study/now_case/Index",
        meta: { title: "当前案例", icon: "", breadcrumb: true },
        hidden: true,
        alwaysShow: false,
      },
      {
        path: "/study/now_stage",
        name: "教学阶段",
        component: "febs/study/now_stage/Index",
        meta: { title: "教学阶段", icon: "", breadcrumb: true },
        hidden: true,
        alwaysShow: false,
      },
      {
        path: "/study/case",
        name: "教学查询",
        component: "febs/study/case/Index",
        meta: { title: "任务查询", icon: "", breadcrumb: true },
        hidden: false,
        alwaysShow: false,
      },
    ],
  },
]

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {

  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    asyncRouter = null
    next()
  } else {
    const user = store.state.account.user


    if (user.position) {

      if (!asyncRouter) {

        const position = user.position
        if (position == '管理员') {
          asyncRouter = adminRouter
        } else if (position == '老师') {
          asyncRouter = teacherRouter
        } else if (position == '学生') {
          asyncRouter = studentRouter
        }
        store.commit('account/setRoutes', asyncRouter)
        save('USER_ROUTER', asyncRouter)
        go(to, next)

      } else {
        next()
        // next('/login')
      }
    } else {
      if (to.path === '/login') {
        next()
      } else {
        next('/login')
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})


function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)

  router.addRoutes(asyncRouter)
  next({ ...to, replace: true })
}

function save(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function get(name) {
  return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter(routes) {
  if (routes) {
    return routes.filter((route) => {
      const component = route.component
      if (component) {
        if (route.component === 'Layout') {
          route.component = Layout
        } else {
          route.component = view(component)
        }
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children)
        }
        return true
      }
    })
  }

}

function view(path) {
  return function (resolve) {
    //   import(`@/views/${path}.vue`).then(mod => {
    //     resolve(mod)
    //   })
    require([`@/views/${path}.vue`], mod => {
      resolve(mod)
    })
  }
}
export default router
