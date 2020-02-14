<template>
  <div id="Login">
    <div class="login-box">
      <div class="title">
        <img src="/img/logo_small.png" alt />
      </div>
      <div class="login-item">
        <input type="text" name="username" placeholder="用户名" v-model="username"/>
      </div>
      <div class="login-item">
        <input type="password" name="password" placeholder="密码" v-model="password"/>
      </div>
      <div class="login-item">
        <input type="button" name="login-btn" value="立即登录" class="login-btn" @click='login'/>
      </div>
    </div>
  </div>
</template>
<script>
import crypto from 'crypto'
export default {
  name: "Login",
  data(){
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    login(){
      console.log("你点击了登录",this.username,this.password);
      const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
      const newPass = md5.update(this.password).digest("hex"); // 加密
      console.log(newPass);

      // *********************登录******************************

      this.axios.post("/users/login", {
        name: this.username,
        pwd: newPass
      })
      .then((res) => {
        console.log(res)
        if(res.data.code == "200") {

          // 保存token
          var token = res.data.data.token;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem('userId',res.data.data.userId);


          //获取参数（未登录时想访问的路由）
          var url = this.$route.query.redirect;

          url = url ? url : "/home"
          // 切换路由
          this.$router.replace(url)
        } else {
          console.log(res.data.message);
          this.$message.error(res.data.message);
        }
      })
      .catch(err=> {
        console.log(err)
      })
      
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/less/base.less";

#Login {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('/img/login-bg.png') center;
  background-size: cover;
}

.login-box {
  width: 400px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5px;
  padding: 10px;
}
.title {
  width: 200px;
  margin: 0 auto;
  padding-top: 40px
}
.title img {
  width: 100%;
}
.login-item {
  width: 370px;
  margin: 40px auto;
}
.login-item input {
  height: 45px;
  border-radius: 3px;
  width: 360px;
  border: 1px solid #ddd;
  padding: 0 5px;
}
.login-item .login-btn{
  height: 45px;
  border-radius: 5px;
  background: @buttonColor;
  color: white;
  border: none;
  outline: none;
  cursor: pointer;
}
.login-item .login-btn:hover{
  background: @buttonHoverColor;
}
</style>