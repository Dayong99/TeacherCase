<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
      class="user-view detail-box"
    >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-chengji table-operation light_purple"></i>
        <span>成绩详情</span>
      </div>
      <h3>
        姓名：{{ username }} , 总成绩：{{ score }} ,
        {{ getRoleName(2) }}打分：{{ stuScore }}
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
                ? scope.row.fgradationName
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
        <el-table-column label="作业权重(%)" width="140px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师打分" align="center" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherWeight }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="老师打分权重（%）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teaStuw }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          :label="$t('table.operation')"
          align="center"
          width="100px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i class="el-icon-tickets table-operation" title="详情" @click="showDetail(row)" />
            <i
              class="el-icon-s-tools table-operation"
              title="修改"
              @click="edit(row)"
            />
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        class="pageBox"
      />
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
      width: "1200px",
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },
      // 总成绩
      score: 0,
      stuScore: 0,

      userid: this.$store.state.account.user.id,
      username: this.$store.state.account.user.name,

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
    nowStage() {
      return JSON.parse(window.localStorage.getItem("case"));
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
    getData() {
      this.getScore();
      this.getStuScore();
      this.fetch();
    },
    // 该学生该教学下总成绩
    getScore() {
      this.$get("caseteach/teachjob/getSocres", {
        teachid: this.nowStage.id,
        stuid: this.userid
      }).then(r => {
        const data = r.data.data;
        this.score = data.score;
      });
    },
    getStuScore() {
      this.$get("caseteach/teachjob/getStucode", {
        teachid: this.nowStage.id,
        userid: this.userid
      }).then(r => {
        this.stuScore = r.data.data;
      });
    },
    // 该学生该教学下案例作业成绩
    fetch(params = {}) {
      this.$get("caseteach/teachjob/getStuGradationScors", {
        teachid: this.nowStage.id,
        userid: this.userid
      }).then(r => {
        const data = r.data.data;
        this.list = data;
      });
    },
    // 导出表格
    exportExcel() {
      this.$download(
        "system/user/excel",
        {
          pageSize: this.pagination.size,
          pageNum: this.pagination.num
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },

    // 修改成绩
    editClose() {
      this.editVisible = false;
    },
    editSuccess() {
      this.fetch();
    },
    edit(row) {
      this.$refs.edit.setScore(row);
      this.editVisible = true;
    },

    close() {
      this.$emit("close");
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
