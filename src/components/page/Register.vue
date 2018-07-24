<template>
  <div class="register">
    <div class="register_block">
      <div class="register_title">
        <h4>Hahaha</h4>
        <font-awesome-icon :icon="['fab', 'vuejs']" class="fa-4x"></font-awesome-icon>
      </div>
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="ruleForm">
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model.number="ruleForm2.username"></el-input>
        </el-form-item>
        <el-form-item  prop="pass">
          <el-input placeholder="密码" type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  prop="checkPass">
          <el-input placeholder="确认密码" type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <div id="captcha"><p id="wait">正在加载验证码</p></div>
        <el-form-item style="margin-bottom: 0">
          <el-checkbox v-model="ruleForm2.is_accept">我已经阅读并同意<router-link to="">法律条款</router-link></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm" type="primary" v-bind:disabled="registerDis">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="line"></div>
      <div class="go-login">
        <p>已经拥有账号？点此<router-link to="/login">登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {userRegister, geetestReg} from '../../api'
require('../../../static/js/gt.js')
var captcha
export default {
  name: 'Register',
  data () {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
        this.ruleForm2.username = ''
      } else {
        if (Number.isInteger(value)) {
          console.log(value)
          value = String.toString(value)
          callback(new Error('用户名不能以数字开头'))
          return false
        } else {
          console.log(value)
          if (value.trim() === '') {
            callback(new Error('用户名不能为空'))
            this.ruleForm2.username = ''
            return false
          } else {
            if (value.length < 6) {
              callback(new Error('用户名太短'))
            } else if (value.length > 14) {
              callback(new Error('用户名太长'))
            }
            var usernameReg = /^[a-zA-Z][a-zA-Z0-9_]{5,13}$/
            if (!usernameReg.test(value)) {
              callback(new Error('用户名为字母开头的字符串，6-14位，只能包含字母和数字'))
            } else {
              callback()
            }
          }
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请输入密码'))
        this.ruleForm2.pass = ''
      } else {
        var passReg = /^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;"_.,]){6,14}$/
        if (!passReg.test(value)) {
          callback(new Error('密码为字母、数字、字符的6-14位字符串'))
        } else {
          callback()
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('请再次输入密码'))
        this.ruleForm2.checkPass = ''
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      statusKey: '',
      registerDis: true,
      ruleForm2: {
        pass: '',
        checkPass: '',
        username: '',
        is_accept: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['ruleForm2'].validate((valid) => {
        if (!valid) {
          console.log('error submit!!')
          return false
        }
      })
      if (!this.ruleForm2.is_accept) {
        this.$message.warning('请先同意用户协议！')
        return false
      }
      // 确认验证码加载完成
      if (!captcha) {
        this.$message('请等待验证码加载或者刷新页面')
        return false
      }
      var result = captcha.getValidate()
      if (!result) {
        // this.message('请完成验证')
        // console.log('请完成验证')
        this.logintxt = '登录'
        this.$message.warning('请完成验证')
        // Message.warning('请完成验证')
        return false
      }
      var params = {
        username: this.ruleForm2.username,
        password: this.ruleForm2.pass,
        password2: this.ruleForm2.checkPass,
        geetest_challenge: result.geetest_challenge,
        geetest_validate: result.geetest_validate,
        geetest_seccode: result.geetest_seccode,
        statusKey: this.statusKey
      }
      console.log(params)
      userRegister(params).then(res => {
        if (res.state === 0) {
          this.$message.error(res.message)
          captcha.reset()
          return false
        } else if (res.state === 1) {
          this.$message.success(res.message)
          this.$router.push('/login')
        }
      })
    },
    resetFrom () {
      this.$refs['ruleForm2'].resetFields()
      if (!captcha) {
        captcha.reset()
      }
    },
    init_geetest () {
      geetestReg().then(res => {
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
    }
  },
  mounted () {
    this.init_geetest()
  },
  computed: {
    is_accept () {
      return this.ruleForm2.is_accept
    }
  },
  watch: {
    is_accept (newValue, oldValue) {
      if (this.ruleForm2.is_accept) {
        this.registerDis = false
      } else {
        this.registerDis = true
      }
    }
  }
}
</script>

<style scoped>
  .register{
    background: url(../../assets/login_back.png) repeat;
    background-size: 100px;
    margin-top: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
  .register_block{
    min-width: 450px;
    background-color: white;
    margin-top: 50px;
    border: 1px solid #dadada;
    border-radius: 10px;
  }
  .register_title{
  }
  .ruleForm{
    padding: 0 40px 0 40px;
  }
  .register_form{
    padding: 0;
  }
  .register_form li{
    margin-bottom: 20px;
  }
  a{
    text-decoration: none;
    color: #42b983;
  }
  .button_block{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0 40px 0 40px;
  }
  .button_block div{
    width: 100%;
    margin-bottom: 15px;
    padding: 0;
    margin-top: 5px;
  }
  .el-button{
    width: 100%;
  }
</style>
