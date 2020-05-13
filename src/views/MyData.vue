<template>
  <div class="myData">
    <div class="content" v-loading="loading">

      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-s-management"></i>
        <span>个人信息详情</span>

       
      </div>

      <!-- 显示信息 -->
      <div class="main" v-show="data">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12"><div class="item-title">用户昵称:</div></el-col>
          <el-col :xs="24" :sm="12" ><div class="msg">{{data.name}}</div></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12"><div class="item-title">手机号:</div></el-col>
          <el-col :xs="24" :sm="12"><div class="msg">{{data.tel}}</div></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12"><div class="item-title">账号状态:</div></el-col>
          <el-col :xs="24" :sm="12"><div class="msg">{{data.lock}}</div></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12"><div class="item-title">用户性质:</div></el-col>
          <el-col :xs="24" :sm="12"><div class="msg">{{data.type}}</div></el-col>
        </el-row>
        <div class="control">
          <el-button type="primary"  @click="alterPwd" class="btn-pwd">修改密码</el-button>
          <el-button type="primary" @click="alterTel" class="btn-tel">修改手机号</el-button>
        </div>
      </div>
      <el-dialog
        title="修改密码"
        :visible.sync="dialogPwd"
        width="30%"
        >
        <el-form label-width="80px" :model="formPwd" ref="formPwd">
          <el-form-item label="新密码" prop="pwd" :rules="{ required: true, message: '密码不能为空', trigger: ['blur','change']}">
            <el-input v-model="formPwd.pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password" :rules="[{ required: true, message: '确认密码不能为空', trigger: ['blur','change']},pwd]">
            <el-input v-model="formPwd.password" type="password"></el-input>
          </el-form-item>
          
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPwd = false">取 消</el-button>
          <el-button type="primary" @click="submitPwd">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改手机号"
        :visible.sync="dialogTel"
        width="30%"
        >
        <el-form label-width="80px" :model="formTel" ref="formTel">
          <el-form-item label="手机号" prop="tel" :rules="[{ required: true, message: '手机号不能为空', trigger: ['blur','change']},phone]">
            <el-input v-model="formTel.tel" ></el-input>
          </el-form-item>
           
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTel = false">取 消</el-button>
          <el-button type="primary" @click="submitTel">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import crypto from "crypto";
export default {
  data(){
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    var checkPwd =(rule, value, callback) => {
      if (!value) {
        return callback(new Error('确认密码不能为空'));
      } else {
        if (value==this.formPwd.pwd) {
          callback();
        } else {
          return callback(new Error('确认密码和密码不一致'));
        }
      }
    };
    return{
      data:{},
      loading:false,
      dialogPwd:false,
      dialogTel:false,
      formTel:{},
      formPwd:{},
      phone:{validator: checkPhone, trigger: ['blur','change']},
      pwd:{validator: checkPwd, trigger: ['blur','change']},
    }
  },
  methods:{
    submitPwd(){
      console.log(this.formPwd);
      const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
      const newPass = md5.update(this.formPwd.pwd).digest("hex"); // 加密
      this.$refs['formPwd'].validate((valid) => {
        if (valid) {
          this.axios.post("/users/setPwd",{
            id:this.data.uid,
            pwd:newPass
          })
          .then(res=>{
            console.log(res.data);
            if(res.data.code=='200'){
              this.dialogPwd=false;
              this.$message.success('修改成功！');
            }
          })
        } else {
          return false;
        }
      });
    },
    submitTel(){
      this.$refs['formTel'].validate((valid) => {
        if (valid) {
          this.axios.post('/users/findTel',{
            tel:this.formTel.tel
          })
          .then(res=>{
            console.log(res.data);
            if(res.data.code=='200'){
              this.axios.post("/users/alterTel",{
                id:this.data.uid,
                tel:this.formTel.tel
              })
              .then(res=>{
                console.log(res.data);
                if(res.data.code=='200'){
                  this.dialogTel=false;
                  this.load();
                  this.$message.success('修改成功！');

                }
              })
            }
            else{
              this.$message.success('该手机号已存在！');
            }
          })
          
        } else {
          return false;
        }
      });
    },
    formatData(data){
      var item = {};
      console.log(data)
      item.id = data.m_id;
      item.uid = data.u_id;
      item.name = data.m_name;
      item.tel = data.u_tel;
      item.type = data.m_role?"超级管理员":"普通管理员";
      item.lock = data.u_lock?"禁用":"正常";
      return item;
    },
    alterPwd(){
      this.dialogPwd=true;
      this.$refs['formPwd'].resetFields();
    },
    alterTel(){
      this.dialogTel=true;
      this.$refs['formTel'].resetFields();
    },
    load(){
      this.loading=true;
      var uid = sessionStorage.getItem("uid");
      this.axios.post("/role/getDetail",{
        id:uid
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code == '200'){
          this.loading=false;
          this.data = this.formatData(res.data.data);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
    this.load();
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.myData {
  color: @fontColor;
  background-color: white;
  height: 100%;
}
.msg{
  height: 40px;
  
}
.content {
  background: white;
  height: 100%;
}
.title {
  padding: 15px 20px;
  border-top: 3px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
  i {
    margin-right: 2px;
  }
  .back {
    float: right;
    .back-btn{
      padding: 5px;
    }
  }
}
.main{
  width: 260px;
  padding: 20px;
  margin: 50px auto;
}
.control{
  .btn-pwd{
    background:@greenColor;
    border-color: @greenColor;
  }
  .btn-tel{
    background:@yellowColor;
    border-color: @yellowColor;
  }
}
</style>