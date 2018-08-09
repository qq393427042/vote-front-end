<template>
  <div class="vote">
    <el-header style="height: 80px; margin-bottom: 15px">
      <is-header></is-header>
    </el-header>
    <el-main style="display: flex;justify-content: center;">
      <div class="menu_info">
        <div><h4>{{voteInfo.title}}</h4></div>
        <div><h5>{{voteInfo.introduction}}</h5></div>
        <div>请选择{{voteInfo.maxSelect}}项</div>
        <el-checkbox-group v-if="voteInfo.maxSelect > 1" :min="0" :max="voteInfo.maxSelect" class="vote_options"
                           @change="change" v-model="selected">
          <el-checkbox-button v-for="
          /* eslint-disable vue/valid-v-for */
          option in options" :label="option.index" :key="options.index">
            <img :src="option.pic" class="image">
            <span>{{option.name}}</span>
          </el-checkbox-button>
        </el-checkbox-group>
        <el-radio-group v-if="voteInfo.maxSelect === 1" class="vote_options" @change="change" v-model="selected">
          <el-radio-button v-for="
          /* eslint-disable vue/valid-v-for */
          option in options" :label="option.index" :key="options.index">
            <img v-if="option.pic" :src="option.pic" class="image">
            <font-awesome-icon v-else :icon="['fab', 'vuejs']" class="fa-4x"></font-awesome-icon>
            <span>{{option.name}}</span>
          </el-radio-button>
        </el-radio-group>
        <el-button @click="doVote" :disabled="buttonDis" type="primary">
          <font-awesome-icon :icon="['fab', 'vuejs']"></font-awesome-icon>
          投票
        </el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
import {checkVote, getVoteInfo, getVoteOptions, getFilename, doVote} from '../../api'
import isHeader from '../Header'
export default {
  name: 'Vote',
  components: {
    isHeader
  },
  data () {
    return {
      buttonDis: false,
      voteInfo: {
        id: '',
        title: '',
        introduction: '',
        createTime: '',
        username: '',
        clickTimes: '',
        userId: '',
        maxSelect: '',
        minSelect: ''
      },
      options: [],
      selected: []
    }
  },
  methods: {
    doVote () {
      let doOptions = []
      if (typeof (this.selected) === 'object') {
        for (let i in this.selected) {
          doOptions.push(this.selected[i])
        }
      } else if (typeof (this.selected) === 'number') {
        doOptions.push(this.selected)
      }
      console.log(doOptions)
      let params = {
        voteId: this.voteInfo.id,
        doOptions: doOptions
      }
      doVote(params).then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
        } else if (res.state === 1) {
          this.$message.success(res.message)
          this.$router.replace({path: '/voteResult', query: {voteId: this.voteInfo.id}})
        }
      })
    },
    change (val) {
      console.log(val)
    },
    initOptions (voteId) {
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
          if (option.pic) {
            getFilename({fileMd5: option.pic}).then(res => {
              if (res.state === 1) {
                this.options[i].pic = this.staticFilePath + res.data
              }
              console.log(this.options)
            })
          }
        }
      })
    },
    initVoteInfo (voteId) {
      getVoteInfo({voteId: voteId}).then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.replace('/')
        } else {
          if (res.data === null) {
            this.$message.error('当前投票不存在')
            this.$router.replace('/')
          }
          let data = res.data
          this.voteInfo.id = data.id
          this.voteInfo.title = data.title
          this.voteInfo.introduction = data.introduction
          this.voteInfo.createTime = data.createTime
          this.voteInfo.username = data.username
          this.voteInfo.userId = data.userId
          this.voteInfo.clickTimes = data.clickTimes
          this.voteInfo.maxSelect = data.maxSelect
          this.voteInfo.minSelect = data.minSelect
        }
      })
    },
    init () {
      let voteId = this.$route.query.voteId
      checkVote({voteId: voteId}).then(res => {
        if (res.state === 0) {
          // 用户未登录时无法投票 将投票按钮disable
          this.buttonDis = true
          this.$message.warning('请登录后进行投票')
          this.initOptions(voteId)
          this.initVoteInfo(voteId)
        } else if (res.state === 2) {
          this.$message.warning(res.message)
          this.$router.replace({path: '/voteResult', query: {voteId: voteId}})
        } else if (res.state === 1) {
          this.initOptions(voteId)
          this.initVoteInfo(voteId)
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style >
  .vote .el-header{
    padding: 0;
  }
  .vote .el-radio-group{
    width: 100%;
  }
  .el-radio-group{
    display: block;
  }
  .el-radio-button{
    margin-bottom: 10px;
  }
  .el-radio-button, .el-radio-button__inner{
    width: 100%;
    display: flex;
    position: relative;
    outline: 0;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .vote_options{
    margin-bottom: 30px;
  }
  .el-checkbox-button{
    margin-bottom: 10px;
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
