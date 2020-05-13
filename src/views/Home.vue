<template>
  <div class="home">
    <el-container>
      <el-aside :width="navWidth" style="transition: 0.3s ease-in-out;">
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#545C64"
          active-text-color="#FFD04B"
          text-color="#fff"
          :unique-opened="true"
          :router="true"
          >
          <el-menu-item class="nav-header" style="padding :30px 10px">
            <router-link to="/home">
              <img src="/img/logo.png" alt v-show="!isCollapse" width="120px" />
              <img src="/img/logo.png" alt v-show="isCollapse" width="40px" />
            </router-link>
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">课程管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/course">课程档案</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/coursePlan">课程安排</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/orderCourse">课程预约</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">教练管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/teacher">教练档案</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/orderTeacher">教练预约</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">场地管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/place">场地档案</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/orderPlace">场地预约</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span slot="title">平台管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/vip">用户管理</el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group v-show="user.role=='超级管理员'">
              <el-menu-item index="/home/role">角色档案</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/notice">公告管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/home/suggest">意见反馈</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
    
      </el-aside>

      <el-container>
        <el-header height="50px">
          <div class="top-left">
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
              <button
                type="button"
                @click="change"
                class="open-btn"
                :class="{'el-icon-s-fold': !isCollapse, 'el-icon-s-unfold':isCollapse}"
              ></button>
            </el-radio-group>
          </div>
          <div class="top-right">
            <span class="welcome">欢迎您来到fitness健身服务管理平台</span>
            <el-dropdown>
              <i class="el-icon-s-custom" style="margin-left: 15px">{{user.name}}</i>
              <el-dropdown-menu >
                <el-dropdown-item><div @click="mydata">个人中心</div></el-dropdown-item>
                <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <el-main style="background-color: #f3f3f4; min-height: 680px;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      navWidth: "200px",
      isCollapse: false,
      user: {}
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    change() {
      this.isCollapse = !this.isCollapse;
      if (this.navWidth == "200px") {
        this.navWidth = "65px";
      } else if (this.navWidth == "65px") {
        this.navWidth = "200px";
      }
    },
    formatData(data){
      var item = {};
      console.log(data)
      item.id = data.m_id;
      item.uid = data.u_id;
      item.name = data.m_name;
      item.tel = data.u_tel;
      item.role = data.m_role?"超级管理员":"普通管理员";
      item.lock = data.u_lock?"禁用":"正常";
      return item;
    },
    mydata() {
      console.log("aaa");
      this.$router.push({ path: "/home/myData" });
    },
    logout() {
      sessionStorage.removeItem('token')
      this.$router.replace({ path: "/login" });

    }
  },
  created() {
    var uid = sessionStorage.getItem("uid");
    this.axios.post("/role/getDetail",{
      id:uid
    })
    .then(res=>{
      console.log(res.data);
      if(res.data.code == '200'){
        this.loading=false;
        this.user= this.formatData(res.data.data);
      }
    })
    .catch(err=>{
      console.log(err);
    })
    // this.user.id = sessionStorage.getItem("userId");
    // this.user.name=sessionStorage.getItem("userName");
    // this.user.role=sessionStorage.getItem("userRole");
    // this.user.role="超级管理员"
  }
};

</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.msg{
  height: 40px;
}
.welcome {
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.nav-header a {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.top-right a {
  color: @fontColor;
}
.el-aside {
  background: @navColor;
}
.right {
  background: #2f4050;
}
.el-submenu__title i{
  color: white
}
.main {
  
  background: white;
  margin-left: 200px;
  transition: 0.3s ease-in-out;
}
.main-open {
  margin-left: 65px;
}
.open-btn {
  color: white;
  background: #FFD04B;
  padding: 5px 10px;
  border-radius: 2px;
  border: none;
  font-size: 20px;
}
.nav-header {
  width: 100%;
  height: 120px;
  padding-top: 30px;
  text-align: center;
}

.el-menu {
  background: @navColor;
  border-right: none;
}
.el-submenu__title:hover {
  background-color: @navChoose;
}
.el-header {
  padding: 10px 20px;
}
.top-left {
  float: left;
  // margin-left: 10px;
}
.top-right {
  float: right;
}

.el-main {
  padding: 20px 10px;
}
</style>