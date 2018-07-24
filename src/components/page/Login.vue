<template>
  <div class="login">
    <div class="login_block">
      <div class="login_title">
        <h4>用户登录</h4>
        <font-awesome-icon :icon="['fab', 'vuejs']" class="fa-4x"></font-awesome-icon>
      </div>
      <div class="login_body">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="ruleForm">
          <el-form-item prop="username">
            <el-input placeholder="用户名" v-model.number="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item  prop="pass">
            <el-input placeholder="密码" type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <div id="captcha"><p id="wait">正在加载验证码</p></div>
          <el-form-item class="auto-log">
            <el-checkbox v-model="autoLogin">记住密码</el-checkbox>
            <router-link to="/register">注册账号</router-link>|
            <router-link to="">忘记密码</router-link>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_block">
        <el-button @click="login" type="primary">登录</el-button>
        <router-link to="/"><el-button>回到主页</el-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {geetest, userLogin} from '../../api'
// import md5 from 'js-md5'
require('../../../static/js/gt.js')
var captcha
export default {
  name: 'Login',
  data () {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
        this.ruleForm.username = ''
      } else {
        if (!Number.isInteger(value) && value.trim() === '') {
          callback(new Error('用户名不能为空'))
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入密码'))
        this.ruleForm.pass = ''
      } else {
        if (!Number.isInteger(value) && value.trim() === '') {
          callback(new Error('用户名不能为空'))
        }
      }
    }
    return {
      cart: [],
      remember: '',
      loginPage: true,
      ruleForm: {
        username: '',
        pass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ]
      },
      autoLogin: false,
      logintxt: '登录',
      statusKey: ''
    }
  },
  methods: {
    resetFrom () {
      this.$refs['ruleForm'].resetFields()
    },
    login () {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
      })
      this.logintxt = '登录中...'
      console.log('logining')
      if (!this.ruleForm.username || !this.ruleForm.pass) {
        // this.ruleForm.errMsg = '账号或者密码不能为空!'
        this.$message.warning('账号或者密码不能为空!')
        return false
      }
      // 确认验证码加载完成
      if (!captcha) {
        this.$message('请等待验证码加载或者刷新页面')
        return false
      }
      var result = captcha.getValidate()
      if (!result) {
        this.$message.warning('请完成验证!')
        this.logintxt = '登录'
        return false
      }
      var params = {
        username: this.ruleForm.username,
        password: this.ruleForm.pass,
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode,
        statusKey: this.statusKey
      }
      userLogin(params).then(res => {
        console.log(res)
        if (res.state === 1) {
          // 登录成功时如果记住密码
          this.rememberPass()

          console.log('转到主页')
          this.$message.success(res.message)
          this.$router.push({
            path: '/'
          })
        } else {
          this.logintxt = '登录'
          this.$message(res.message)
          captcha.reset()
          return false
        }
      })
    },
    init_geetest () {
      console.log('初始化验证码')
      geetest().then(res => {
        console.log(res)
        this.statusKey = res.statusKey
        window.initGeetest({
          gt: res.gt,
          challenge: res.challenge,
          new_captcha: res.new_captcha,
          offline: !res.success,
          product: 'popup',
          width: '100%'
        }, function (captchaObj) {
          captcha = captchaObj
          captchaObj.appendTo('#captcha')
          captchaObj.onReady(function () {
            document.getElementById('wait').style.display = 'none'
          })
        })
      })
    },
    getRemembered () {
      var judge = this.$store.getStore('remember')
      if (judge === 'true') {
        this.autoLogin = true
        this.ruleForm.username = this.$store.getStore('rusername')
        this.ruleForm.pass = this.$store.getStore('rpassword')
      }
    },
    rememberPass () {
      if (this.autoLogin === true) {
        this.$store.setStore('remember', 'true')
        this.$store.setStore('rusername', this.ruleForm.username)
        this.$store.setStore('rpassword', this.ruleForm.pass)
      } else {
        this.$store.setStore('remember', 'false')
        this.$store.removeStore('rusername')
        this.$store.removeStore('rpassword')
      }
    }
  },
  mounted () {
    this.getRemembered()
    this.init_geetest()
  }
}
</script>

<style scoped>
  a{
    text-decoration: none;
    color: #42b983;
  }
  .login{
    background: url(../../assets/login_back.png) repeat;
    background-size: 100px;
    margin-top: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
  .login_block{
    min-width: 450px;
    background-color: white;
    margin-top: 50px;
    border: 1px solid #dadada;
    border-radius: 10px;
  }
  .login_title{
    margin-bottom: 35px;
  }
  .login_body{
    padding: 0 40px 0 40px;
  }
  .ruleForm{
    padding: 0;
  }
  .login_form li{
    margin-bottom: 15px;
    list-style-type:none;
  }
  .login_form a{
    text-decoration: none;
    color: #3499ff;
  }
  .button_block{
    padding: 0 40px 22px;
  }
  .el-button{
    width: 100%;
    margin: 0;
    margin-bottom: 20px;
  }
  .auto-log{
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
  }
</style>
