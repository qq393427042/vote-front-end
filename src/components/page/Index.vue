<template>
  <div>
    <el-container>
      <el-header style="height: 80px">
        <is-header></is-header>
      </el-header>
      <el-container>
        <el-main>
          <el-carousel height="240px" type="card">
            <el-carousel-item>
              <img style="width: 100%" src="../../assets/index1.png"/>
            </el-carousel-item>
            <el-carousel-item>
              <img style="width: 100%" src="../../assets/index2.png"/>
            </el-carousel-item>
            <el-carousel-item>
              <img style="width: 100%" src="../../assets/index3.png"/>
            </el-carousel-item>
          </el-carousel>
        </el-main>
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
  }
  .el-main {
    color: #333;
    text-align: center;
    padding: 0;
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
