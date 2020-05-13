<template>
  <div class="addvip">
   <div class="content">
      <!-- 标题 -->
    <div class="title">
      <i class="el-icon-edit"></i>
      <span>新增会员信息</span>

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

      <el-form-item label="性别:" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="出生年月:" prop="birthday">
        <el-date-picker type="date" value-format="yyyy-MM-dd" class="time-input" placeholder="选择日期" v-model="form.birthday"></el-date-picker>
      </el-form-item>


      <el-form-item label="地址:" prop="address" >
        <el-input v-model="form.address" placeholder="请输入从业/就读单位"></el-input>
      </el-form-item>

      <el-form-item label="会员有效期" prop="time" :rules="{ required: true, message: '请选择会有有效期', trigger: ['blur','change']}">
        <el-select v-model="form.time" placeholder="请选择会员有效期">
          <el-option label="非会员" value="0"></el-option>
          <el-option label="一个月" value="1"></el-option>
          <el-option label="两个月" value="2"></el-option>
          <el-option label="三个月" value="3"></el-option>
          <el-option label="四个月" value="4"></el-option>
          <el-option label="五个月" value="5"></el-option>
          <el-option label="半年" value="6"></el-option>
          <el-option label="一年" value="12"></el-option>
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
        form: {
          tel:'',
          name:'',
          sex:'男',
          time:"",
          birthday:'',
          address:''
        },
        phone:{validator: checkPhone, trigger: ['blur','change']},
      }
    },
    methods: {
      back(){//返回房产信息列表
        this.$router.push({path:'/home/vip'});
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("seccess!",this.form);
            this.axios.post('/users/findTel',{
              tel:this.form.tel,
              role:1
            })
            .then(res=> {
              console.log(res.data);
              if(res.data.code == 0){
                this.$message.error(res.data.msg);
              }
              else{
                this.axios.post("/vip/add",{
                  tel:this.form.tel,
                  name:this.form.name,
                  sex:this.form.sex,
                  birth:this.form.birthday,
                  address:this.form.address,
                  time:this.form.time
                })
                .then(res=>{
                  console.log(res);
                  if(res.data.code=='200'){
                    this.$message.success(res.data.msg);
                    this.$router.push({path:'/home/vip'});
                  }
                })
                .catch(err=>{
                  console.log(err);
                })
              }
            })
            .catch(err=>{
              console.log(err);
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    }
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
</style>