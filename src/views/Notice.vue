<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        意见列表
      </div>
      <!-- 筛选数据的输入表单 -->
      <div class="choose">
        <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
          <el-form-item label="标题:">
            <el-input v-model="search.title" placeholder="请输入公告标题"></el-input>
          </el-form-item>
          <el-form-item label="发布时间:">
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
        <el-button icon="el-icon-plus" class="btn-add" @click="add">新增</el-button>
        <el-button icon="el-icon-search" class="btn-search" @click="searchMsg">搜素</el-button>
      </div>

      <!-- 表格数据 -->
      <div class="mytable">
        <el-table :data="data" border style="width: 100%" v-loading="loading">
          <el-table-column prop="no" label="公告编号"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="subContent" label="内容" width="300px"></el-table-column>
          <el-table-column prop="time" label="发布时间"></el-table-column>
          <!-- 相关操作按钮 -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-search" size="mini" class="btn-show" @click="show(scope.row.id)" title="查看详情"></el-button>
              <el-button type="info" icon="el-icon-edit-outline" size="mini" class="btn-alter" @click="alter(scope.row.id)" title="编辑"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" class="btn-del" @click="del(scope.row.id)" title="删除"></el-button>
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
      data:[],//表单所以数据
      detail:{}
    };
  },
  methods: {

    // 搜索
    searchMsg(){
      console.log("搜索",this.search);
      this.currentPage = 1;
      this.load();
    },

    //查看
    show(id){
      this.$router.push({path:'/home/showNotice/'+id});
    },
    alter(id){
      this.$router.push({path:'/home/alterNotice/'+id});
    },
    add(){
      this.$router.push({path:'/home/addNotice'});
    },
    //改变页码
    changePage(val){
      this.currentPage=val;
      console.log(val);
      this.load();
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

    // 格式化数据
    fomateData(list){
      var arr=[];
      if(list){
        for(var i= 0;i<list.length;i++){
          var item={};
          item.id=list[i].n_id;
          item.no=this.PrefixInteger(list[i].n_id,10);
          item.title = list[i].n_title;
          item.time = this.switchTimeFormat(list[i].n_time)
          item.content = list[i].n_msg;
          item.subContent = item.content.length<15?item.content:item.content.substring(0,15)+'......'
          arr.push(item);
        }  
      }
      return arr;
    },

    // 获取数据
    load(){
      this.loading=true;
      console.log(this.search)
      if(!this.search.time){
        this.search.time=['','']
      }
      // **************************************获取数据请求*********************************************
      this.axios.post("/notify/getData",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        title: this.search.title,
        startTime: this.search.time[0],
        endTime:this.search.time[1]
      })
      .then(res => {
        console.log("获取到数据",res.data);
        this.data=this.fomateData(res.data.data.list);
        this.total = res.data.data.count;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
    },

    // 删除
    del(id){
      console.log("当前状态",id);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/notify/del',{
          id:id
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
    },

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

</style>