<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        课程列表
      </div>
      <!-- 筛选数据的输入表单 -->
      <div class="choose">
        <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
          <el-form-item label="课程名:">
            <el-input v-model="search.name" placeholder="请输入课程名"></el-input>
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
          <el-table-column prop="no" label="课程编号"></el-table-column>
          <el-table-column prop="name" label="课程名"></el-table-column>
          <el-table-column prop="strong" label="课程强度"></el-table-column>
          <el-table-column prop="info" label="课程描述" width="400px"></el-table-column>
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
      search: {},//记录筛选的数据项
      data:[]//表单所以数据
    };
  },
  methods: {
    //新增
    add(){
      this.$router.push({path:'/home/addCourse'});
    },

    // 搜索
    searchMsg(){
      console.log("搜索",this.search);
      this.currentPage = 1;
      this.load();
    },

    //查看
    show(id){
      console.log("查看",id);
      this.$router.push({path:'/home/showCourse/'+id});
    },

    //修改
    alter(id){
      this.$router.push({path:'/home/alterCourse/'+id});
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

    // 格式化数据
    fomateData(list){
      var arr=[];
      if(list){
        for(var i= 0;i<list.length;i++){
          var item={};
          item.id=list[i].c_id;
          item.no=this.PrefixInteger(list[i].c_id,10);
          item.name = list[i].c_name;
          item.strong =  list[i].c_strong;
          item.info = list[i].c_info?list[i].c_info:'待完善';
          item.info = item.info.length<25?item.info:item.info.substring(0,25)+'......'
          arr.push(item);
        }
      }
      return arr;
    },

    // 获取数据
    load(){
      this.loading=true;
      // **************************************获取数据请求*********************************************
      this.axios.post("/course/getData",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        name: this.search.name,
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
    del(id){
      console.log("当前状态",id);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/course/del',{
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

</style>