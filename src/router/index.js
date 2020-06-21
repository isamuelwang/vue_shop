import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from "../components/user/Users"
import {nextDate} from "element-ui/src/utils/date-util";
import Rights from "../components/power/Right.vue";
import Roles from "../components/power/Roles.vue"

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users',component: Users},
        {path: '/rights',component:Rights},
        {path: '/roles',component:Roles}
      ]}
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
