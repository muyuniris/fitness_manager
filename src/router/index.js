import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dash from '../views/Dash.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/home"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/home',
    component: Home,
    children:[
      {
        path:'',
        name:'Dash',
        component:Dash,
        meta: {
          auth: true
        }
      },
      {
        path:'vip',
        name:'Vip',
        component:() => import('../views/Vip.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addvip',
        name:'AddVip',
        component:() => import('../views/AddVip.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'showvip/:id',
        name:'ShowVip',
        component:() => import('../views/ShowVip.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'altervip/:id',
        name:'AlterVip',
        component:() => import('../views/AlterVip.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'teacher',
        name:'Teacher',
        component:() => import('../views/Teacher.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addTeacher',
        name:'AddTeacher',
        component:() => import('../views/AddTeacher.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'showTeacher/:id',
        name:'ShowTeacher',
        component:() => import('../views/ShowTeacher.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterTeacher/:id',
        name:'AlterTeacher',
        component:() => import('../views/AlterTeacher.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'course',
        name:'Course',
        component:() => import('../views/Course.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addCourse',
        name:'AddCourse',
        component:() => import('../views/AddCourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'showCourse/:id',
        name:'ShowCourse',
        component:() => import('../views/ShowCourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterCourse/:id',
        name:'AlterCourse',
        component:() => import('../views/AlterCourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'coursePlan',
        name:'CoursePlan',
        component:() => import('../views/CoursePlan.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addPlan',
        name:'AddPlan',
        component:() => import('../views/AddPlan.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterPlan/:id',
        name:'AlterPlan',
        component:() => import('../views/AlterPlan.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'place',
        name:'Place',
        component:() => import('../views/Place.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addPlace',
        name:'AddPlace',
        component:() => import('../views/AddPlace.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterPlace/:id',
        name:'AlterPlace',
        component:() => import('../views/AlterPlace.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'suggest',
        name:'Suggest',
        component:() => import('../views/Suggest.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'role',
        name:'Role',
        component:() => import('../views/Role.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addRole',
        name:'AddRole',
        component:() => import('../views/AddRole.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterRole/:id',
        name:'AlterRole',
        component:() => import('../views/AlterRole.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'orderCourse',
        name:'OrderCourse',
        component:() => import('../views/OrderCourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'orderTeacher',
        name:'OrderTeacher',
        component:() => import('../views/OrderTeacher.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'orderPlace',
        name:'OrderPlace',
        component:() => import('../views/OrderPlace.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'notice',
        name:'Notice',
        component:() => import('../views/Notice.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'showNotice/:id',
        name:'ShowNotice',
        component:() => import('../views/ShowNotice.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'alterNotice/:id',
        name:'AlterNotice',
        component:() => import('../views/AlterNotice.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'addNotice',
        name:'AddNotice',
        component:() => import('../views/AddNotice.vue'),
        meta: {
          auth: true
        }
      },
      {
        path:'myData',
        name:'MyData',
        component:() => import('../views/MyData.vue'),
        meta: {
          auth: true
        }
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 注册全局守卫
// 在访问路由之前进行拦截
router.beforeEach((to, from, next) => {
  // 获取 token，登录的标识
  var token = sessionStorage.getItem("token")

  if(to.meta.auth) { // 判断是否需要权限
    if(token) { // 再次判断是否已经有权限了
      next()
    } else {
      next({ // 没有权限，导向登录页
        path: "/login",
        query: {redirect: to.fullPath} // 记录原本想访问的路由
      })
    }
  } else {
    next() // 想去哪就去哪
  }
})

export default router
