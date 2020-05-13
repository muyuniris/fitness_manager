<template>
  <div class="content">
    <el-row :gutter="20" style="margin:0 10px">
      <el-col :span="12">
        <div class="grid-content bg-purple userTotal">
          <div class="grid-content-item userCount">
            <div class="user">
              <div class="el-icon-s-custom"></div>
              <div class="userNum">
                <span>{{userTotal}}</span>
                <br />用户总数
              </div>
            </div>
          </div>
          <div class="grid-content-item userEcharts">
            <v-chart :options="userOption" style="width:100%" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple communityTotal">
          <!-- 标题 -->
          <div class="title">
            <i class="el-icon-s-comment"></i>
            <span>反馈统计</span>
          </div>
          <div class="clearfix">
            <div class="commentItem">
              <span style="color:#EE5F6E">{{rateTotal}}</span>
              <br />
              <label>教练评论总数</label>
            </div>
            <div class="commentItem">
              <span style="color: #1E85C6">{{suggestTotal}}</span>
              <br />
              <label>意见反馈总数</label>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin:20px">
      <div class="grid-content bg-purple">
        <!-- 标题 -->
        <div class="title">
          <i class="el-icon-thumb"></i>
          <span>预约统计</span>
        </div>
        <el-row class="fix-row">
          
          <el-col :span="16" style="height:420px;">
            <v-chart :options="option" style="width:100%" />
          </el-col>
          <el-col :span="8">
            <div class="num">
              <span style="color:#0696cf">{{courseTotal}}</span>
              <br />
              <label>课程预约半年总数</label>
            </div>
            <div class="num">
              <span style="color:#4DD3D8">{{teacherTotal}}</span>
              <br />
              <label>教练预约半年总数</label>
            </div>
            <div class="num">
              <span style="color:#F8AF5F">{{placeTotal}}</span>
              <br />
              <label>场地预约半年总数</label>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-row>
  </div>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less" scoped>
@import "../assets/less/base.less";
.right-btn {
  float: right;
  a {
    color: #8e8e8e;
  }
}
.userTotal {
  height: 200px;
}
.fix-row {
  border-bottom: 1px solid #f3f3f4;
  padding: 20px;
  // height: 300px;
  overflow: hidden;
}
.recycle-row {
  border-bottom: 1px solid #f3f3f4;
  padding: 20px;
  height: 138px;
  overflow: hidden;
}
.title {
  padding: 15px 20px;
  line-height: 21px;
  height: 21px;
  border-top: 3px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
  i {
    margin-right: 2px;
  }
}
.num {
  text-align: center;
  height: 140px;
  padding: 0 20px;
  span {
    display: inline-block;
    line-height: 60px;
    font-size: 34px;
  }
  label {
    font-size: 14px;
    color: #8e8e8e;
  }
}

.commentItem {
  text-align: center;
  float: left;
  width: 50%;
  height: 145px;
  padding: 20px 40px;
  box-sizing: border-box;
  span {
    display: inline-block;
    line-height: 80px;
    font-size: 36px;
  }
}
.userTotal .grid-content-item {
  // width: 50%;
  float: left;
  height: 200px;
  box-sizing: border-box;
}
.userCount {
  padding: 20px 40px;
  width: 50%;
  .user{
    background: @greenColor;
    
  }
  .teacher{
    background: #ffd205;
  }
  & > div {
    height: 100%;
    border-radius: 5px;
    div {
      text-align: center;
      color: white;
    }
    .el-icon-s-custom {
      width: 100%;
      text-align: center;
      font-size: 60px;
      line-height: 80px;
    }
    .userNum {
      span {
        font-size: 22px;
      }
    }
  }
}

.fix {
  background: #ffd205;
}
.recycle {
  background: #ffa172;
}
.userEcharts {
  width: 50%;
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
.bg-purple {
  background: white;
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
.cpntent {
  padding: 20px;
  color: @fontColor;
}
.part {
  background: white;
  border-radius: 5px;
  color:#fde038;
}
</style>

<script>
import ECharts from 'vue-echarts/components/ECharts' 
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
// 按需导入echarts的图形类型
import "echarts/lib/chart/radar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
// 导入工具部分


// register component to use
import "echarts/lib/component/legendScroll";
// register component to use
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markArea";
import "echarts/lib/component/dataZoom";

export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      userTotal: 0,
      rateTotal: 0,
      suggestTotal: 0,
      teacherTotal:0,
      courseTotal:0,
      placeTotal:0,
      option: {},
      userOption: {}
    };
  },
  methods:{
    getUserTotal(){
      this.axios.post("/users/getCount")
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200');
        this.userTotal = res.data.data.user+res.data.data.teacher+res.data.data.manager;
        this.userNum = [
          { value: res.data.data.user||0, name: "普通用户" },
          { value: res.data.data.teacher||0, name: "教练" },
          { value: res.data.data.manager||0, name: "管理员" },
        ];
        this.userOption = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/> {b}: {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['普通用户', '教练', '管理员']
          },
          series: [
            {
              name: "用户组成",
              type: "pie",
              radius: ["50%", "70%"],
              center: ["50%", "40%"],
              avoidLabelOverlap: false,
              legend: {
                orient: "vertical",
                x: "left"
              },
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "18",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.userNum,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                },
                normal: {
                  color: function(params) {
                    //自定义颜色
                    var colorList = [
                      "#4DD3D8",
                      "#F8AF5F",
                      "#FCB5A0",
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              }
            }
          ]
        };
      });
    },
    getrateTotal(){
      this.axios.post("/teacher/getRateCount")
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200');
        this.rateTotal=res.data.data;
      })
    },
    getSuggestTotal(){
      this.axios.post("/suggest/getCount")
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200');
        this.suggestTotal=res.data.data;
      })
    },
    getOrderTotal(){
      var labelOption = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
      };
      this.axios.post('/order/orderCount')
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          var teacherList = res.data.data.teacher;
          var courseList = res.data.data.course;
          var placeList = res.data.data.place;
          console.log(teacherList)
          var teacherSum=0,courseSum=0,placeSum=0
          for(var i=0;i<6;i++){
            teacherSum=teacherSum+teacherList[i];
            courseSum=courseSum+courseList[i];
            placeSum=placeSum+placeList[i];
          }
          this.teacherTotal=teacherSum;
          this.courseTotal = courseSum;
          this.placeTotal = placeSum;
          this.option={
        title: {
          text: "近半年预约情况汇总",
          left: "center",
          textStyle: {
            fontSize: 14
          }
        },
        color: ['#0696cf', '#4DD3D8','#F8AF5F'],
        tooltip: {

          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['课程预约', '私教预约', '场地预约']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: res.data.data.time
          }
        ],
        yAxis: [
            {
              type: 'value'
            }
        ],
        series: [
          {
            name: '课程预约',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            data: courseList
          },
          {
            name: '私教预约',
            type: 'bar',
            label: labelOption,
            data: teacherList
          },
          {
            name: '场地预约',
            type: 'bar',
            label: labelOption,
            data: placeList
          },
        ]
      }
        }
      })
    }
  },
  created() {
    this.getUserTotal();
    this.getrateTotal();
    this.getSuggestTotal();
    this.getOrderTotal();
  }
};
</script>