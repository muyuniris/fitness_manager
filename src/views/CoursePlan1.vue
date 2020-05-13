<template>
  <div class="CoursePlan">
    <!-- 标题 -->
    <div class="title">
      <i class="el-icon-document-copy"></i>
      课程安排表
    </div>
    <div class="main">
      <el-row class="day">
        <el-col :span="3"
          class="day-item"
          v-for="(item,index) in day"
          :key="index"
        >
          <div>{{item.week}}</div>
          <div style="font-size:12px">{{item.day}}</div>
        </el-col>
      </el-row>
      <div class="course" v-loading='loading'>
        <el-row class="time-item" v-for="(item,index) in time" :key="index" type="flex" justify="center" align="center">
          <el-col :span="3" class="course-item time-herder">
            {{item+":00-"+(item+1)+":00"}}
          </el-col>
          <el-col :span="3" class="course-item" v-for="(item,i) in data[index]" :key="i">
            <CourseItem :data="item" :timeIndex="[index,i]"  @add="add"></CourseItem>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 新增对话框 -->
    <el-dialog
      title="新增课程"
      :visible.sync="dialogVisible"
      width="40%">
      <div style="margin-bottom: 20px;">当前时间段： {{addTime.date}} {{addTime.time}}:00-{{addTime.time+1}}:00</div>
      <el-form :model="form" size="medium"  label-width="100px">
        <el-form-item label="课程名字" :rules="{ required: true, message: '课程名不能为空', trigger: ['blur','change']}">
          <el-select v-model="form.name" placeholder="请选择课程">
            <el-option v-for="item in courseList" :key="item.c_id" :label="item.c_name" :value="item.c_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课教练:" :rules="{ required: true, message: '授课教练不能为空', trigger: ['blur','change']}">
          <el-select v-model="form.teacher" placeholder="请选择授课教练">
            <el-option v-for="item in teacherList" :key="item.t_id" :label="item.t_name" :value="item.t_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课场地:" :rules="{ required: true, message: '授课场地不能为空', trigger: ['blur','change']}">
          <el-select v-model="form.place" placeholder="请选择授课场地">
            <el-option v-for="item in placeList" :key="item.p_id" :label="item.p_name" :value="item.p_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上限人数:" :rules="{ required: true, message: '上限人数不能为空', trigger: ['blur','change']}">
          <el-input v-model="form.max" placeholder="请输入上限人数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPlan">确 定</el-button>
      </span>
    </el-dialog>

    
  </div>
</template>

<script>
import CourseItem from '../components/CourseItem.vue'
export default {
  name: 'CoursePlan',
  data(){
    return {
      dialogVisible:false,
      addTime:'',
      loading:false,
      form:{
        name:'',
        teacher:'',
        place:'',
        max:''
      },
      courseList:[],
      teacherList:[],
      placeList:[],
      time:[9,10,11,14,15,16],
      data:[]
      // data:[{name:''},{name:'瑜伽'},{name:'瑜伽jhgjhghjgjhgjhgj'},{name:'瑜伽'},{name:'瑜伽'},{name:'瑜伽'},{name:'瑜伽'}]
    }
  },
  components:{
    CourseItem
  },
  computed: {
    day() {
      var arr = [{day:'时间',week:'星期'}];
      var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var date = new Date();

      for (var i = 0; i < 7; i++) {
        var item = {};
        console.log(i);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var day = date.getDate(); //获取当前日(1-31)
        var week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        item.day = year+'-'+month + "-" + day;
        item.date = date;
        if (i == 0) {
          item.week = "今天";
        } else {
          item.week = weeks[week];
        }
        date.setDate(date.getDate() + 1);
        // console.log(week)
        arr.push(item);
      }
      
      console.log(arr);
      return arr;
    }
  },
  methods:{
    load(){
      this.loading=true;
      this.axios.post('/course/getPlan')
      .then(res=>{
        console.log(res);
        if(res.data.code=='200'){
          this.data = res.data.data;
          this.loading=false
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    add(i,j){
      console.log("新增",i,j);
      var time = this.time[i];
      var date = this.day[j+1].day;
      this.addTime = {
        date:date,
        time:time
      }
      this.getCourse();
      this.getTeacher();
      this.getPlace();
      this.dialogVisible=true;
      
    },

    getCourse(){
      this.axios.post('/course/getCourse')
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          this.courseList = res.data.data;
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getTeacher(){
      console.log(this.addTime)
      this.axios.post('/course/getTeacher',{
        addTime:this.addTime,
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          this.teacherList = res.data.data;
          console.log(this.teacherList,this.placeList);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getPlace(){
      console.log(this.addTime)
      this.axios.post('/course/getPlace',{
        addTime:this.addTime,
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          this.placeList = res.data.data;
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    addPlan(){
      console.log(this.form);
      this.axios.post('/course/addPlan',{
        teacher:this.form.teacher,
        name:this.form.name,
        place:this.form.place,
        max:Number(this.form.max),
        date:this.addTime.date,
        time:this.addTime.time
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          this.dialogVisible=true;
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
  created(){
    console.log("a")
    this.load();
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.CoursePlan {
  color: @fontColor;
  background-color: white;
  height: 100%;
}
.title {
  padding: 15px 20px;
  border-top: 3px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
  i {
    margin-right: 2px;
  }
}
.main{
  margin:20px;
  border: 1px solid @lineColor;
  text-align: center;
  .day{
    border-bottom: 1px solid @lineColor;
    background: rgb(247, 247, 247);
    
  }
  .day-item{
    padding:5px 0;
  }
  .time-item{
    margin:10px 0;
    min-height: 85px;
  }
}
.time-herder{
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-input--medium,.el-select,.time-input{
  width: 300px;
}
</style>