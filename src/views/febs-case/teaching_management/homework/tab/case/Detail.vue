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
          <span>案例名称：</span>
          {{ view.casename }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>章节名称：</span>
          {{ view.fid ? view.fname : view.sectionname }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="view.fid ? true : false">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <span>子章节名称：</span>
          {{ view.fid ? view.sectionname : "" }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col>
        <div class="view-item">
          <span>作业要求：</span>
          <div v-html="view.jobrequire" class="textBox"></div>
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
    },
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
