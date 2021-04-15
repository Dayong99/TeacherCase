<template>
  <el-dialog
    :width="width"    
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-upload table-operation"></i>
      <span>参考资料</span>
    </div>
    <ul class="fileBox">
      <li v-for="(item,index) in fileList" :key="index">
        <span>{{item.fileName}}</span>
        <div>
          <i class="iconfont icon-xiazai1 table-operation" @click="download(item)"></i>
          <i class="el-icon-delete red" @click="deleteFile(item)"></i>
        </div>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          plain
          :loading="buttonLoading"
          @click="isVisible = false"
        >{{ $t('common.cancel') }}</el-button>
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
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      id: null,
      modal: false,
      buttonLoading: false,
      width: "700px",
      fileList: [],
      params: {},
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      },
    },
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
      return globalConfig.baseURL + "file/upload";
    },
    getParams() {
      return this.params;
    },
    close() {
      this.$emit("close");
    },
    setId(val) {
      this.params = {
        fileSource: 1,
        parentId: val,
      };
      this.id = val;
      this.getFileList();
    },
    getFileList() {
      this.$get("caseteach/section-material/showMaterial", {
        id: this.id,
      }).then((r) => {
        this.fileList = r.data.data.rows;
      });
    },
    // 删除单个文件
    deleteFile(item) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          this.$delete("caseteach/section-material", { ids: item.id }).then(
            () => {
              this.$message({
                message: this.$t("tips.deleteSuccess"),
                type: "success",
              });
              const index = this.fileList.indexOf(item);
              this.fileList.splice(index, 1);
            }
          );
        })
        .catch(() => {
          this.$message.info("删除已取消");
        });
    },
    getName(str) {
      let i = str.indexOf("&");
      return str.substring(i + 1);
    },
    download(item) {
      this.$download(
        "file/download",
        {
          materialId: item.id,
        },
        this.getName(item.fileName)
      );
    },

    handleSuccess() {
      this.$message.success("上传成功");
      this.getFileList();
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
