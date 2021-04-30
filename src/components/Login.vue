<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单区-->
      <el-form ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form" :model="loginForm">

        <el-form-item label="" prop="username"><!--用户名区-->
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item label="" prop="password">
          <el-input type="password" prefix-icon="el-icon-time" v-model="loginForm.password"></el-input>
        </el-form-item>

        <!--按钮-->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {

      loginForm: {//登录表单数据绑定对象
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {//表单验证
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}]
      }
    }
  },
  methods:{
    resetLoginForm(){//表单重置
      this.$refs.loginFormRef.resetFields()//上面增加ref后，this就有一个refs可以只想上面的表单
    },
    login(){//增加表单验证
      this.$refs.loginFormRef.validate(async valid=>{
        // console.log(valid)//boolean值成功与否
        if(!valid)return;
        const {data:res}=await this.$http.post("login",this.loginForm);
        if(res.meta.status !==200)return this.$message.error("登录失败");

        this.$message.success("登录成功");
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push("/home");//跳转
        //登录成功后要记录下这个状态，服务器会返回一个token将其
        //保存在sessionStorage里面就可以在网站打开时候生效

      })
    }
  }

}
</script>

<style lang="less" scoped>

.login_container {
  background-color: #2b4b6b;
  height: 100%;


  .login_box {
    width: 450px;
    height: 300px;
    background-color: #ffff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {

      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .btns {
      //display: flex;
      //float: top;
      display: flex;
      justify-content: center;
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>