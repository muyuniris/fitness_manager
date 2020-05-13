<template>
  <div class="addvip">
   <div class="content">
      <!-- 标题 -->
    <div class="title">
      <i class="el-icon-edit"></i>
      <span>修改角色信息</span>

      <!-- 返回按钮 -->
      <div class="back">
        <el-button round size='mini' class="back-btn" icon='el-icon-arrow-left' @click="back">返回</el-button>
      </div>
    </div>
    

    <!-- 表单内容 -->
    <el-form :model="form" class="main" size="medium" status-icon label-width="120px" ref="ruleForm">

        <el-form-item label="手机号:" prop="tel" :rules="[phone,{ required: true, message: '手机号不能为空', trigger: ['blur','change']}]" >
        <el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="姓名:" prop="name"
      :rules="{ required: true, message: '姓名不能为空', trigger: ['blur','change']}">
        <el-input v-model="form.name" placeholder="请输入姓名" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="类别" prop="type" :rules="{ required: true, message: '请选择会有有效期', trigger: ['blur','change']}">
        <el-select v-model="form.type" placeholder="请选择管理员类别">
          <el-option label="普通管理员" value="0"></el-option>
          <el-option label="超级管理员" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="control">
        <el-button type="danger" icon="el-icon-close" @click="back">取消</el-button>
        <el-button @click="resetForm('ruleForm')" class="reset-btn" icon="el-icon-refresh-left">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-document-add">保存</el-button>
      </el-form-item>

      
    </el-form>
   </div>
  </div>
</template>
<script>
 export default {
    data() {
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
      return {
        data:{},
        form: {},
        phone:{validator: checkPhone, trigger: ['blur','change']},
      }
    },
    methods: {
      back(){//返回房产信息列表
        this.$router.push({path:'/home/role'});
      },

      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("此操作会将数据永久性修改，确认是否继续操作?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(()=>{
              console.log("seccess!",this.form);
              this.axios.post('/users/findTel',{
                tel:this.form.tel,
                role:3,
                uid:this.form.uid
              })
              .then(res=> {
                console.log(res.data);
                if(res.data.code == '200'){
                  this.$message.error(res.data.msg);
                }
                else{
                  this.axios.post("/role/alter",{
                    id:this.form.id,
                    name:this.form.name,
                    tel:this.form.tel,
                    type:this.form.type
                  })
                  .then(res=>{
                    console.log(res);
                    if(res.data.code=='200'){
                      this.$message.success(res.data.msg);
                      this.$router.push({path:'/home/role'});
                    }
                  })
                  .catch(err=>{
                    console.log(err);
                  })
                }
              })
              .catch(err=>{
                console.log(err)
              })
              
            })
            .catch(()=>{
              this.$message.info("已取消修改");
            })
            

            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      },

      // 重置表单
      resetForm() {
        // this.$refs[formName].resetFields();
        this.form=this.formateData(this.data);
      },

      // 格式化数据
      formateData(item){
        var data={};
        data.id=item.m_id;
        data.uid=item.u_id;
        data.no=this.PrefixInteger(item.m_id,10);
        data.name = item.m_name;
        data.tel = item.u_tel;
        data.type = item.m_role==1?'超级管理员':'普通管理员';
        console.log(data);
    
        return data;
      },

      // 格式化数字
      PrefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
      },


      // 重置密码
      setPwd(){
        this.$confirm("此操作会将密码重置为手机号后六位，请确认是否继续操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(()=>{
          console.log("重置密码",this.data.u_id);
          this.axios.post('/users/setPwd',{
            tel:this.form.tel,
            id:this.data.u_id
          })
          .then(res=>{
            console.log(res.data)
            if(res.data.code=="200"){
              this.$message.success("重置密码成功");
            }
          })
          .catch(err=>{
            console.log(err);
          })
        })
        .catch(()=>{
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        })
        

      }

    },

    mounted() {//创建时获取数据
      console.log(this.$route.params.id);
      this.axios.post("/role/getDetail", {
        id:this.$route.params.id
      })
      .then((res) => {
        console.log(res);
        if(res.data.code=='200'){
          this.loading=false;
          this.data = res.data.data;
          this.form = this.formateData(this.data);
        }
      })
      .catch(err=> {
        console.log(err);
      })
    },
  }
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.addvip {
  color: @fontColor;
  background-color: white;
  min-height: 500px;
}
.content {
  background: white;
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
  padding: 20px;
}
.el-input--medium,.el-select,.time-input{
  width: 300px;
}
.reset-btn{
  background: @blueGreenColor;
  color: white;
  border-color: @blueGreenColor;
}
.el-form--inline .control{
  text-align: right;
  width: 100%;
}
.btn-setPwd{
  background: @yellowColor;
  border-color: @yellowColor;
}
</style>