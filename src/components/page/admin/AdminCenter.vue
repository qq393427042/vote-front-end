<template>
  <div class="adminCenter">
    <el-container>
      <el-header style="height: 80px">
        <admin-header></admin-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
              <template slot="title">
                <font-awesome-icon :icon="['fas', 'chart-bar']"></font-awesome-icon>
                <span slot="title">图表统计</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2">
              <font-awesome-icon :icon="['fas', 'table']"></font-awesome-icon>
              <span slot="title">投票管理</span>
            </el-menu-item>
            <el-menu-item index="3">
              <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <font-awesome-icon :icon="['fas', 'table']"></font-awesome-icon>
              <span slot="title">投票记录管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {checkAdminLogin} from '../../../api'
import AdminHeader from './AdminHeader'
export default {
  name: 'AdminCenter',
  components: {
    AdminHeader
  },
  data () {
    return {
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  beforeCreate () {
    // 创建之前检查登录状态
    checkAdminLogin().then(res => {
      if (res.state === 0) {
        this.$router.replace('/admin/login')
      } else if (res.state === 1) {
      }
    })
  }
}
</script>

<style scoped>
  .adminCenter{
  }
  .el-header, .el-footer {
    width: 100%;
    background-color: #3499ff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
