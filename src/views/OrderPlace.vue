<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        教练预约列表
      </div> 
      <!-- 筛选数据的输入表单 -->
      <div class="choose">
        <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
          <el-form-item label="场地名">
            <el-input v-model="search.place" placeholder="请输入课程名"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="search.user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="课程时间:">
             <el-date-picker
                v-model="search.time"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <!-- 新增和搜索按钮 -->
      <div class="btn" style="text-align:right;margin-right:30px">
        <el-button icon="el-icon-search" class="btn-search" @click="searchMsg">搜素</el-button>
      </div>

      <!-- 表格数据 -->
      <div class="mytable">
        <el-table :data="data" border style="width: 100%" v-loading="loading">
          <el-table-column prop="user" label="用户名"></el-table-column>
          <el-table-column prop="tel" label="联系电话"></el-table-column>
          <el-table-column prop="place" label="预约场地"></el-table-column>
          <el-table-column prop="time" label="预约时间" width="200px"></el-table-column>
          <!-- 相关操作按钮 -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" class="btn-del" @click="del(scope.row)" title="取消预约" v-show="scope.row.state"></el-button>
              <span v-show="!scope.row.state">已过期</span>
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
      search: {
        time:['','']
      },//记录筛选的数据项
      data:[]//表单所以数据
    };
  },
  methods: {

    // 搜索
    searchMsg(){
      console.log("搜索",this.search);
      this.currentPage = 1;
      this.load();
    },


    //改变页码
    changePage(val){
      this.currentPage=val;
      console.log(val);
      this.load();
    },

    // 格式化时间
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const day = dateTime.getDate();
      var hour = dateTime.getHours();
      var time = this.PrefixInteger(hour,2)+':00-'+(this.PrefixInteger(hour+1,2))+":00"
      return `${year}-${this.PrefixInteger(month,2)}-${this.PrefixInteger(day,2)} ${time}`;
    },

    // 格式化数字
    PrefixInteger(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },

    // 格式化数据
    fomateData(list){
      var arr=[];
      if(list){
        for(var i= 0;i<list.length;i++){
          var item={};
          item.id=list[i].op_id;
          item.uid = list[i].u_id;
          item.price = list[i].p_price
          item.user = list[i].v_name;
          item.tel = list[i].u_tel;
          item.place=list[i].p_name;
          item.state = list[i].cp_state;
          item.time=this.switchTimeFormat(list[i].op_time);
          item.state = list[i].state;
          arr.push(item);
        }
      }
      console.log(arr)
      return arr;
    },

    // 获取数据
    load(){
      this.loading=true;
      if(!this.search.time){
        this.search.time=['','']
      }
      console.log(this.search.time)
      // **************************************获取数据请求*********************************************
      this.axios.post("/order/getPlace",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        place: this.search.place,
        user: this.search.user,
        startTime: this.search.time[0],
        endTime:this.search.time[1]
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

    // 删除
    del(row){
      console.log("删除",row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/order/delPlaceOrder',{
          id:row.id,
          price:row.price,
          uid:row.uid
        })
        .then(res=>{
          if(res.data.code=='200'){
            this.load();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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