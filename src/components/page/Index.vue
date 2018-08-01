<template>
  <div class="index">
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
          <div class="index-votes">
            <div class="hot-votes">
              <h4>热门投票</h4>
              <el-card @click.native="showVote(vote.id)" v-for="vote in hotVotes" :key="vote.id" shadow="hover" class="ccard box-card">
                <div slot="header" class="clearfix">
                  <span>{{vote.title}}</span>
                  <el-button style="float: right; padding: 3px 0" type="primary">去投票</el-button>
                </div>
                <span v-if="vote.introduction">
                  {{vote.introduction}}
                </span>
                <span v-else>暂无简介</span>
                <img class="card-img" v-if="vote.pic" :src="staticFilePath + vote.pic"/>
                <font-awesome-icon v-else :icon="['fab', 'vuejs']" class="fa-2x"></font-awesome-icon>
                <!--<img class="card-img" src="http://127.0.0.1/images/qiushuangbiThu Jul 26 09:21:12 CST 20188af3c72918267a47eaf8e7ec817473eb"/>-->
              </el-card>
            </div>
            <div class="latest-votes">
              <h4>最新投票</h4>
              <el-card @click.native="showVote(vote.id)" v-for="vote in latestVotes" :key="vote.id" shadow="hover" class="ccard box-card">
                <div slot="header" class="clearfix">
                  <span>{{vote.title}}</span>
                  <el-button style="float: right; padding: 3px 0" type="primary">去投票</el-button>
                </div>
                <span v-if="vote.introduction">
                  {{vote.introduction}}
                </span>
                <span v-else>暂无简介</span>
                <img class="card-img" v-if="vote.pic" :src="staticFilePath + vote.pic"/>
                <font-awesome-icon v-else :icon="['fab', 'vuejs']" class="fa-2x"></font-awesome-icon>
                <!--<img class="card-img" src="http://127.0.0.1/images/qiushuangbiThu Jul 26 09:21:12 CST 20188af3c72918267a47eaf8e7ec817473eb"/>-->
              </el-card>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import isHeader from '../Header'
import {getLatestVotes, getHotVotes, getFirstPic} from '../../api'
export default {
  name: 'Index',
  components: {
    isHeader
  },
  data () {
    return {
      hotVotes: [],
      latestVotes: [],
      staticFilePath: this.staticFilePath
    }
  },
  methods: {
    showVote (id) {
      this.$router.push({path: '/vote', query: {voteId: id}})
    },
    initHotVotes () {
      getHotVotes().then(res => {
        let data = res.data
        for (let i in data) {
          let vote = data[i]
          getFirstPic({voteId: vote.id}).then(res => {
            vote['pic'] = res.data
            this.hotVotes.push(vote)
          })
        }
        console.log(this.hotVotes)
      })
    },
    initLatestVotes () {
      getLatestVotes().then(res => {
        let data = res.data
        for (let i in data) {
          let vote = data[i]
          getFirstPic({voteId: vote.id}).then(res => {
            vote['pic'] = res.data
            this.latestVotes.push(vote)
          })
        }
        console.log(this.latestVotes)
      })
    }
  },
  created () {
    this.initHotVotes()
    this.initLatestVotes()
  }
}
</script>

<style>
  .el-card:hover{
    cursor: pointer;
  }
  .ccard{
    margin: 5px 10px;
  }
  .index .card-img{
    height: 60px;
  }
  .index .el-header{
    padding: 0;
  }
  .index .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  .index .el-main {
    color: #333;
    text-align: center;
    padding: 10px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .index .el-container:nth-child(5) .el-aside,
  .index .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .index .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .index .index-votes{
    display: flex;
  }
  .index .hot-votes{
    width: 50%;
  }
  .index .latest-votes{
    width: 50%;
  }
  .index .hot-votes .el-card__body {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .index .hot-votes .el-card__header{
    padding: 10px;
  }
  .index .latest-votes .el-card__body {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .index .latest-votes .el-card__header{
    padding: 10px;
  }
  .index-votes{
    padding: 10px 10px;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .hot-votes{
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
  .latest-votes{
    border: 1px solid #DCDFE6;
    border-radius: 5px;
  }
</style>
