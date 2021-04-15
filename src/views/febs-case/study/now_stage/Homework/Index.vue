<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
      class="user-view detail-box"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-notebook-2 table-operation homework yellow"></i>
        <span>教学阶段作业</span>
      </div>
      <div class="filter-container">
        <i
          class="el-icon-edit nav-operation orange"
          title="作业评分"
          @click="correct()"
        />
      </div>
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="loading"
        :data="list"
        border
        fit
        style="width: 100%"
        max-height="500"
      >
        <el-table-column
          label="作业名称"
          align="center"
          :show-overflow-tooltip="true"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.fgradationid
                ? scope.row.fgradationname
                : scope.row.gradationName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学子阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="150"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.fgradationid ? scope.row.gradationName : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师权重(%)" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.teachStuWeight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业权重(%)" width="140px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业附件" align="center" width="120px">
          <template slot-scope="{ row }">
            <i
              class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation mr0 icon"
              title="附件下载"
              @click="getFile(row)"
              style="font-size: 1.4rem"
            />
          </template>
        </el-table-column>
        <el-table-column label="批改文档" align="center" width="120px">
          <template slot-scope="{ row }">
            <svg aria-hidden="true" @click="getPdf(row)">
              <use xlink:href="#icon-PDF1" />
            </svg>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operation')"
          align="center"
          width="150px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i
              class="el-icon-info table-operation"
              title="作业详情"
              @click="showHomework(row)"
            />
            <i
              class="iconfont icon-tijiao table-operation orange"
              title="已提交作业"
              @click="showDownload(row)"
            />
            <i
              class="el-icon-upload table-operation purple"
              title="上传作业"
              @click="showUpload(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 台长打分 -->
    <correct
      ref="correct"
      :dialog-visible="correctVisible"
      @close="correctClose"
    />

    <!-- 上传作业 -->
    <upload ref="upload" :dialog-visible="uploadVisible" @close="uploadClose" />

    <!-- 已提交作业 -->
    <download
      ref="download"
      :dialog-visible="downloadVisible"
      @close="downloadClose"
    />

    <!-- 作业详情 -->
    <homework-detail
      ref="details"
      :dialog-visible="homeworkDetail"
      @close="homeworkClose"
    />

    <!-- 附件下载 -->
    <file-download
      ref="file"
      :dialog-visible="fileVisible"
      @close="fileClose"
    />

    <!--批改文档 -->
    <file ref="pdf" :dialog-visible="pdfVisible" @close="pdfClose" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import Correct from "./CorrectHomework";
import Upload from "./Upload";
import Download from "./Download";
import HomeworkDetail from "./Detail";
import FileDownload from "./File";
import File from "./PdfFile";

export default {
  name: "Detail",
  components: {
    Pagination,
    Correct,
    Upload,
    Download,
    HomeworkDetail,
    FileDownload,
    File
  },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: "1200px",
      tableKey: 0,
      loading: false,
      list: null,

      groupId: null,

      // 台长打分
      correctVisible: false,

      // 作业上传
      uploadVisible: false,

      // 已提交作业
      downloadVisible: false,

      // 作业详情
      homeworkDetail: false,

      // 附件下载
      fileVisible: false,
      title: "附件下载",
      icon:
        "iconfont icon-wulumuqishigongandashujuguanlipingtai-ico- table-operation icon",

      pdfVisible: false
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
    },
    nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    }
  },
  mounted() {
  },
  methods: {
    close() {
      this.$emit("close");
    },
    // 加载表格
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/teachjob/joblist", {
        teachid: this.nowCase.teachid
      }).then(r => {
        const data = r.data.data;
        // this.total = data.total;
        this.list = data;

        this.loading = false;
      });
    },

    // 重置相关信息
    reset() {
      this.$refs.table.clearFilter();
    },

    // 台长打分
    correct() {
      this.correctVisible = true;
      this.$refs.correct.fetch()

      // this.$post("caseteach/job/roleStu", {
      //   teachid: this.teachId,
      //   userid: this.$store.state.account.user.id,
      // }).then((r) => {
      //   if (r.data.data) {
      //     this.correctVisible = true;
      //   } else if (r.data.data == false) {
      //     this.$message.warning("该学生不具备打分功能");
      //   } else {
      //     this.$message.warning(r.data.message);
      //   }
      // });
    },
    correctClose() {
      this.correctVisible = false;
    },

    // 作业上传
    showUpload(row) {
      this.uploadVisible = true;
      this.$refs.upload.setId(row);
    },
    uploadClose() {
      this.uploadVisible = false;
    },

    // 已上传作业
    showDownload(row) {
      console.log(row);
      this.downloadVisible = true;
      this.$refs.download.setId(row.id);
    },
    downloadClose() {
      this.downloadVisible = false;
    },

    // 作业详情
    showHomework(row) {
      this.homeworkDetail = true;
      this.$refs.details.setView(row);
    },
    homeworkClose() {
      this.homeworkDetail = false;
    },

    // 附件下载
    getFile(row) {
      this.fileVisible = true;
      this.$refs.file.setId(row.id);
    },
    fileClose() {
      this.fileVisible = false;
    },

    // 批改文档
    async getPdf(row) {
      await this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.$store.state.account.user.id,
        teachId: this.nowCase.teachid
      })
        .then(r => {
          const data = r.data.data;

          if (data.length === 0) {
            this.groupId = null
            this.$message.warning("学生在该教学任务下未被分组");
          } else {
            this.groupId = data[0].group_id;
          }
        })
        .then(data => {
          if (this.groupId) {
            this.$get("caseteach/teachjob/group_correct", {
              jobid: row.id,
              groupid: this.groupId
            }).then(r => {
              this.pdfVisible = true;
              this.$refs.pdf.setFile(r.data.data);
            });
          }
        })
        .catch(r => {
          this.$message.warning("获取数据失败");
        });
    },
    pdfClose(row) {
      this.pdfVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.member {
  font-size: 16px;
  margin-bottom: 20px;
  span {
    &:first-child {
      margin: 10px;
    }
  }
}

.icon {
  font-size: 1.8rem !important;
}

.iconfont {
  font-size: 1.26rem;
}

svg {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>
