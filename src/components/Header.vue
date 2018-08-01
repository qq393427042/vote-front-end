<template>
  <div class="header">
    <div class="left_block">
      <router-link to="/">
        <font-awesome-icon :icon="['fab', 'vuejs']" class="fa-4x"></font-awesome-icon>
      </router-link>
      <h4>投票系统</h4>
    </div>
    <div class="right_block">
      <div class="right_item">
        <router-link to="/admin">后台</router-link>
      </div>
      <div class="right_item">
        <el-input placeholder="搜索投票" prefix-icon="el-icon-search" v-model="search_keyword"></el-input>
      </div>
      <div class="right_item">
        <el-dropdown placement="bottom">
          <font-awesome-icon @click="check" class="hoverPointer fa-2x" style="color: white" :icon="['fas', 'user']"></font-awesome-icon>
          <el-dropdown-menu v-if="dropShow" slot="dropdown">
            <el-dropdown-item @click.native="handleClick(item.path)" v-for="item in dropMenuItems" v-bind:key="item.index">{{item.name}}</el-dropdown-item>
            <el-dropdown-item @click.native="quit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {checkState, userMenu, userQuit} from '../api/index.js'
export default {
  name: 'Header',
  data () {
    return {
      search_keyword: '',
      cart_num: 0,
      dropMenuItems: [],
      dropShow: true
    }
  },
  methods: {
    quit () {
      userQuit().then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.push('/')
        } else if (res.state === 1) {
          this.$message.success(res.message)
          this.$router.push('/')
        }
      })
    },
    handleClick (path) {
      this.$router.push('/userCenter/' + path)
    },
    check () {
      checkState().then(res => {
        if (res.state === 0) {
          this.$router.push('/login')
        } else {
          console.log('已登录')
          this.isShow = true
          this.$router.push('/userCenter')
        }
      })
    },
    initDropMenu () {
      userMenu().then(res => {
        if (res.state === 0) {
          // this.$message.warning(res.message)
          // console.log(res.message)
          this.dropShow = false
          // this.$router.push('/')
        } else if (res.state === 1) {
          for (var i in res.data) {
            this.dropMenuItems.push({
              index: res.data[i].id,
              name: res.data[i].name,
              roleId: res.data[i].roleId,
              path: res.data[i].path
            })
          }
          this.dropShow = true
        }
      })
    }
  },
  beforeMount () {
    this.initDropMenu()
  }
}
</script>

<style scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    background-color: #409EFF;
    color: white;
    height: 100%;
    width: 100%;
  }
  .el-header{
  }
  .header a{
    color: white;
    text-decoration: none;
  }
  .left_block{
    margin-left: 100px;
    display: flex;
    align-items: center;
  }
  .right_block{
    display: flex;
    align-items: center;
    height: 50px;
    margin-right: 20px;
  }
  .right_block .right_item{
    padding-right: 50px;
  }
  .hoverPointer:hover{
    cursor: pointer;
  }
</style>
