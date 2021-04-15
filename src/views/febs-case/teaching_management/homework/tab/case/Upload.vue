<template>
  <el-dialog
    :width="width"
    :modal-append-to-body="false"
    :append-to-body="true"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-upload table-operation"></i>
      <span>作业附件</span>
    </div>
    <ul class="fileBox">
      <li v-for="(item, index) in fileList" :key="index">
        <span>{{ item.fileName }}</span>
        <div>
          <a :href="download(item)">
            <i class="iconfont icon-xiazai1 table-operation"></i>
          </a>
          <i class="el-icon-delete red" @click="deleteFile(item)"></i>
        </div>
      </li>
    </ul>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">{{
        $t("common.cancel")
      }}</el-button>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="getURL()"
        :show-file-list="modal"
        :data="getParams()"
        :on-success="handleSuccess"
      >
        <el-button type="primary">
          上传
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </el-upload>
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
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modal: false,
      width: "700px",
      fileList: [],
      params: {},
      jobId: null
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
    reset() {
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["upload"].clearFiles();
      });
    },
    getURL() {
      return globalConfig.baseURL + "caseteach/job/job_upload";
    },
    getParams() {
      return this.params;
    },
    close() {
      this.$emit("close");
    },
    setId(val) {
      this.jobId = val;
      this.params = {
        jobid: this.jobId
      };
      this.getFileList();
    },
    getFileList() {
      this.$get("caseteach/job/job_material", {
        jobid: this.jobId
      }).then(r => {
        this.fileList = r.data.data;
      });
    },
    // 删除单个文件
    deleteFile(item) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.$post("caseteach/job/del_material ", {
            materialid: item.id
          }).then(() => {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
            });
            const index = this.fileList.indexOf(item);
            this.fileList.splice(index, 1);
          });
        })
        .catch(() => {
          this.$message.info("删除已取消");
        });
    },
    download(item) {
      return globalConfig.baseURL + "file/download?materialId=" + item.id;
    },

    handleSuccess() {
      this.$message.success("上传成功");
      this.getFileList();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
