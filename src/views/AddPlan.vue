<template>
  <div class="addvip">
   <div class="content">
      <!-- 标题 -->
    <div class="title">
      <i class="el-icon-edit"></i>
      <span>新增课程安排</span>

      <!-- 返回按钮 -->
      <div class="back">
        <el-button round size='mini' class="back-btn" icon='el-icon-arrow-left' @click="back">返回</el-button>
      </div>
    </div>
    

    <!-- 表单内容 -->
    <el-form :model="form" class="main" size="medium" status-icon label-width="120px" ref="ruleForm" :rules="rules" >
      <el-form-item label="课程名字" prop="course" required>
        <el-select v-model="form.course" placeholder="请输入课程名字"
        :loading="courseLoading" remote filterable :remote-method="getCourse">
          <el-option v-for="item in courseList" :key="item.c_id" :label="item.c_name" :value="item.c_id" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="授课时间" prop="time" required>
         <el-cascader
          v-model="form.time"
          :options="day"
          @change="timeChange"
          style="width:300px">
          </el-cascader>
      </el-form-item>


      <el-form-item label="授课教练:" prop="teacher" required ref="teacher">
        <el-select v-model="form.teacher" placeholder="请输入授课教练" @focus="focusFn('teacher')"
        :loading="teacherLoading" remote filterable :remote-method="getTeacher">
          <el-option v-for="item in teacherList" :key="item.t_id" :label="item.t_name" :value="item.t_id" ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="授课场地:" prop="place" required ref="place">
        <el-select v-model="form.place" placeholder="请输入授课场地" @focus="focusFn('place')"
        :loading='placeLoading' remote filterable :remote-method="getPlace">
          <el-option v-for="item in placeList" :key="item.p_id" :label="item.p_name" :value="item.p_id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上限人数:" prop="max"  required>
        <el-input v-model="form.max" placeholder="请输入上限人数"></el-input>
      </el-form-item>

      <el-form-item label="课程价格:" prop="price"  required>
        <el-input v-model="form.price" placeholder="请输入课程价格"></el-input>
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
      var checkMax = (rule, value, callback) => {
        var max = Number(value);
       
        if(isNaN(max)){
          return callback(new Error('需输入数字'));
        }
        else if (value>30||value<5) {
          return callback(new Error('上限人数需在5-30之间'));
        }
        else{
          callback()
        }
      };
      var check = (rule, value, callback) => {
        console.log("aa",value);
        if (!this.form.time) {
          return callback(new Error('请先选择时间'));
        }
        else{
          callback()
        }
      };
       var checkPrice = (rule, value, callback) => {
        var price = Number(value);
       
        if(isNaN(price)){
          return callback(new Error('需输入数字'));
        }
        else{
          callback()
        }
      };
      return {
        courseLoading:false,
        teacherLoading:false,
        placeLoading:false,
        form: {
          course:'',
          place:'',
          teacher:''
        },
        courseList:[],
        teacherList:[],
        placeList:[],
        rules:{
          course:[
            { required: true, message: '课程名不能为空', trigger: ['blur','change']}
          ],
          time:[
            { required: true, message: '课程时间不能为空', trigger: ['blur','change']}
          ],
          teacher: [
            { validator: check, trigger: ['blur','change']},  
            { required: true, message: '课程教练不能为空', trigger: ['blur','change']},
          ],
          place:[
            { validator: check, trigger: ['blur','change','facus']},
            { required: true, message: '课程场地不能为空', trigger: ['blur','change']},
            
          ],
          max: [
            { required: true, message: '上线人数不能为空',trigger: ['blur','change']},
            { validator: checkMax, trigger: ['blur','change','facus']},
          ],
          price:[
            { required: true, message: '课程价格不能为空',trigger: ['blur','change']},
            { validator: checkPrice, trigger: ['blur','change','facus']},
          ]

        }
      }
    },
    methods: {
      //返回房产信息列表
      back(){
        this.$router.push({path:'/home/coursePlan'});
      },

      focusFn(prop){
        console.log(prop);
        if(!this.form.time){
          this.$refs['ruleForm'].validateField(prop)
        }
      },

      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("seccess!",this.form);
            this.axios.post('/course/addPlan',{
              course:this.form.course,
              teacher:this.form.teacher,
              name:this.form.name,
              place:this.form.place,
              max:Number(this.form.max),
              addTime:this.form.time,
              price:this.form.price,
            })
            .then(res=>{
              console.log(res.data);
              if(res.data.code=='200'){
                this.back();
              }
            })
            .catch(err=>{
              console.log(err)
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
      getCourse(query){
        console.log(query);
        if (query !== '') {
          this.courseLoading=true
          this.axios.post('/course/getCourse',{
            course:query
          })
          .then(res=>{
            console.log(res.data);
            if(res.data.code=='200'){
              this.courseList = res.data.data;
              this.courseLoading=false
            }
          })
          .catch(err=>{
            console.log(err)
          })
        }
      },

      getTeacher(query){
        if(query !== ''){
          this.teacherLoading=true;
          this.axios.post('/course/getTeacher',{
            addTime:this.form.time,
            teacher:query,
          })
          .then(res=>{
            console.log(res.data);
            if(res.data.code=='200'){
              this.teacherList = res.data.data;
              this.teacherLoading=false;
            }
          })
          .catch(err=>{
            console.log(err)
          })
        }
      },
      getPlace(query){
        if(query !== ''){
          // this.placeLoading=true;
          this.axios.post('/course/getPlace',{
            addTime:this.addTime,
            place:query
          })
          .then(res=>{
            console.log(res.data);
            if(res.data.code=='200'){
              this.placeList = res.data.data;
              // this.placeLoading=false;
            }
          })
          .catch(err=>{
            console.log(err)
          })
        }
      },

      timeChange(){
        // console.log("change");
        this.form.teacher='';
        this.$refs['teacher'].resetField();
        this.$refs['place'].resetField();
        this.teacherList=[];
        this.placeList=[];
      }

    },
    computed: {
      day() {
        var arr = [];
        var date = new Date();
        var time = [9,10,11,14,15,16]
        for (var i = 0; i < 7; i++) {
          date.setDate(date.getDate() + 1);
          var item = {};
          var year = date.getFullYear();
          var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
          var day = date.getDate(); //获取当前日(1-31)
          month = month < 10 ? "0" + month : month;
          day = day < 10 ? "0" + day : day;
          item.value = year+'-'+month + "-" + day;
          item.label = item.value;
          item.children=[];
          for(var j=0;j<time.length;j++){
            var child = {};
            child.value = time[j]+":00:00";
            child.label = time[j]+':00-'+(time[j]+1)+':00';
            item.children.push(child);
          }
          
          // console.log(week)
          arr.push(item);
        }
        
        return arr;
      }
    },
  }
</script>
<style lang="less">
@import "../assets/less/base.less";

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: @greenColor;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

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
.el-input--medium,.el-select,.time-input,.el-input__inner{
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