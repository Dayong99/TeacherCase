<template>
  <el-dialog :width="width" :visible.sync="isVisible" class="viewBox">
    <div slot="title" class="dialog-title">
      <i class="el-icon-info table-operation"></i>
      <span>{{detailTitle}}</span>
    </div>
    <el-row :gutter="10">
      <el-col>
        <div class="view-item">
          <span>任务详情：</span>
          <div v-html="view" class="textBox"></div>
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
    detailTitle:{
      type: String,
      default: "",
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
      },
    },
  },
  mounted() {
  },
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
