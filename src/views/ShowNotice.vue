<template>
  <div class="informationDetail">
    <!-- 标题 -->
    <div class="title">
      <i class="el-icon-s-management"></i>
      <span>教练信息详情</span>

      <!-- 返回按钮 -->
      <div class="back">
        <el-button round size='mini' class="back-btn" icon='el-icon-arrow-left' @click="back">返回</el-button>
      </div>
    </div>

    <!-- 显示信息 -->
    <div class="main" v-show="!loading" v-loading="loading">
      <div class="notify-title">{{title}}</div>
      <div class="time">{{time}}
      </div>
      <div class="content">
        <div class="line" v-for="(item,index) in msg" :key='index'>{{item}}</div>
      </div>
      <div class="img">
        <img :src="img" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      title:'',
      time:"",
      msg:[],
      img:'',
      loading:false,
    }
  },
  methods:{
    // 格式化时间
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth()+1;
      var day = dateTime.getDate();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      return year+"年"+month+"月"+day+"日";
    },
    back(){
      this.$router.push("/home/notice");
    }
  },
  created(){
    this.axios.post('/notify/getDetail',{
      id:this.$route.params.id
    })
    .then(res=>{
      console.log(res.data)
      if(res.data.code=='200'){
        this.title = res.data.data.n_title;
        this.time = this.switchTimeFormat(res.data.data.n_time);
        this.msg = res.data.data.n_msg.replace(/\n|\r\n/g,"*").split('*');
        this.img = this.$store.state.ip+res.data.data.n_img;
      }
    });
    
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.informationDetail{
  color: @fontColor;
  background-color: white;
  height: 100%;
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
}
.main{
  padding: 20px;
  .notify-title{
    font-size: 24px;
    font-weight: bold;
  }
  .time{
    margin-top: 20px;
    color: gray;
    vertical-align: middle;
    line-height: 24px;

  }
  .content{
    line-height: 30px;
    margin-top: 20px;
    word-wrap:break-word;  
    word-break:break-all;
  }
  .img{
    padding: 20px 0;
    width: 300px;
    img{
      width: 100%;
    }
  }
}
</style>