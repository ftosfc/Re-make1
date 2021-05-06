import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from "../components/Welcome";
// import Users from "../components/user/Users";
const Users = () => import("../components/user/Users")
const Ipfix = () => import("../components/user/Ipfix")
const Netlogic = () => import("../components/topo/Netlogic")
const Netmac = () => import("../components/topo/Netmac")
const Ate = () => import("../components/Ate")
const Netstatus = () => import("../components/twin/Netstatus")
const Secanalysis = () => import("../components/twin/Secanalysis")
Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: Users},
            {path: '/ipfix', component: Ipfix},
            {path: '/netlogic', component: Netlogic},
            {path: '/netmac', component: Netmac},
            {path: '/ate', component: Ate},
            {path: '/netstatus', component: Netstatus},
            {path: '/secanalysis', component: Secanalysis}
        ]
    },


]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//挂载路由导航守卫，防止未登录直接跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next();
})
export default router
