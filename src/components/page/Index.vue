<template>
  <div>
    <el-container>
      <el-header style="height: 80px">
        <is-header></is-header>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>主页还没写</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import isHeader from '../Header'
export default {
  name: 'Index',
  components: {
    isHeader
  }
}
</script>

<style scoped>
  .el-header{
    padding: 0;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
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
