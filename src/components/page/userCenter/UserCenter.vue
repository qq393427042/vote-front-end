<template>
  <div>
    <el-container>
      <el-header style="height: 80px">
        <is-header></is-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <h4>haha</h4>
          <el-menu v-bind:default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
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
import {userMenu} from '../../../api/index.js'
import isHeader from '../../Header'
export default {
  name: 'UserCenter',
  components: {
    isHeader
  },
  data () {
    return {
      isShow: false,
      defaultActive: '',
      menuItems: []
    }
  },
  methods: {
    showView (e) {
      console.log('show path' + e)
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
        console.log(res)
        if (res.state === 0) {
          this.$message.warning(res.message)
        } else if (res.state === 1) {
          for (var i in res.data) {
            this.menuItems.push({
              index: res.data[i].id,
              name: res.data[i].name,
              roleId: res.data[i].roleId,
              path: res.data[i].path
            })
          }
          this.defaultActive = '1'
        }
      })
    }
  },
  mounted () {
    this.getMenu()
  }
}
</script>

<style scoped>
  .el-header{
    padding: 0;
  }
</style>
