import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 单层菜单：1.他的children内hidden为false的项只有一项才能渲染，有多项要将其他项加上hidden:true
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/dashboard/index'),
      // 路由元
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }
  // {
  //   path: '/permission',
  //   meta: {
  //     name: 'permissions'
  //   },
  //   component: Layout,
  //   children: [{
  //     path: '',
  //     name: 'approvals',
  //     // hidden: true, // 是否菜单渲染
  //     component: () => import('@/views/permission/index'),
  //     // 路由元
  //     meta: { title: '权限管理', icon: 'lock' }
  //   }]
  // }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]
// 动态路由
export const syncRoutes = [
  {
    path: '/departments',
    component: Layout,
    meta: {
      name: 'departments'
    },
    children: [{
      path: '',
      name: 'departments',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/departments/index'),
      // 路由元
      meta: { title: 'route.departments', icon: 'tree' }
    }]
  },
  {
    path: '/employees',
    component: Layout,
    meta: {
      name: 'employees'
    },
    children: [
      {
        path: '',
        name: 'employees',
        // hidden: true, // 是否菜单渲染
        component: () => import('@/views/employees/index'),
        // 路由元
        meta: { title: '员工', icon: 'people' }
      },
      {
        path: 'import', //  /employees/import
        name: 'import',
        // hidden: true, // 是否菜单渲染
        component: () => import('@/views/employees/import'),
        meta: {},
        hidden: true // 不在菜单中显示
      },
      {
        path: 'detail/:id', //  /employees/import
        name: 'detail',
        // hidden: true, // 是否菜单渲染
        component: () => import('@/views/employees/detail'),
        meta: {},
        hidden: true // 不在菜单中显示
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    meta: {
      name: 'settings'
    },
    children: [{
      path: '',
      name: 'setting',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/setting/index'),
      // 路由元
      meta: { title: '公司设置', icon: 'setting' }
    }]
  },
  {
    path: '/salarys',
    component: Layout,
    meta: {
      name: 'salarys'
    },
    children: [{
      path: '',
      name: 'salarys',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/salarys/index'),
      // 路由元
      meta: { title: '工资', icon: 'money' }
    }]
  },
  {
    path: '/social',
    component: Layout,
    meta: {
      name: 'social_securitys'
    },
    children: [{
      path: '',
      name: 'social',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/social/index'),
      // 路由元
      meta: { title: '社保', icon: 'table' }
    }]
  },
  {
    path: '/attendances',
    component: Layout,
    meta: {
      name: 'attendances'
    },
    children: [{
      path: '',
      name: 'attendances',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/attendances/index'),
      // 路由元
      meta: { title: '考勤', icon: 'skill' }
    }]
  },
  {
    path: '/approvals',
    component: Layout,
    meta: {
      name: 'approvals'
    },
    children: [{
      path: '',
      name: 'approvals',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/approvals/index'),
      // 路由元
      meta: { title: '审批', icon: 'tree-table' }
    }]
  },
  {
    path: '/permission',
    meta: {
      name: 'permissions'
    },
    component: Layout,
    children: [{
      path: '',
      name: 'approvals',
      // hidden: true, // 是否菜单渲染
      component: () => import('@/views/permission/index'),
      // 路由元
      meta: { title: '权限管理', icon: 'lock' }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
  // routes: [...constantRoutes, ...syncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
