<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      class="user-view detail-box"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-info table-operation"></i>
        <span>个人成绩</span>
      </div>
      <h3>姓名：{{ studentName }} ，总成绩：{{ score }}</h3>

      <el-table
        ref="table"
        v-loading="loading"
        :data="list"
        border
        fit
        style="width: 100%"
        max-height="500"
      >
        <el-table-column
          label="作业名称"
          :show-overflow-tooltip="true"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.casename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.section }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学子阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.section }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师权重(%)" align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.secw }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业权重(%)" align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.secw }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师打分" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.teachcod }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="getRoleName(2) + '打分'"
          align="center"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-input @blur="modifyCode(row)" v-model="row.stucod"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="成绩" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.scor }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";

export default {
  name: "Detail",
  components: { Pagination },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: "1100px",
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      // 总成绩
      stuid: null,
      studentName: "",
      score: 0,

      jobStr: "",

      roleList: []
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
     teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    initRoles() {
      this.$get("caseteach/group-stu/showRole").then(r => {
        this.roleList = r.data.data;
      });
    },
    getRoleName(id) {
      let name;
      this.roleList.forEach((item, index) => {
        if (Number(item.role_id) == Number(id)) {
          name = item.role_name;
        }
      });
      return name;
    },
    close() {
      this.$emit("close");
    },
    setId(val) {
      this.stuid = val.userid;
      this.studentName = val.username;
      this.getScore();
      this.fetch();
    },
    // 该学生该教学下总成绩
    getScore() {
      this.$get("caseteach/job/getStuOne", {
        teachid: this.teachingInfo.id,
        userid: this.stuid
      }).then(r => {
        const data = r.data.data;
        if (data.length === 1) {
          this.score = data[0].zscor;
        }
      });
    },
    // 该学生该教学下案例作业成绩
    fetch(params = {}) {
      this.list = [];
      this.$get("caseteach/job/getStuscore", {
        teachId: this.teachingInfo.id,
        studentId: this.stuid
      }).then(r => {
        const data = r.data.data;
        if (data.length !== 0) {
          let arr = [];
          data.forEach((item, index) => {
            arr.push(item.job_id);
          });
          this.jobStr = arr.join(",");

          this.$get("caseteach/job/getSocre", {
            jobid: this.jobStr,
            stuid: this.stuid
          }).then(r => {
            const data1 = r.data.data;
            // this.total = data.total;
            this.list = data1;
          });
        }
      });
    },
    // 导出表格
    exportExcel() {
      this.$download(
        "system/user/excel",
        {
          pageSize: this.pagination.size,
          pageNum: this.pagination.num,
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },

    close() {
      this.$emit("close");
    },

    // 修改台长打分
    modifyCode(row) {
      this.$get("caseteach/job/teach_upd_code", {
        caseid: row.caseid,
        teachid:  this.teachingInfo.id,
        userid: this.stuid,
        score: row.stucod
      }).then(r => {
        this.fetch();
        this.$message.success("修改台长打分成功");
      });
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
</style>
