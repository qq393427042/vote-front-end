<template>
  <div>
    <el-container>
      <el-header style="height: 80px; margin-bottom: 15px">
        <is-header></is-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="headBox">
            <font-awesome-icon v-if="!userInfo.head" :icon="['far', 'question-circle']" class="fa-4x"></font-awesome-icon>
            <img class="headImage" v-else :src="this.staticFilePath + userInfo.head"/>
          </div>
          <h4 v-if="userInfo.name">{{userInfo.name}}</h4>
          <h4 v-else>还未设置昵称</h4>
          <el-menu v-bind:default-active="defaultActive" class="el-menu-vertical-demo"
                   @open="handleOpen"
                   @close="handleClose">
            <el-menu-item @click="showView(item.path)"
                          v-for="item in menuItems"
                          :key="item.index"
                          :index="item.index.toString()">
              {{item.name}}
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {userMenu, userInfo} from '../../../api/index.js'
import isHeader from '../../Header'
import bus from '../../../eventBus'
import moment from 'moment'
export default {
  name: 'UserCenter',
  components: {
    isHeader
  },
  data () {
    return {
      isShow: false,
      defaultActive: '3',
      menuItems: [],
      userInfo: {
        head: '',
        createTime: '',
        id: '',
        lastLoginTime: '',
        modifyTime: '',
        name: '',
        sex: '',
        state: '',
        username: ''
      }
    }
  },
  methods: {
    showView (e) {
      this.$router.push('/userCenter/' + e)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    getMenu () {
      userMenu().then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
        } else if (res.state === 1) {
          for (var i in res.data) {
            this.menuItems.push({
              index: (parseInt(i) + 1),
              name: res.data[i].name,
              roleId: res.data[i].roleId,
              path: res.data[i].path
            })
          }
        }
      })
    },
    getUserInfo () {
      userInfo().then(res => {
        let data = res.data
        this.userInfo['head'] = data.head
        this.userInfo['createTime'] = moment(new Date(res.data.createTime)).format('YYYY-MM-DD')
        this.userInfo['id'] = data.id
        this.userInfo['lastLoginTime'] = moment(new Date(res.data.lastLoginTime)).format('YYYY-MM-DD')
        this.userInfo['modifyTime'] = moment(new Date(res.data.modifyTime)).format('YYYY-MM-DD')
        this.userInfo['name'] = data.name
        this.userInfo['sex'] = data.sex
        this.userInfo['state'] = data.state
        this.userInfo['username'] = data.username
      })
    },
    activeMenuItem () {
      bus.$on('exMenu', e => {
        console.log('change active ' + e)
        this.defaultActive = e
      })
      let path = this.$route.path
      if (path === '/userCenter/detail') {
        this.defaultActive = '1'
        // bus.$emit('userInfo', this.userInfo)
      } else if (path === '/userCenter/votes') {
        this.defaultActive = '2'
      } else if (path === '/userCenter/newVote') {
        this.defaultActive = '3'
        console.log(this.menuItems)
      }
    },
    changeHead () {
      bus.$on('changeHead', headPath => {
        this.userInfo.head = headPath
      })
    },
    changeName () {
      bus.$on('changeName', name => {
        console.log('change name : ' + name)
        this.userInfo.name = name
      })
    }
  },
  mounted () {
    this.getUserInfo()
    this.getMenu()
    this.activeMenuItem()
    this.changeHead()
    this.changeName()
  }
}
</script>

<style scoped>
  .el-header{
    padding: 0;
  }
  .headImage{
    width: 80px;
    height: 80px;
    display: block;
  }
  .headBox{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>
