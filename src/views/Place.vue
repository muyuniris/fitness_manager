<template>
  <div id="house">
      <!-- 标题 -->
      <div class="title">
        <i class="el-icon-document-copy"></i>
        场地列表
      </div>   

       <!-- 筛选数据的输入表单 -->
      <div class="choose">
        <el-form :inline="true" :model="search" class="demo-form-inline" size="small">
          <el-form-item label="场地名:">
            <el-input v-model="search.name" placeholder="请输入场地名"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 新增和搜索按钮 -->
      <div class="btn" style="text-align:right;margin-right:30px;margin-top:30px">
        <!-- <el-button icon="el-icon-upload" class="btn-exclude" @click="exclude">导出报表</el-button> -->
        <el-button icon="el-icon-plus" class="btn-add" @click="add">新增</el-button>
        <el-button icon="el-icon-search" class="btn-search" @click="searchMsg">搜素</el-button>
      </div>

      <!-- 表格数据 -->
      <div class="mytable">
        <el-table :data="data" border style="width: 100%" v-loading="loading">
          <el-table-column prop="no" label="场地编号"></el-table-column>
          <el-table-column prop="name" label="场地名称"></el-table-column>
          <el-table-column prop="price" label="预约价格"></el-table-column>
          <el-table-column prop="info" label="场地描述"></el-table-column>
          <!-- 相关操作按钮 -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-search" size="mini" class="btn-show" @click="show(scope.$index)" title="查看详情"></el-button>
              <el-button type="info" icon="el-icon-edit-outline" size="mini" class="btn-alter" @click="alter(scope.row.id)" title="编辑"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" class="btn-del" @click="del(scope.row.id)" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="clearfix" v-show="!loading"><el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" :pager-count="5" :hide-on-single-page="true" @current-change="changePage" class="page" :current-page="currentPage"></el-pagination></div>
      </div>

      <!-- 新增对话框 -->
      <el-dialog :title="title" :visible.sync="dialog" width="500px" ref='dialog' @close="close" class="dialog">
        <div class="img">
          <img :src="this.detail.img" alt="">
        </div>
        <div class="name">{{detail.name}} ￥{{detail.price}}</div>
        <div class="info">描述：{{detail.content}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button type="primary" @click="submit('form')">确 定</el-button>
        </div>
      </el-dialog>

      
    </div>
</template>
<script>
// import http from '../utils/http';
export default {
  data() {
    return {
      title:'',
      dialog:false,
      form:{},
      loading:true,
      currentPage:1,//记录当前页
      pageSize:5,
      total:0,
      data:[],//表单所以数据
      detail:{},
      search:{}
    };
  },
  methods: {
    searchMsg(){
      this.load();
    },
    //新增
    add(){
       this.$router.push({path:'/home/addPlace'});
    },
    show(index){
      this.detail=this.data[index];
      console.log(this.detail);
      this.dialog=true;
      this.title='查看详情'
    },
    //修改
    alter(id){
      this.$router.push({path:'/home/alterPlace/'+id});      
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
          item.img=this.$store.state.ip+list[i].p_img;
          item.id=list[i].p_id;
          item.price = list[i].p_price;
          item.no=this.PrefixInteger(list[i].p_id,10);
          item.name = list[i].p_name;
          item.content = list[i].p_info?list[i].p_info:'暂无';
          item.info = item.content.length<15?item.content:item.content.substring(0,15)+'......'
          arr.push(item);
        }
      }
      return arr;
    },

    // 获取数据
    load(){
      this.loading=true;
      // **************************************获取数据请求*********************************************
      this.axios.post("/place/getData",{
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        name:this.search.name
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
        this.axios.post('/place/del',{
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
    cancel(formName){
      this.$refs[formName].resetFields();
    },

    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("新增场地")
          // 新增
          if(this.title=='新增场地'){
            this.axios.post('/place/add',{
              name:this.form.name
            })
            .then(res=>{
              if(res.data.code=='200'){
                this.$message({
                  type: 'success',
                  message: '新增成功'
                });
                this.load();
                this.dialog=false;
              }
            })
          }

          // 修改
          else{
            this.axios.post('/place/alter',{
              name:this.form.name,
              id:this.id
            })
            .then(res=>{
              if(res.data.code=='200'){
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
                this.load();
                this.dialog=false;
              }
            })
          }
        }
      })
    },
    close(){
      this.$refs['form'].resetFields();
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
.dialog{
  .img{
    width: 300px;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
  .name{
    font-size: 20px;
    text-align: center;
    padding: 10px;
  }
  .info{
    padding: 20px;
    text-align: center;
  }
}
</style>