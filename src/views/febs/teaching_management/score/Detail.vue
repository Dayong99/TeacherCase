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
      <h3>
        姓名：{{ studentName }} , 总成绩：{{ score }} ,
        {{ getRoleName(2) }}打分：
        <el-input
          @blur="modifyCode(stuScore)"
          :readonly="readonly"
          v-model="stuScore"
          style="width:100px;margin-bottom:10px;"
        ></el-input>
      </h3>

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
            <span>{{ scope.row.jobName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.fgradationid
                ? scope.row.fgradationName
                : scope.row.gradationName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教学子阶段"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.fgradationid ? scope.row.gradationName : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作业权重(%)" align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师打分" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherWeight }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :label="getRoleName(2) + '打分'"
          align="center"
          width="120px"
        >
          <template slot-scope="{ row }">
            <el-input @blur="modifyCode(row)" v-model="row.stuScore"></el-input>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="成绩" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.score }}</span>
          </template>
        </el-table-column> -->
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

      roleList: [],
      stuScore: 0,
      readonly: false
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
      console.log(val);
      this.stuid = val.id;
      this.studentName = val.name;
      this.fetch();
      this.getStuScore();
      this.getScore();
    },
    getScore() {
      this.$get("caseteach/teachjob/getSocres", {
        teachid: this.teachingInfo.id,
        stuid: this.stuid
      }).then(r => {
        this.score = r.data.data.score;
      });
    },
    getStuScore() {
      this.$get("caseteach/teachjob/getStucode", {
        teachid: this.teachingInfo.id,
        userid: this.stuid
      }).then(r => {
        this.stuScore = r.data.data;
      });
    },
    // 该学生该教学下案例作业成绩
    fetch(params = {}) {
      this.list = [];
      this.$get("caseteach/teachjob/getStuGradationScors", {
        teachid: this.teachingInfo.id,
        userid: this.stuid
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        if (this.list.length !== 0) {
          this.readonly = false;
        } else {
          this.readonly = "readonly";
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
    modifyCode() {
      if (!this.readonly) {
        this.$post("caseteach/teachjob/updStuCode", {
          jobid: "",
          teachid: this.teachingInfo.id,
          userid: this.stuid,
          score: this.stuScore
        }).then(r => {
          this.fetch();
          this.$message.success("修改分数成功");
          this.getScore()
          this.$emit('update')
        });
      }
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
