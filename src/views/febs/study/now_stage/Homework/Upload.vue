<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i class="el-icon-upload table-operation purple"></i>
      <span>个人上传区</span>
    </div>
    <el-table
      ref="table"
      :data="fileList"
      border
      fit
      style="width: 100%"
      max-height="500"
    >
      <el-table-column
        label="文件名称"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.filename }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日期" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{
            scope.row.createtime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="文件类型"
        :show-overflow-tooltip="true"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.filetype }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="150px"
        class-name="small-padding fixed-width iconBox"
      >
        <template slot-scope="{ row }">
          <a :href="downloadUrl(row)">
            <i class="iconfont icon-xiazai1 table-operation" title="下载" />
          </a>
          <i class="el-icon-delete red" @click="deleteFile(row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- <ul class="fileBox">
      <li v-for="(item,index) in fileList" :key="index">
        <span class="time">{{item.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")}}</span>
        <span>{{item.filename}}</span>
        <div>
          <a :href="downloadUrl(item)"><i class="iconfont icon-xiazai1 table-operation"></i></a>
          <i class="el-icon-delete red" @click="deleteFile(item)"></i>
        </div>
      </li>
    </ul> -->

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
import { parseTime } from "@/utils";
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
      width: "900px",
      fileList: [],
      params: {},
      jobId: null,
      userid: this.$store.state.account.user.id
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
    },
    nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
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
      return globalConfig.baseURL + "caseteach/teachjob/uploadStu";
    },
    getParams() {
      return this.params;
    },
    close() {
      this.$emit("close");
    },
    setId(val) {
      this.jobId = val.id;
      this.params = {
        jobid: this.jobId,
        stuid: this.userid
      };
      this.getFileList();
    },
    getFileList() {
      // let userid = 6
      this.$get("caseteach/teachjob/submit_job", {
        job_id: this.jobId,
        Stuid: this.userid,
        teachid: this.nowCase.id
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
          this.$post("caseteach/teachjob/delsubmitJob", {
            submitJobid: item.id
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
      this.$download("file/download", {
        materialId: item.materialId
      });
    },

    handleSuccess() {
      this.$message.success("上传成功");
      this.getFileList();
    },

    downloadUrl(item) {
      return (
        globalConfig.baseURL + "file/download?materialId=" + item.materialid

      );
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
