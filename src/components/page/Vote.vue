<template>
  <div class="vote">
    这是投票页
  </div>
</template>

<script>
import {getVoteInfo, getVoteOptions, getFilename} from '../../api'
export default {
  name: 'Vote',
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
      options: []
    }
  },
  methods: {
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
            pic: option.pic
          })
          getFilename({fileMd5: option.pic}).then(res => {
            if (res.state === 1) {
              this.options[i].pic = res.data
            }
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

<style scoped>
  .vote{}
</style>
