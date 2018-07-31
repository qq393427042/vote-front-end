<template>
  <div class="admin_header">
    <div class="left_block">
      <router-link to="/">
        <font-awesome-icon :icon="['fab', 'vuejs']" class="fa-4x"></font-awesome-icon>
      </router-link>
      <h4>VoteAdmin</h4>
    </div>
    <div class="right_block">
      <div class="right_item">
        <el-dropdown placement="bottom">
          <font-awesome-icon class="hoverPointer fa-2x" style="color: white" :icon="['fas', 'user']"></font-awesome-icon>
          <el-dropdown-menu v-if="dropShow" slot="dropdown">
            <el-dropdown-item @click.native="quit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {adminQuit, checkAdminLogin} from '../../../api'
export default {
  name: 'AdminHeader',
  data () {
    return {
      dropMenuItems: [],
      dropShow: true
    }
  },
  methods: {
    quit () {
      adminQuit().then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.push('/')
        } else if (res.state === 1) {
          this.$message.success(res.message)
          this.$router.push('/')
        }
      })
    },
    initDropMenu () {
      checkAdminLogin().then(res => {
        if (res.state === 0) {
          this.dropShow = false
        } else if (res.state === 1) {
          this.dropShow = true
        }
      })
    }
  }
}
</script>

<style scoped>
  .admin_header{
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
  .admin_header a{
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
