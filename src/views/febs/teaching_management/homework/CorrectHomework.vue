<template>
  <div>
    <el-dialog
      :width="width"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-edit table-operation orange"></i>
        <span>批改作业</span>
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
        <el-table-column label="组名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.groupname }}</span>
          </template>
        </el-table-column>        
        <el-table-column label="已提交作业个数" align="center" width="150px">
          <template slot-scope="{ row }">
            <span @click="download(row)" class="pointer">{{ row.num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成绩" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批改文档" align="center" width="120px">
          <template slot-scope="{ row }">
            <span @click="getFile(row)" class="pointer">{{ row.file }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operation')"
          align="center"
          width="120px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i
              class="iconfont icon-pigai table-operation orange"
              title="打分"
              @click="edit(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        class="pageBox"
      />
    </el-dialog>

    <!-- 文件下载 -->
    <download
      ref="download"
      :dialog-visible="downloadVisible"
      @close="downloadClose"
    />

    <!--修改成绩 -->
    <edit
      ref="edit"
      :dialog-visible="editVisible"
      @close="editClose"
      @success="editSuccess"
    />

    <!--批改 -->
    <correct
      ref="correct"
      :dialog-visible="correctVisible"
      @close="correctClose"
      @success="editSuccess"
    />

    <!--批改文档 -->
    <file ref="file" :dialog-visible="fileVisible" @close="fileClose" />
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";
import Download from "./Download";
import Edit from "./Edit";
import Correct from "./Correct";
import File from "./PdfFile";

export default {
  name: "CaseEdit",
  components: { Pagination, Download, Edit, Correct, File },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      buttonLoading: false,
      width: "900px",

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },

      downloadVisible: false,
      editVisible: false,

      jobid: null,

      correctVisible: false,

      fileList: [],

      fileVisible: false,
      timer: null
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
    },
     teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    },
  },
  watch: {
    isVisible(val) {
      if (!val) {
        clearInterval(this.timer);
      }
    }
  },
  mounted() {},
  methods: {
    // 小组已提交作业
    getHomework(row) {
      let that = this;
      let data;
      return new Promise(function(resolve, reject) {
        that.$get("caseteach/teachjob/groupjob", {
          job_id: that.jobid,
          groupid: row.groupid,
          teachid: that.teachinginfo.id
        });
      }).then(r => {
        data = r.data.data;
        console.log(r);
      });
    },
    setId(val) {
      this.jobid = val;
      this.fetch()
      const that = this;
      this.timer = setInterval(function() {
        that.fetch();
      }, 5000);
    },
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/teachjob/groupJobs", {
        jobid: this.jobid
      }).then(r => {
        const data = r.data.data;
        this.list = data;

        this.list.forEach((item, index) => {
          item.num = 0;
          item.file = "无";
          this.getHomeworkNum(item, index);
          this.getFileVal(item, index);
        });
        this.loading = false;
      });
    },
    // 已提交作业个数
    getHomeworkNum(item, index) {
      this.$get("caseteach/teachjob/groupjob", {
        job_id: this.jobid,
        groupid: item.groupid,
        teachid: this.teachingInfo.id
      }).then(r => {
        let data = r.data.data;
        // this.total = data.total;
        item.num = data.length;
        this.$set(this.list, index, item);
      });
    },
    // 是否已提交批改文档
    getFileVal(item, index) {
      this.$get("caseteach/teachjob/group_correct", {
        jobid: this.jobid,
        groupid: item.groupid
      }).then(r => {
        if (r.data.data.length > 0) {
          item.file = "有";
        } else {
          item.file = "无";
        }
        this.$set(this.list, index, item);
      });
    },
    close() {
      this.$emit("close");
    },

    getMember(arr) {
      let str = "";
      arr.forEach((item, index) => {
        if (index !== arr.length - 1) {
          str += item.username + "，";
        } else {
          str += item.username;
        }
      });
      return str;
    },

    reset() {},

    // 参考资料
    download(row) {
      this.downloadVisible = true;
      this.$refs.download.setId({
        jobid: this.jobid,
        groupid: row.groupid
      });
    },
    downloadClose() {
      this.downloadVisible = false;
    },

    // 修改成绩
    editClose(row) {
      this.editVisible = false;
    },
    editSuccess() {
      this.fetch();
    },
    edit(row) {
      this.$get("caseteach/teachjob/groupjob", {
        job_id: this.jobid,
        groupid: row.groupid,
        teachid: this.teachingInfo.id
      }).then(r => {
        const data = r.data.data;
        // this.total = data.total;
        if (data.length == 0) {
          this.$message.warning("该组未提交作业");
        } else {
          this.editVisible = true;
          this.$refs.edit.setId({
            jobid: this.jobid,
            groupid: row.groupid,
            score: row.score
          });
        }
      });
    },

    // 批改作业
    correctClose(row) {
      this.correctVisible = false;
    },

    correct(row) {
      this.correctVisible = true;
      this.$refs.correct.setId({
        jobid: this.jobid,
        groupid: row.groupid
      });
    },

    // 老师批改文档
    getFile(row) {
      console.log(this.$store.state.teaching.teachinginfo)
              this.fileVisible = true;
               this.$refs.file.setFile({
          jobid: this.jobid,
          groupid: row.groupid
        });
        this.$refs.file.getList();
      // this.$get("caseteach/teachjob/groupjob", {
      //   job_id: this.jobid,
      //   groupid: row.groupid,
      //   teachid: this.teachinginfo.id
      // }).then(r => {
      //   const data = r.data.data;
      //   this.$refs.file.setFile({
      //     jobid: this.jobid,
      //     groupid: row.groupid
      //   });
      //   this.$refs.file.getList();
      //   // }
      // });
    },
    fileClose(row) {
      this.fileVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
  color: #2a82e4;
  font-weight: bold;
}
.el-table {
  margin-top: 20px;

  .icon-pigai {
    font-size: 1.5rem;
  }
}
</style>
