<template>
  <div class="newVote">
    <div><h3>发起投票</h3></div>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="title"
        label="投票标题"
        :rules="[
      { required: true, message: '请输入投票标题', trigger: 'blur' }
    ]"
      >
        <el-input v-model="dynamicValidateForm.title"></el-input>
      </el-form-item>
      <el-form-item
        prop="introduction"
        label="投票描述">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="输入投票描述"
          v-model="dynamicValidateForm.introduction">
        </el-input>
      </el-form-item>
      <el-form-item
        prop="maxSelect"
        label="选择数量">
        <el-input-number v-model="dynamicValidateForm.maxSelect" @change="handleChange" :min="1"
                         :max="maxLength" label="选择数量">
        </el-input-number>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'选项' + index + '名称'"
        :key="domain.key"
        :prop="'domains.' + index + '.name'"
        :rules="{
      required: true, message: '选项不能为空', trigger: 'blur'
    }"
      >
        <div class="option">
          <el-input v-model="domain.name"></el-input>
          <el-upload
            style="line-height: 0"
            class="avatar-uploader"
            :header="{'withCredentials':'false'}"
            action="http://127.0.0.1:8081/user/optionPic"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :data="{index: index}"
            :before-upload="beforeAvatarUpload">
            <el-tooltip class="item" effect="dark" content="点击上传选项图片" placement="top">
            <img v-if="dynamicValidateForm.domains[index].imageUrl" :src="dynamicValidateForm.domains[index].imageUrl" class="avatar">
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <font-awesome-icon :icon="['fas', 'plus-circle']" class="fa-3x"></font-awesome-icon>
            </el-tooltip>
          </el-upload>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="buttonDis" @click="submitForm('dynamicValidateForm', true)">提交</el-button>
        <el-button type="primary" @click="submitForm('dynamicValidateForm', false)">暂存</el-button>
        <el-button @click="addDomain">新增选项</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {checkState, createVote} from '../../../../api'
import bus from '../../../../eventBus'
export default {
  name: 'NewVote',
  data () {
    return {
      buttonDis: false,
      dynamicValidateForm: {
        domains: [{
          name: '',
          imageUrl: '',
          imagemd5: ''
        }],
        title: '',
        introduction: '',
        maxSelect: 1
      },
      maxLength: 1
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    },
    submitForm (formName, isCreate) {
      console.log('是否创建 ：' + isCreate)
      // 选项必须大于等于两个
      if (this.dynamicValidateForm.domains.length < 2) {
        this.$message.warning('选项必须大于等于两个')
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var names = []
          var imageUrls = []
          var indexes = []
          var imagemd5s = []
          for (var i in this.dynamicValidateForm.domains) {
            names.push(this.dynamicValidateForm.domains[i].name)
            imagemd5s.push(this.dynamicValidateForm.domains[i].imagemd5)
            imageUrls.push(this.dynamicValidateForm.domains[i].imageUrl)
            indexes.push(parseInt(i) + 1)
          }
          this.buttonDis = true
          createVote(
            {
              names: names,
              indexes: indexes,
              imageUrls: imageUrls,
              imagemd5s: imagemd5s,
              isCreate: isCreate,
              maxSelect: this.dynamicValidateForm.maxSelect,
              title: this.dynamicValidateForm.title,
              introduction: this.dynamicValidateForm.introduction
            }
          ).then(res => {
            if (res.state === 1) {
              this.$message.success(res.message)
              // 转到投票管理
              this.$router.push('/userCenter/votes')
              bus.$emit('exMenu', 2)
            } else if (res.state === 0) {
              this.$message.warning(res.message)
              this.buttonDis = false
            }
          })
        } else {
          this.$message.warning('请检查输入格式')
          this.buttonDis = false
          return false
        }
      })
    },
    uploadFile (params) {
      console.log(params)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
        this.maxLength--
        console.log(this.dynamicValidateForm.maxSelect)
        console.log(this.maxLength)
        if (this.dynamicValidateForm.maxSelect > this.maxLength) {
          this.dynamicValidateForm.maxSelect = this.maxLength
        }
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        name: '',
        imageUrl: '',
        imagemd5: ''
      })
      this.maxLength++
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.dynamicValidateForm.domains[res.data.index].imageUrl = this.staticFilePath + res.data.url
      this.dynamicValidateForm.domains[res.data.index].imagemd5 = res.data.md5
      console.log(this.dynamicValidateForm)
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
  },
  mounted () {
    checkState().then(res => {
      if (res.state === 0) {
        this.$message.warning(res.message)
        this.$router.replace('/')
      }
    })
    bus.$emit('exMenu', '3')
  }
}
</script>

<style scoped>
  .newVote{
    width: 100%;
  }
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
  .option{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>
