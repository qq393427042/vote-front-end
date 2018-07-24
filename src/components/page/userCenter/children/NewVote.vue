<template>
  <div class="newVote">
    <div><h3>发起投票</h3></div>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
      <el-form-item
        prop="title"
        label="投票标题"
        :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' }
    ]"
      >
        <el-input v-model="dynamicValidateForm.title"></el-input>
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
            action="http://192.168.22.161:8081/user/headUpload"
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
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        <el-button @click="addDomain">新增选项</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'NewVote',
  data () {
    return {
      dynamicValidateForm: {
        domains: [{
          name: '',
          imageUrl: '',
          index: ''
        }],
        title: ''
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
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
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        name: '',
        imageUrl: '',
        key: Date.now()
      })
    },
    handleAvatarSuccess (res, file) {
      console.log(res)
      this.dynamicValidateForm.domains[res.data.index].imageUrl = res.data.url
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
  .option{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>
