<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        会员列表
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
          <el-table-column prop="no" label="会员号"></el-table-column>
          <el-table-column prop="name" label="会员姓名"></el-table-column>
          <el-table-column prop="tel" label="预留手机号"></el-table-column>
          <el-table-column prop="inTime" label="注册时间"></el-table-column>
          <el-table-column prop="outTime" label="到期时间"></el-table-column>
          <el-table-column prop="grade" label="积分"></el-table-column>
          <el-table-column prop="level" label="等级"></el-table-column>
          <!-- 相关操作按钮 -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-search" size="mini" class="btn-show" @click="show(scope.$index)" title="查看详情"></el-button>
              <el-button type="info" icon="el-icon-edit-outline" size="mini" class="btn-alter" @click="alter(scope.$index)" title="编辑"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" class="btn-del" @click="del(scope.$index)" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="clearfix" v-show="!loading"><el-pagination background layout="prev, pager, next" :page-size="5" :total="totalPage" :pager-count="5" :hide-on-single-page="true" @current-change="changePage" class="page" :current-page="currentPage"></el-pagination></div>
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
      totalPage:0,
      search: {//记录筛选的数据项
       name:"",
       tel:""
      },
      data:[]//表单所以数据
    };
  },
  methods: {
    add(){//新增
      this.$router.push({path:'/home/addHouse'});
    },
    exclude: async function (){//导出报表

    },
    searchMsg(){//************************搜索****************************
      console.log("搜索",this.search);
      this.loading = true;
      this.currentPage = 1;
     

    },
    show(index){//查看
      console.log("查看",index);
      var id= this.houseData[index].id;
      this.$router.push({path:'/home/showHouse/'+id});
    },
    alter(index){//修改
    var id= this.houseData[index].id;
      this.$router.push({path:'/home/alterHouse/'+id});
    },
    del(index){//删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var id= this.houseData[index].id;
        console.log("删除",id);


        // ****************************************删除请求**********************************************
      this.axios
        .get("/InhabitantAndHouseProperty/deleteById", {params:{
          housePropertyId: id
        }})
        .then(res => {
          console.log("bbb",res.data);
          if(res.data.code=="200"){
            this.axios
        .get("/InhabitantAndHouseProperty/getAllInfo", {params:{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }})
        .then(res => {
          console.log("aaa",res.data.data);
          this.houseData = this.fomateData(res.data.data.list);
          
          this.totalPage = res.data.data.page.totalCount;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
          }
          // this.houseData = this.fomateData(res.data.data.list);
          // this.totalPage = res.data.data.page.totalCount;
          // this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });

        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
    changePage(val){//改变页码
      this.currentPage=val;
      console.log(val);
      this.loading =true;
      this.axios
        .post("/InhabitantAndHouseProperty/selectAllLike", {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          housePropertyNo: this.search.houseNum,
          inhabitantName: this.search.ownerName,
          telNum: this.search.ownerPhone,
          houseState: this.search.houseState
        })
        .then(res => {
          console.log("模糊查询",res.data.data);
          this.houseData = this.fomateData(res.data.data.list);
          console.log(this.houseData);
          this.totalPage = res.data.data.page.totalCount;
          this.loading = false;
          
        })
        .catch(err => {
          console.log(err);
        });
    },
 addZero(v){
        return v < 10 ? "0" + v : v;
      },
    switchTimeFormat(time) {
      
      const dateTime = new Date(time);
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const date = dateTime.getDate();

      return `${year}-${this.addZero(month)}-${this.addZero(date)}`;
    },
    fomateData(list){
      var arr=[];
      if(list){
        for(var i= 0;i<list.length;i++){
          var item={};
          item.id=list[i].v_id;
          item.no=list[i].v_no;
          item.name = list[i].u_name;
          item.tel = list[i].u_tel;
          item.inTime = this.switchTimeFormat(list[i].v_inTime);
          item.outTime = this.switchTimeFormat(list[i].v_outTime);
          item.grade = list[i].v_grade;
          item.level = list[i].v_level;
          arr.push(item);
        }
      }
      return arr;
    }
  },
  created(){
    
    // **************************************获取数据请求*********************************************
    this.axios
        .post("/vip/getData",{
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        })
        .then(res => {
          console.log("获取到数据",res.data.data);
          this.data=this.fomateData(res.data.data)
          this.totalPage = 2;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
  },
  // computed: {
  //   headers() {
  //     return{
  //       "Authorization": sessionStorage.getItem('token'), // 直接从本地获取token就行
  //       "validateId": sessionStorage.getItem('validateId')
  //     }
  //   }
  // }
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
</style>