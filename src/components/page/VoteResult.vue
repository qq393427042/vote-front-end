<template>
  <div class="voteResult">
    <el-header style="height: 80px; margin-bottom: 15px">
      <is-header></is-header>
    </el-header>
    <el-main>
      <div class="chart">
        <div><h3>{{this.voteName}}</h3></div>
        <ve-histogram width="800px" :data="chartData" :settings="chartSettings"></ve-histogram>
      </div>
    </el-main>
  </div>
</template>

<script>
import {getVoteOptions, getVoteInfo} from '../../api'
import isHeader from '../Header'
export default {
  name: 'VoteResult',
  components: {
    isHeader
  },
  data () {
    this.chartSettings = {
      metrics: ['得票数'],
      dimension: ['选项']
    }
    return {
      voteId: '',
      voteName: '',
      options: [],
      chartData: {
        columns: ['选项', '得票数'],
        rows: []
      }
    }
  },
  methods: {
    init () {
      this.voteId = this.$route.query['voteId']
      getVoteInfo({voteId: this.voteId}).then(res => {
        if (res.state === 0) {
          this.$router.replace('/')
        } else if (res.state === 1) {
          let data = res.data
          this.voteName = data.title
        }
      })
      getVoteOptions({voteId: this.voteId}).then(res => {
        let data = res.data
        for (let i in data) {
          let option = data[i]
          this.options.push({
            id: option.id,
            index: option.index,
            name: option.name,
            pic: option.pic,
            num: option.num
          })
          this.chartData.rows.push({
            '选项': option.name,
            '得票数': option.num
          })
        }
        console.log(this.options)
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
  .el-main{
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .chart{
    width: 800px;
  }
  .el-header{
    padding: 0;
  }
</style>
