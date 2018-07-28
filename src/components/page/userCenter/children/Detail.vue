<template>
  <div class="detail">
    <el-form label-position="right"  label-width="120px" :model="userInfo">
      <el-form-item label="头像">
        <el-upload
          style="line-height: 0"
          class="avatar-uploader"
          :header="{'withCredentials':'false'}"
          action="http://192.168.22.210:8081/user/uploadHead"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <el-tooltip class="item" effect="dark" content="点击上传头像" placement="top">
            <img v-if="userInfo.head" :src="this.staticFilePath + userInfo.head" class="avatar">
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <font-awesome-icon :icon="['fas', 'plus-circle']" class="fa-3x"></font-awesome-icon>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称">
        <el-dialog title="个人信息" width="30%" :visible.sync="nameVisible">
          <el-form  :model="newInfo">
            <el-form-item label="昵称" >
              <el-input v-model="newInfo.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="newInfo.sex" placeholder="请选择性别">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
                <el-option label="保密" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="nameVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeName">确 定</el-button>
          </div>
        </el-dialog>
        <div v-if="userInfo.name">
          <span>{{userInfo.name}}</span>
        </div>
        <div v-else>
          <span>还未设置昵称</span>
        </div>
      </el-form-item>
      <el-form-item label="性别">
        <span v-if="userInfo.sex === -1">还未设置</span>
        <span v-if="userInfo.sex === 0">男</span>
        <span v-if="userInfo.sex === 1">女</span>
        <span v-if="userInfo.sex === 2">保密</span>
      </el-form-item>
      <el-form-item label="上次登录时间">
        <span v-if="userInfo.lastLoginTime" v-text="userInfo.lastLoginTime"></span>
        <span v-else v-text="'ahaja'"></span>
      </el-form-item>
      <el-form-item label="修改时间">
        <span v-text="userInfo.modifyTime"></span>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" @click="nameVisible = true" round>点击修改信息</el-button>
  </div>
</template>

<script>
import bus from '../../../../eventBus'
import {userInfo, updateUserInfo} from '../../../../api'
import moment from 'moment'
export default {
  name: 'Detail',
  mounted () {
    bus.$emit('exMenu', '1')
    this.getUserInfo()
  },
  data () {
    return {
      newInfo: {
        name: '',
        sex: ''
      },
      nameVisible: false,
      userInfo: {
        head: '',
        createTime: '',
        id: '',
        lastLoginTime: '',
        modifyTime: '',
        name: '',
        sex: '',
        state: '',
        username: ''
      }
    }
  },
  methods: {
    changeName () {
      console.log('submit ' + this.newInfo)
      updateUserInfo(this.newInfo).then(res => {
        if (res.state === 0) {
          this.$message.error(res.message)
        } else if (res.state === 1) {
          this.nameVisible = false
          this.userInfo.sex = this.newInfo.sex
          this.userInfo.name = this.newInfo.name
          this.$message.success(res.message)
          bus.$emit('changeName', this.newInfo.name)
        }
      })
    },
    getUserInfo () {
      userInfo().then(res => {
        let data = res.data
        this.userInfo['head'] = data.head
        this.userInfo['createTime'] = moment(new Date(res.data.createTime)).format('YYYY-MM-DD h:mm:ss')
        this.userInfo['id'] = data.id
        this.userInfo['lastLoginTime'] = moment(new Date(res.data.lastLoginTime)).format('YYYY-MM-DD h:mm:ss')
        this.userInfo['modifyTime'] = moment(new Date(res.data.modifyTime)).format('YYYY-MM-DD h:mm:ss')
        this.userInfo['name'] = data.name
        this.userInfo['sex'] = data.sex
        this.userInfo['state'] = data.state
        this.userInfo['username'] = data.username
      })
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.userInfo.head = res.data.url
      bus.$emit('changeHead', this.userInfo.head)
    },
    beforeAvatarUpload (file) {
      console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style scoped>
  .el-form-item{
    line-height: 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    line-height: 0;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    text-align: center;
  }
  .avatar {
    width: 40px;
    height: 40px;
    display: block;
  }
</style>
