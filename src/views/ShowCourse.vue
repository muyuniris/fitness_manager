<template>
  <div id="show-house">
    <div class="content" v-loading="loading">

      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-s-management"></i>
        <span>课程信息详情</span>

        <!-- 返回按钮 -->
        <div class="back">
          <el-button round size='mini' class="back-btn" icon='el-icon-arrow-left' @click="back">返回</el-button>
        </div>
      </div>

      <!-- 显示信息 -->
      <div class="main" v-show="data" v-loading="loading">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="6" :md="3" :lg="3"><div class="item-title">课程图片:</div></el-col>
          <el-col :xs="24" :sm="18" :md="9" :lg="9"><div>
              <img :src="data.img" class="course-img">
          </div></el-col>
          
        </el-row>
        <el-row  :gutter="10">
          <el-col :xs="24" :sm="6" :md="3" :lg="3"><div class="item-title">课程编号:</div></el-col>
          <el-col :xs="24" :sm="18" :md="9" :lg="9"><div class="msg">{{data.no}}</div></el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :xs="24" :sm="6" :md="3" :lg="3" ><div class="item-title">课程名字:</div></el-col>
          <el-col :xs="24" :sm="18" :md="9" :lg="9" ><div class="msg">{{data.name}}</div></el-col>
        </el-row>
        <el-row  :gutter="10">
          <el-col :xs="24" :sm="6" :md="3" :lg="3" ><div class="item-title">课程强度:</div></el-col>
          <el-col :xs="24" :sm="18" :md="9" :lg="9" ><div class="msg">{{data.strong}}</div></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="3" :sm="3" :md="3" :lg="3" ><div class="item-title">个人描述:</div></el-col>
          <el-col :xs="9" :sm="9" :md="9" :lg="9" ><div class="msg">{{data.info}}</div></el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return { 
      value:3.7 ,
      loading:true,
      data: {},//信息    
    };
  },
  methods: {
    //返回信息列表
    back(){
      this.$router.push({path:'/home/course'});
    },

    //格式化数字
    PrefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },

    // 格式化数据
    formateData(item){
      var data={};
      data.id=item.c_id;
      data.no=this.PrefixInteger(item.c_id,10);
      data.img = item.c_img?this.$store.state.ip+item.c_img:'/img/course.png';
      data.name = item.c_name;
      data.strong = item.c_strong;
      data.info = item.t_info?item.t_info:"待完善";
      this.value = item.t_rate;
      if(item.v_state){
        data.time = this.switchTimeFormat(item.v_startTime)+' 至 '+this.switchTimeFormat(item.v_endTime)
      }
      console.log(data);
  
      return data;
    }
  },
  mounted() {//创建时获取数据
    console.log(this.$route.params.id);
    this.axios.post("/course/getDetail", {
      id:this.$route.params.id
    })
    .then((res) => {
      console.log(res);
      if(res.data.code=='200'){
        this.loading=false;
        this.data=this.formateData(res.data.data)
      }
    })
    .catch(err=> {
      console.log(err)
    })
  },
};
</script>

<style lang="less" scoped>
@import "../assets/less/base.less";
#show-house {
  color: @fontColor;
  background-color: white;
  height: 100%;
}
.msg{
  height: 40px;
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
.choose .el-button--text{
  margin-top: 10px;
  color: #A7B1C2;
  padding: 15px 20px;
}
.btn-choose.el-button--text{
  color: @fontColor;
  border: 1px solid @lineColor;
}
.tab-content{
  border: 1px solid @lineColor;
}
.item-title{
  color: @fontColor;
  font-weight: 600;
  text-align: right;
  line-height: 45px;
  font-size: 14px;
}
.msg{
  color: @fontColor;
  line-height: 45px;
  font-size: 14px;
}
@media screen and (max-width: 768px) {
  .item-title{
    text-align: left;
  }
}
.el-tabs--border-card>.el-tabs__content{
  padding: 30px;
}
.add-btn{
  text-align: right;
  padding: 5px 20px;
  padding-top:20px;
  margin-top: 30px;
  border-top: 1px solid @lineColor;
}
.searchTel-btn{
  background: @blueColor;
  border-color: @blueColor;
}
.rate{
  height: 45px;
  align-items: center;
  display: flex;
}
.course-img{
  width:200px;
}
</style>