<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        管理员列表
      </div>
      <!-- 筛选数据的输入表单 -->
      <div class="choose">
        <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
          <el-form-item label="姓名">
            <el-input v-model="search.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="预留手机号">
            <el-input v-model="search.tel" placeholder="请输入预留手机号"></el-input>
          </el-form-item>
          <el-form-item label="管理员类别">
            <el-select v-model="search.type" placeholder="请选择活动区域">
              <el-option label="全部" value=""></el-option>
              <el-option label="普通管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 新增和搜索按钮 -->
      <div class="btn" style="text-align:right;margin-right:30px">
        <!-- <el-button icon="el-icon-upload" class="btn-exclude" @click="exclude">导出报表</el-button> -->
        <el-button icon="el-icon-plus" class="btn-add" @click="add">新增</el-button>
        <el-button icon="el-icon-search" class="btn-search" @click="searchMsg">搜素</el-button>
      </div>

      <!-- 表格数据 -->
      <div class="mytable">
        <el-table :data="data" border style="width: 100%" v-loading="loading">
          <el-table-column prop="no" label="编号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="tel" label="手机号"></el-table-column>
          <el-table-column prop="type" label="类别"></el-table-column>
          <el-table-column prop="lock" label="账号状态"></el-table-column>
          <!-- 相关操作按钮 -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="info" icon="el-icon-edit-outline" size="mini" class="btn-alter" @click="alter(scope.row.id)" title="编辑"></el-button>
              <el-button type="danger" icon="el-icon-lock" size="mini" class="btn-lock" @click="lock(scope.row.uid,0)" title="解除" v-show="scope.row.lock=='禁用'"></el-button>
              <el-button type="info" icon="el-icon-unlock" size="mini" class="btn-unlock" @click="lock(scope.row.uid,1)" title="禁用" v-show="scope.row.lock!='禁用'"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="clearfix" v-show="!loading"><el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" :pager-count="5" :hide-on-single-page="true" @current-change="changePage" class="page" :current-page="currentPage"></el-pagination></div>
      </div>
      
    </div>
</template>
<script>
// import http from '../utils/http';
export default {
  data() {
    return {
      loading:true,
      currentPage:1,//记录当前页
      pageSize:5,
      total:0,
      search: {},//记录筛选的数据项
      data:[]//表单所以数据
    };
  },
  methods: {
    //新增
    add(){
      this.$router.push({path:'/home/addRole'});
    },

    // 搜索
    searchMsg(){
      console.log("搜索",this.search);
      this.currentPage = 1;
      this.load();
    },

    //修改
    alter(id){
      this.$router.push({path:'/home/alterRole/'+id});
    },

    //改变页码
    changePage(val){
      this.currentPage=val;
      console.log(val);
      this.load();
    },


    // 格式化数字
    PrefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },

    // 通过生日获取年龄
    GetAge(strBirthday){       
      var returnAge,
      strBirthdayArr=strBirthday.split("-"),
      birthYear = strBirthdayArr[0],
      birthMonth = strBirthdayArr[1],
      birthDay = strBirthdayArr[2],  
      d = new Date(),
      nowYear = d.getFullYear(),
      nowMonth = d.getMonth() + 1,
      nowDay = d.getDate();   
      if(nowYear == birthYear){
        returnAge = 0;//同年 则为0周岁
      }
      else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
          if(nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay;//日之差
            if(dayDiff < 0) {
              returnAge = ageDiff - 1;
            }else {
              returnAge = ageDiff;
            }
          }else {
            var monthDiff = nowMonth - birthMonth;//月之差
            if(monthDiff < 0) {
              returnAge = ageDiff - 1;
            }
            else {
              returnAge = ageDiff ;
            }
          }
        }else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      } 
      return returnAge;//返回周岁年龄
    },

    // 格式化数据
    fomateData(list){
      var arr=[];
      if(list){
        for(var i= 0;i<list.length;i++){
          var item={};
          item.id=list[i].m_id;
          item.uid=list[i].u_id;
          item.no=this.PrefixInteger(list[i].m_id,10);
          item.name = list[i].m_name;
          item.tel = list[i].u_tel;
          item.type = list[i].m_role==1?'超级管理员':'普通管理员';
          item.lock = list[i].u_lock==1?'禁用':'正常'
          arr.push(item);
        }
      }
      return arr;
    },

    // 获取数据
    load(){
      this.loading=true;
      // **************************************获取数据请求*********************************************
      this.axios.post("/role/getData",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        name: this.search.name,
        tel: this.search.tel,
        type: this.search.type
      })
      .then(res => {
        console.log("获取到数据",res.data.data);
        this.data=this.fomateData(res.data.data.list)
        this.total = res.data.data.count;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
    },

    // 禁用和解除
    lock(id,status){
      console.log("当前状态",id,status)
      this.axios.post('/users/lock',{
        id:id,
        lock:status
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          this.load();
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }

  },
  created(){
    this.load();
  },

};
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
#house {
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
.choose {
  padding: 20px 20px 0 20px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.box-info {
  width: 100px;
  float: left;
  line-height: 40px;
  text-align: right;
}
.myinput {
  margin-left: 100px;
}
.myinput .el-input {
  width: 90%;
}
.btn{
  margin-left: 30px;
  color: white;
  .btn-exclude{
    color:@yellowColor;
    border-color: @yellowColor;
    &:hover{
      color: white;
      background: @yellowColor;
    }
  }
  .btn-add {
    background: @greenColor;
    color: white;
    &:hover {
      background: @darkGreenColor;
    }
  }
  .btn-search {
    background: @blueColor;
    color: white;
    &:hover {
      background: @darkBlueColor;
    }
  }
}
.mytable {
  padding: 20px 30px;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 3px;
}
.btn-alter {
  background: @blueColor;
  border-color: @blueColor;
}
.page {
  float: right;
  margin-top: 20px;
}
.btn-show{
  background:@greenColor;
}
.btn-lock{
  background:@redColor;
  border-color:@redColor;
}
.btn-unlock{
  background:@yellowColor;
  border-color:@yellowColor;
}
</style>