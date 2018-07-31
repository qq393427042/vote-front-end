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
          <el-button size="mini" type="primary" @click="goVote(scope.$index, scope.row)" v-if="scope.row.stateName === 'published'" round>
            去投票
          </el-button>
          <el-button size="mini" type="primary" @click="goPublish(scope.$index, scope.row)" v-else-if="scope.row.stateName === 'saved'" round>
            去发布
          </el-button>
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
    <el-dialog width="800px" title="编辑投票" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer">
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
                action="http://192.168.22.210:8081/user/optionPic"
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
            <el-button type="primary" @click="submitForm('dynamicValidateForm', true)">发布</el-button>
            <el-button type="primary" @click="submitForm('dynamicValidateForm', false)">暂存</el-button>
            <el-button @click="addDomain">新增选项</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="reallyDialog"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import bus from '../../../../eventBus'
import {userVoteList, getVoteInfo, saveVote, getVoteOptions, getFilename, deleteVote} from '../../../../api'
export default {
  name: 'Votes',
  data () {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 50,
      tableData: [],
      dialogFormVisible: false,
      reallyDialog: false,
      dynamicValidateForm: {
        domains: [],
        title: '',
        introduction: '',
        maxSelect: 1,
        id: ''
      },
      maxLength: 1
    }
  },
  methods: {
    initVoteInfo (voteId) {
      getVoteInfo({voteId: voteId}).then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.replace('/')
        } else {
          let data = res.data
          this.dynamicValidateForm.id = data.id
          this.dynamicValidateForm.title = data.title
          this.dynamicValidateForm.introduction = data.introduction
          this.dynamicValidateForm.maxSelect = data.maxSelect
        }
      })
    },
    initOptions (voteId) {
      getVoteOptions({voteId: voteId}).then(res => {
        let data = res.data
        this.maxLength = data.length
        for (let i in data) {
          let option = data[i]
          console.log(option)
          this.dynamicValidateForm.domains.push({
            name: option.name,
            imagemd5: option.pic,
            imageUrl: ''
          })
          getFilename({fileMd5: option.pic}).then(res => {
            if (res.state === 1) {
              this.dynamicValidateForm.domains[i].imageUrl = this.staticFilePath + res.data
            }
          })
        }
        console.log(this.dynamicValidateForm)
      })
    },
    handleChange (value) {
      console.log(value)
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
    },
    submitForm (formName, isCreate) {
      console.log('是否发布 ：' + isCreate)
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
          let params = {
            names: names,
            indexes: indexes,
            imageUrls: imageUrls,
            imagemd5s: imagemd5s,
            isPublish: isCreate,
            voteId: this.dynamicValidateForm.id,
            maxSelect: this.dynamicValidateForm.maxSelect,
            title: this.dynamicValidateForm.title,
            introduction: this.dynamicValidateForm.introduction
          }
          saveVote(params).then(res => {
            if (res.state === 1) {
              this.$message.success(res.message)
              this.dialogFormVisible = false
              this.getVotes()
              bus.$emit('exMenu', '2')
            } else if (res.state === 0) {
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.warning('请检查输入格式')
          return false
        }
      })
    },
    goVote (index, row) {
      console.log(index, row)
      let id = row.id
      this.$router.push({path: '/vote', query: {voteId: id}})
    },
    goPublish (index, row) {
      this.dynamicValidateForm.domains = []
      this.initVoteInfo(row.id)
      this.initOptions(row.id)
      this.dialogFormVisible = true
    },
    handleCurrentChange (val) {
      console.log('当前页' + val)
      this.getVotes()
    },
    handleDelete (index, row) {
      this.$confirm('此操作将删除此投票, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          voteId: row.id
        }
        deleteVote(params).then(res => {
          if (res.state === 1) {
            this.$message.success(res.message)
            // 刷新投票
            this.getVotes()
          } else if (res.state === 0) {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getVotes () {
      userVoteList({page: this.currentPage}).then(res => {
        if (res.state === 0) {
          this.$message.warning(res.message)
          this.$router.replace('/')
        } else {
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
  .votes{
    width: 100%;
  }
  .option{
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
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
  .el-form-item{
    line-height: 0;
  }
</style>
