import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/page/Index'
import Login from '../components/page/Login'
import Register from '../components/page/Register'
import UserCenter from '../components/page/userCenter/UserCenter'
import Detail from '../components/page/userCenter/children/Detail'
import NewVote from '../components/page/userCenter/children/NewVote'
import Votes from '../components/page/userCenter/children/Votes'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/userCenter',
      component: UserCenter,
      redirect: '/userCenter/detail',
      children: [
        {path: 'detail', name: 'Detail', component: Detail},
        {path: 'newVote', name: 'NewVote', component: NewVote},
        {path: 'votes', name: 'Votes', component: Votes}
      ]
    }
  ]
})
