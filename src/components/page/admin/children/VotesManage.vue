<template>
  <div class="vote_manage">
    <div class="title"><h3>投票管理</h3></div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        label="创建用户">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="投票标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
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
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.stateName === 'published'">已发布</span>
          <span v-else-if="scope.row.stateName === 'saved'">暂存</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template  slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" round>删除</el-button>
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
import {adDeleteVote, voteList} from '../../../../api'
import moment from 'moment'
export default {
  name: 'VotesManage',
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
    handleDelete (index, row) {
      this.$confirm('此操作将删除此投票, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          voteId: row.id
        }
        adDeleteVote(params).then(res => {
          if (res.state === 1) {
            this.$message.success(res.message)
            // 刷新投票
            this.getVotes()
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
    getVotes () {
      let params = {page: this.currentPage}
      voteList(params).then(res => {
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
      })
    }
  },
  mounted () {
    this.getVotes()
  }
}
</script>

<style scoped>

</style>
