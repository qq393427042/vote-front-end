<template>
  <div class="vote">
    <el-header style="height: 80px; margin-bottom: 15px">
      <is-header></is-header>
    </el-header>
    <el-main style="display: flex;justify-content: center;">
      <div class="menu_info">
        <div><h4>{{voteInfo.title}}</h4></div>
        <div><h5>{{voteInfo.introduction}}</h5></div>
        <!--<el-card v-for="-->
    <!--/* eslint-disable vue/valid-v-for */-->
    <!--option in options" :key="options.index" @click.native="select($event, option)" class="card raw_card" shadow="hover" body-style="width:100%; padding: 0;display: flex;flex-wrap: nowrap;justify-content: center;align-items: center;">-->
          <!--<img :src="option.pic" class="image">-->
          <!--<div style="padding: 14px;display: inline-block">-->
            <!--<span>{{option.name}}</span>-->
          <!--</div>-->
        <!--</el-card>-->
        <el-checkbox-group class="vote_options" @change="change" v-model="selected">
          <el-checkbox-button v-for="
          /* eslint-disable vue/valid-v-for */
          option in options" :label="option.index" :key="options.index">
            <img :src="option.pic" class="image">
            <span>{{option.name}}</span>
          </el-checkbox-button>
        </el-checkbox-group>
        <el-button type="primary">
          <font-awesome-icon :icon="['fab', 'vuejs']"></font-awesome-icon>
          投票
        </el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
// TODO 后台添加 投票最大最小之后 添加checkbox-group属性
// TODO 进入投票页之前，检查该用户是否已经投票
import {getVoteInfo, getVoteOptions, getFilename} from '../../api'
import isHeader from '../Header'
export default {
  name: 'Vote',
  components: {
    isHeader
  },
  data () {
    return {
      voteInfo: {
        id: '',
        title: '',
        introduction: '',
        createTime: '',
        username: '',
        clickTimes: '',
        userId: ''
      },
      options: [],
      selected: []
    }
  },
  methods: {
    change (val) {
      console.log(val)
    },
    // select (event, option) {
    //   let target = event.target
    //   if (option.isSelected === false) {
    //     option.isSelected = true
    //     target.style['background-color'] = 'ghostwhite'
    //   } else if (option.isSelected === true) {
    //     option.isSelected = false
    //     target.style['background-color'] = ''
    //   }
    // },
    init () {
      let voteId = this.$route.query.voteId
      getVoteInfo({voteId: voteId}).then(res => {
        if (res.state === 0) {
          this.$router.push('/')
        } else {
          let data = res.data
          this.voteInfo.id = data.id
          this.voteInfo.title = data.title
          this.voteInfo.introduction = data.introduction
          this.voteInfo.createTime = data.createTime
          this.voteInfo.username = data.username
          this.voteInfo.userId = data.userId
          this.voteInfo.clickTimes = data.clickTimes
        }
      })
      getVoteOptions({voteId: voteId}).then(res => {
        console.log(res)
        let data = res.data
        for (let i in data) {
          let option = data[i]
          this.options.push({
            id: option.id,
            index: option.index,
            name: option.name,
            pic: option.pic,
            isSelected: false
          })
          getFilename({fileMd5: option.pic}).then(res => {
            if (res.state === 1) {
              this.options[i].pic = this.staticFilePath + res.data
            }
            console.log(this.options)
          })
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style>
  .vote_options{
    margin-bottom: 30px;
  }
  .el-checkbox-button{
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .el-checkbox-button__inner{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;  }
  /*.el-checkbox-button .el-checkbox-button__inner{*/
    /*display: flex;*/
    /*width: 100%;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
    /*align-content: center;*/
  /*}*/
  .el-main{
    padding: auto;
  }
  .menu_info{
    width: 800px;
  }
  .card{
  }
  .vote{}
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 80px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header{
    padding: 0;
  }
</style>
