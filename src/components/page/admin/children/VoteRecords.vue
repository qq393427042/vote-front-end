<template>
  <div>
    <div class="title"><h3>投票记录</h3></div>
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
        label="投票标题">
        <template slot-scope="scope">
          {{ scope.row.voteName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="选项">
        <template slot-scope="scope">
          {{ scope.row.optionName }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="投票时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
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
import {recordList} from '../../../../api'
export default {
  name: 'VoteRecords',
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
      this.getRecord()
    },
    getRecord () {
      let params = {page: this.currentPage}
      recordList(params).then(res => {
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
            this.tableData.push(vote)
          }
        }
        console.log(this.tableData)
      })
    }
  },
  created () {
    this.getRecord()
  }
}
</script>

<style scoped>

</style>
