<template>
  <el-dialog
    :width="width"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i
        class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation icon-download"
      ></i>
      <span>作业附件</span>
    </div>
    <ul class="fileBox">
      <li v-for="(item, index) in fileList" :key="index">
        <span>{{item.fileName}}</span>
        <div>
          <a :href="download(item)">
            <i class="iconfont icon-xiazai1 table-operation"></i>
          </a>
        </div>
      </li>
    </ul>
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
      modal: false,
      width: "700px",
      fileList: [],
      jobId: null,
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
      },
    },
  },
  mounted() {},
  methods: {
    reset() {
      this.fileList = [];
    },
    close() {
      this.$emit("close");
    },
    setId(val) {
      this.jobId = val;
      this.getFileList();
    },
    getFileList() {
      this.$get("caseteach/job/job_material", {
        jobid: this.jobId,
      }).then((r) => {
        this.fileList = r.data.data;
      });
    },

    download(item) {
      return globalConfig.baseURL + "file/download?materialId=" + item.id;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.icon-download {
  font-size: 1.6rem !important;
}
</style>
