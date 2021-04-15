<template>
  <el-dialog
    :width="width"
    :modal-append-to-body="false"
    :append-to-body="true"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-upload table-operation"></i>
      <span>上传批改文档</span>
    </div>
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="getURL()"
      :data="getParams()"
      :on-success="handleSuccess"
      :limit="1"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">{{
        $t("common.cancel")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "Upload",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      modal: false,
      width: "700px",
      fileList: [],
      params: {},
      oneScore: this.initScore(),

      jobid: "",
      groupid: ""
    };
  },
  filters: {},
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    }
  },
  mounted() {},
  methods: {
    initScore() {
      return {
        score: ""
      };
    },
    reset() {
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["upload"].clearFiles();
      });
    },

    close() {
      this.$emit("close");
    },

    setId(val) {
      this.jobid = val.jobid;
      this.groupid = val.groupid;
    },

    getURL() {
      return globalConfig.baseURL + "caseteach/job/upload";
    },
    getParams() {
      return {
        jobid: this.jobid,
        groupid: this.groupid
      };
    },
    handleSuccess() {
      this.isVisible = false;
      this.reset();
      this.$message.success("上传成功");
      this.$emit("success");
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.el-input {
  width: 200px;
}
</style>
