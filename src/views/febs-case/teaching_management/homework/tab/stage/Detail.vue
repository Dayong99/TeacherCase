<template>
  <el-dialog
    title="作业详情"
    :width="width"
    :visible.sync="isVisible"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="viewBox"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-info table-operation"></i>
      <span>作业详情</span>
    </div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>作业名称：</span>
          {{ view.jobName }}
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>教学阶段：</span>
          {{ view.fgradationid ? view.fgradationname : view.gradationName }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="view.fgradationid ? true : false">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>教学子阶段：</span>
          {{ view.fgradationid ? view.gradationName : "" }}
        </div>
      </el-col>
    </el-row>
       <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>老师权重：</span>
          {{ view.teachStuWeight }}%
        </div>
      </el-col>
    </el-row>
       <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>作业权重：</span>
          {{ view.weight }}%
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col>
        <div class="view-item">
          <span>作业要求：</span>
          <div v-html="view.jobRequire" class="textBox"></div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: "CaseView",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: "700px",
      view: {}
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
      }
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close");
    },
    setView(val) {
      this.view = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.view-item {
  font-size: 16px !important;
}
</style>
