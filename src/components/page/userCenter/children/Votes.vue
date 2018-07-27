<template>
  <div class="votes">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        label="投票标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
          <!--<el-popover trigger="hover" placement="top">-->
            <!--<p>姓名: {{ scope.row.name }}</p>-->
            <!--<p>住址: {{ scope.row.address }}</p>-->
            <!--<div slot="reference" class="name-wrapper">-->
              <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
            <!--</div>-->
          <!--</el-popover>-->
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
          <el-button size="mini" @click="goVote(scope.$index, scope.row)" v-if="scope.row.stateName === 'published'" round>
            去投票
          </el-button>
          <el-button size="mini" @click="goPublish(scope.$index, scope.row)" v-else-if="scope.row.stateName === 'saved'" round>
            去发布
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)" round>编辑</el-button>
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
import moment from 'moment'
import bus from '../../../../eventBus'
import {userVoteList} from '../../../../api'
export default {
  name: 'Votes',
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 50,
      tableData: []
    }
  },
  methods: {
    goVote (index, row) {
      console.log(index, row)
    },
    goPublish (index, row) {
      console.log(index, row)
    },
    handleCurrentChange (val) {
      console.log('当前页' + val)
      this.getVotes()
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    getVotes () {
      userVoteList({page: this.currentPage}).then(res => {
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
      })
    }
  },
  mounted () {
    bus.$emit('exMenu', '2')
    this.getVotes()
  }
}
</script>

<style scoped>
  .el-table .cell{
    text-align: center;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
