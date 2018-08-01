<template>
  <div class="user_manage">
    <div class="title"><h3>用户管理</h3></div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户昵称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="修改时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.modifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0"><el-tag type="danger">不可用</el-tag></span>
          <span v-else-if="scope.row.state === 1"><el-tag type="success">可用</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template  slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" round>删除</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleRec(scope.$index, scope.row)" round>恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      background
      :current-page.sync="currentPage"
      :page-size="pageSize"
      @currentPage="currentPage"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import {deleteUser, userList, recUser} from '../../../../api'

export default {
  name: 'UserManage',
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 50,
      tableData: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log('当前页' + val)
      this.getVotes()
    },
    handleRec (index, row) {
      console.log(row)
      this.$confirm('是否恢复此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        let params = {
          userId: row.id
        }
        recUser(params).then(res => {
          if (res.state === 1) {
            this.$message.success(res.message)
            this.getUser()
          } else if (res.state === 0) {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (index, row) {
      console.log(row)
      this.$confirm('此操作将删除此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          userId: row.id
        }
        deleteUser(params).then(res => {
          if (res.state === 1) {
            this.$message.success(res.message)
            this.getUser()
          } else if (res.state === 0) {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getUser () {
      let params = {page: this.currentPage}
      userList(params).then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.replace('/')
        } else {
          this.currentPage = res.data.pageNum
          this.pageSize = res.data.pageSize
          let data = res.data.list
          this.total = res.data.total
          this.tableData = []
          for (let i in data) {
            let vote = data[i]
            vote.createTime = moment(new Date(vote.createTime)).format('YYYY-MM-DD')
            vote.modifyTime = moment(new Date(vote.modifyTime)).format('YYYY-MM-DD')
            this.tableData.push(vote)
          }
        }
        console.log(this.tableData)
      })
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style scoped>

</style>
