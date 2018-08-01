import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/page/Index'
import Login from '../components/page/Login'
import Register from '../components/page/Register'
import UserCenter from '../components/page/userCenter/UserCenter'
import Detail from '../components/page/userCenter/children/Detail'
import NewVote from '../components/page/userCenter/children/NewVote'
import Votes from '../components/page/userCenter/children/Votes'
import Vote from '../components/page/Vote'
import VoteResult from '../components/page/VoteResult'
import AdminLogin from '../components/page/AdminLogin'
import AdminCenter from '../components/page/admin/AdminCenter'
import Charts from '../components/page/admin/children/Charts'
import OperatingRecord from '../components/page/admin/children/OperatingRecord'
import UserManage from '../components/page/admin/children/UserManage'
import VoteRecords from '../components/page/admin/children/VoteRecords'
import VotesManage from '../components/page/admin/children/VotesManage'

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
    },
    {
      path: '/vote',
      component: Vote
    },
    {
      path: '/voteResult',
      component: VoteResult
    },
    {
      path: '/admin/login',
      component: AdminLogin
    },
    {
      path: '/admin',
      component: AdminCenter,
      redirect: '/admin/charts',
      children: [
        {path: 'charts', name: 'Charts', component: Charts},
        {path: 'operatingRecord', name: 'OperatingRecord', component: OperatingRecord},
        {path: 'userManage', name: 'UserManage', component: UserManage},
        {path: 'voteRecords', name: 'VoteRecords', component: VoteRecords},
        {path: 'votesManage', name: 'VotesManage', component: VotesManage}
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
