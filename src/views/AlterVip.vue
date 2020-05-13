<template>
  <div class="addvip">
   <div class="content">
      <!-- 标题 -->
    <div class="title">
      <i class="el-icon-edit"></i>
      <span>修改会员信息</span>

      <!-- 返回按钮 -->
      <div class="back">
        <el-button round size='mini' class="back-btn" icon='el-icon-arrow-left' @click="back">返回</el-button>
      </div>
    </div>
    

    <!-- 表单内容 -->
    <el-form :model="form" class="main" size="medium" status-icon label-width="120px" ref="ruleForm">

      <el-form-item label="用户编号:" prop="no">
        <el-input v-model="form.no" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户昵称:" prop="name" >
        <el-input v-model="form.name" ></el-input>
      </el-form-item>

      <el-form-item label="手机号:" prop="tel" :rules="[phone,{ required: true, message: '手机号不能为空', trigger: ['blur','change']}]" >
        <el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
      </el-form-item>


      <el-form-item label="性别:" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="出生年月:" prop="birth">
        <el-date-picker type="date" value-format="yyyy-MM-dd" class="time-input" placeholder="选择日期" v-model="form.birth"></el-date-picker>
      </el-form-item>


      <el-form-item label="地址:" prop="address" >
        <el-input v-model="form.address" placeholder="请输入地址"></el-input>
      </el-form-item>

      <el-form-item label="会员到期时间:" prop="endTime" >
        <el-input v-model="form.endTime" disabled style="width:190px"></el-input>
        <el-button type="primary"  @click="setVip" v-show="data.v_state==0">成为会员</el-button>
        <el-button type="primary"  @click="setVip" v-show="data.v_state==1">续费会员</el-button>
        <span class="tiem-msg" v-show="time"> 已选择注册{{time}}个月会员 <span class="el-icon-close" @click="delTime"></span></span>
      </el-form-item>

      <el-form-item class="control">
        <el-button type="danger" icon="el-icon-close" @click="back">取消</el-button>
        <el-button @click="resetForm()" class="reset-btn" icon="el-icon-refresh-left">重置</el-button>
        <el-button type="primary"  @click="setPwd" class="btn-setPwd">重置密码</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" icon="el-icon-document-add">保存</el-button>
      </el-form-item>

      <el-dialog title="设置会员时限" :visible.sync="dialogVisible" :center="true" width="400px">
        <el-form :model="dialogForm">
          <el-form-item porp="time">
            <el-select v-model="dialogForm.time" placeholder="请选择会员有效期">
              <el-option label="一个月" value="1"></el-option>
              <el-option label="两个月" value="2"></el-option>
              <el-option label="三个月" value="3"></el-option>
              <el-option label="四个月" value="4"></el-option>
              <el-option label="五个月" value="5"></el-option>
              <el-option label="半年" value="6"></el-option>
              <el-option label="一年" value="12"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="chooseTime()">确 定</el-button>
        </div>
      </el-dialog>

      
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
        dialogVisible: false,
        dialogForm:{
          time:""
        },
        data:{},
        form: {},
        phone:{validator: checkPhone, trigger: ['blur','change']},
        type:0,
        time:0
      }
    },
    methods: {
      delTime(){
        this.time=0;
        this.dialogForm.time = '';
      },
      chooseTime(){
        this.dialogVisible = false
        this.time = this.dialogForm.time;
      },
      back(){//返回房产信息列表
        this.$router.push({path:'/home/vip'});
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
                id:this.form.uid,
                role:1
              })
              .then(res=> {
                console.log(res.data);
                if(res.data.code == 0){
                  this.$message.error(res.data.msg);
                }
                else{
                  this.axios.post("/vip/alter",{
                    id:this.form.id,
                    name:this.form.name,
                    tel:this.form.tel,
                    sex:this.form.sex,
                    birth:this.form.birth,
                    address:this.form.address,
                    endTime:this.data.v_endTime,
                    time:this.time,
                    type:this.data.v_state
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
        data.id=item.v_id;
        data.uid = item.u_id;
        data.no=this.PrefixInteger(item.v_id,10);
        data.name = item.v_name;
        data.tel = item.u_tel;
        data.birth = this.switchTimeFormat(item.v_birth);
        data.sex = item.v_sex?'女':'男';
        data.address = item.v_address;
        data.endTime = item.v_state==1?this.switchTimeFormat(item.v_endTime):'非会员';
        console.log(data);
    
        return data;
      },

      // 格式化时间
      switchTimeFormat(time) {
        const dateTime = new Date(time);
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const date = dateTime.getDate();
        return `${year}-${this.PrefixInteger(month,2)}-${this.PrefixInteger(date,2)}`;
      },

      // 格式化数字
      PrefixInteger(num, n) {
        return (Array(n).join(0) + num).slice(-n);
      },

      // 成为会员
      setVip(){
        this.dialogVisible=true;
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
      this.axios.post("/vip/getDetail", {
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
.tiem-msg{
  display: inline-block;
  border-radius: 5px;
  margin-left: 10px;
  padding: 0 10px;
  line-height: 36px;
  color:white;
  background: @yellowColor;
  span{
    margin-left: 10px;
  }
}
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