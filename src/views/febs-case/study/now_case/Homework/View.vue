<template>
  <el-dialog :width="width" :visible.sync="isVisible" class="viewBox">
    <div slot="title" class="dialog-title">
      <i class="el-icon-tickets table-operation"></i>
      <span>作业详情</span>
    </div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>案例：</span>
          {{ view.casename }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>章节：</span>
          {{ view.fid ? view.fname : view.sectionname }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" v-show="view.fid">
        <div class="view-item">
          <span>子章节：</span>
          {{ view.fid ? view.sectionname : "" }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>作业权重(%)：</span>
          {{ view.weight }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col>
        <div class="view-item">
          <span>作业要求：</span>
          <span v-html="view.jobrequire"></span>
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
      default: false,
    },
  },
  data() {
    return {
      width: "700px",
      view: {},
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
      },
    },
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close");
    },
    setView(val) {
      this.view = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.case-view {
  .view-item {
    margin: 7px;
    span {
      margin-left: 5px;
    }
  }
}
.view-item  {
  font-size: 16px;
}
</style>
