<template>
  <div>
    <el-dialog
      :width="width"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <svg aria-hidden="true">
          <use xlink:href="#icon-PDF1" />
        </svg>
        <span>批改文档</span>
      </div>
      <ul class="fileBox">
        <li v-for="(item, index) in list" :key="index">
          <span>{{ item.fileName }}</span>
          <div>
            <a :href="download(item)">
              <i class="iconfont icon-xiazai1 table-operation" title="下载" />
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
          :data="getParams()"
          :on-success="handleSuccess"
          :limit="1"
          :show-file-list="modal"
        >
          <el-button type="primary"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "@/utils";

export default {
  name: "CaseEdit",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      width: "700px",

      // 表格
      list: [],

      jobid: "",
      groupid: ""
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
      }
    }
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setFile(val) {
      this.jobid = val.jobid;
      this.groupid = val.groupid;
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.list = [];
      this.$nextTick(() => {
        this.$refs["upload"].clearFiles();
      });
    },
    // 下载文件
    download(row) {
      return (
        globalConfig.baseURL + "file/download?materialId=" + row.materialId
      );
    },

    getList() {
      this.$get("caseteach/teachjob/group_correct", {
        jobid: this.jobid,
        groupid: this.groupid
        // teachid: this.teachid,
      }).then(r => {
        this.list = r.data.data;
      });
    },

    // 上传批改文档
    getURL() {
      return globalConfig.baseURL + "caseteach/teachjob/upload";
    },
    getParams() {
      return {
        jobid: this.jobid,
        groupid: this.groupid
      };
    },
    handleSuccess() {
      this.getList();
      this.$message.success("上传成功");
      this.$emit("success");
    },
    download(item) {
      return globalConfig.baseURL + "file/download?materialId=" + item.id;
    },
    // 删除单个文件
    deleteFile(item) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.$post("caseteach/job/delcorrect", {
            id: item.id
          }).then(() => {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
            });
            const index = this.list.indexOf(item);
            this.list.splice(index, 1);
          });
        })
        .catch(() => {
          this.$message.info("删除已取消");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
svg {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
