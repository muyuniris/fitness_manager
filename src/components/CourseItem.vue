<template>
  <div class="CourseItem" :class="{course:data}" @click="course(data)">
    <div v-if="data" title="查看详情" >
      <div>{{data.cName}}</div>
      <div>
        <i class="el-icon-user info">{{data.tName}}</i>
      </div>
      <div>
        <i class="el-icon-location-outline info">{{data.pName}}</i>
      </div>
    </div>
    <div v-else title="新增课程">
      <span class="el-icon-plus"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseItem',
  props: {
    data: Object,
    timeIndex: Array
  },
  methods:{
    course(item){
      console.log(this.timeIndex)
      if(item){
        // this.$emit('show');
         this.$emit('add',this.timeIndex[0],this.timeIndex[1]);
      }
      else{
        this.$emit('add',this.timeIndex[0],this.timeIndex[1]);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../assets/less/base.less";
.CourseItem{
  margin:0 10px;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  border: 1px dashed #ddd;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.info{
  font-size: 12px;
}
.course{
  background: @courseColor;
}
</style>
