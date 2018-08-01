<template>
  <div class="charts">
    <div class="title"><h3>数据统计</h3></div>
    <el-card class="box-card">
      <div class="title"><h4>投票记录统计</h4></div>
      <ve-line :data="recordChart"></ve-line>
    </el-card>
    <el-card class="box-card">
      <div class="title"><h4>投票创建统计</h4></div>
      <ve-line :data="voteChart"></ve-line>
    </el-card>
    <el-card class="box-card">
      <div class="title"><h4>用户占比</h4></div>
      <ve-pie :data="chartData"></ve-pie>
    </el-card>
  </div>
</template>

<script>
import {getVoteRecordChart, getVoteChart} from '../../../../api'
import moment from 'moment'
export default {
  name: 'Charts',
  data () {
    return {
      recordChart: {
        columns: ['日期', '投票数量'],
        rows: [
          {'日期': '2018-07-29', '投票数量': '14'},
          {'日期': '2018-07-28', '投票数量': '5'},
          {'日期': '2018-07-27', '投票数量': '10'}
        ]
      },
      voteChart: {
        columns: ['日期', '投票创建数量'],
        rows: []
      },
      chartData: {
        columns: ['性别', '用户数量'],
        rows: [
          { '性别': '男', '用户数量': 1393 },
          { '性别': '女', '用户数量': 3530 }
        ]
      }
    }
  },
  methods: {
    initVoteChart () {
      getVoteChart().then(res => {
        if (res.state === 1) {
          let data = res.data
          for (let i in data) {
            let row = data[i]
            this.voteChart.rows.push({
              '日期': moment(new Date(row.createTime)).format('YYYY-MM-DD'),
              '投票创建数量': row.num
            })
          }
        }
      })
    },
    initRecordChart () {
      getVoteRecordChart().then(res => {
        if (res.state === 1) {
          let data = res.data
          for (let i in data) {
            let row = data[i]
            this.recordChart.rows.push({
              '日期': moment(new Date(row.createTime)).format('YYYY-MM-DD'),
              '投票数量': row.num
            })
          }
        }
      })
    }
  },
  created () {
    this.initRecordChart()
    this.initVoteChart()
  }
}
</script>

<style>
  /*.title{*/
    /*display: flex;*/
  /*}*/
</style>
