<template>
  <div class="app-container">
    <h3 class="study-title">
      <i class="el-icon-s-management table-operation" />
      <span>教学阶段</span>
      <div class="caseBox">
        <i
          class="iconfont icon-grouping table-operation orange"
          title="分组查询"
          @click="showGroup"
        />
        <i
          class="iconfont icon-jiedianhuiyuanfenzu table-operation green"
          title="分组详情"
          @click="showGroupDetail"
        />
        <i
          class="el-icon-notebook-2 table-operation yellow"
          title="查看作业"
          @click="showHomework"
        />
        <i
          class="iconfont icon-chengji table-operation light_purple"
          title="查看成绩"
          @click="showScore"
        />
      </div>
    </h3>
    <el-table
      ref="table"
      :key="tableKey"
      :data="list"
      border
      fit
      style="width: 100%"
      max-height="500"
    >
      <el-table-column
        label="阶段名称"
        :show-overflow-tooltip="true"
        align="center"
        min-width="80px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.gradationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度状态" align="center" width="150px">
        <template slot-scope="scope">
          <span v-text="showStatus(scope.row.status)"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="资料"
        align="center"
        width="120px"
        class-name="iconBox"
      >
        <template slot-scope="{ row }">
          <i class="el-icon-upload table-operation" @click="getFile(row)"></i>
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
            class="el-icon-info table-operation"
            @click="showDetail(row)"
            title="任务详情"
          />
          <i
            class="iconfont icon-ai-module table-operation orange"
            title="查看子阶段"
            @click="addChild(row)"
          />
          <i
            class="iconfont icon-tishi table-operation green"
            title="操作提示"
            @click="showTip(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 参考资料 -->
    <file ref="file" :dialog-visible="fileVisible" @close="fileClose" />

    <!-- 操作提示 -->
    <tip ref="tip" :dialog-visible="tipVisible" @close="TipClose" />

    <!-- 详情 -->
    <info
      ref="info"
      :dialog-visible="infoVisible"
      @close="detailClose"
      :detailTitle="detailTitle"
    />

    <!-- 子阶段 -->
    <child
      ref="child"
      :dialog-visible="childVisible"
      :title="childTitle"
      @close="childClose"
    />

    <!-- 查看成绩 -->
    <score ref="score" :dialog-visible="scoreVisible" @close="scoreClose" />

    <!-- 分组详情 -->
    <group-detail
      ref="group_detail"
      :dialog-visible="groupDetailVisible"
      @close="groupDetailClose"
    />

    <!-- 分组配置 -->
    <group ref="group" :dialog-visible="groupVisible" @close="groupClose" />

    <!-- 查看作业 -->
    <homework
      ref="homework"
      :dialog-visible="homeworkVisible"
      @close="homeworkClose"
    />
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";

import Tip from "../../caseCommon/tip/Index";
import File from "./Upload";
import Info from "../../caseCommon/task/Index";
import Child from "./Child";

import Score from "./Score";
import GroupDetail from "../Group/GroupDetail";
import Group from "../Group/Index";
import Homework from "./Homework/Index";

let timer = "";
export default {
  name: "CaseEdit",
  components: {
    Pagination,
    Tip,
    File,
    Info,
    Child,
    Score,
    GroupDetail,
    Group,
    Homework
  },
  props: {},
  data() {
    return {
      modal: false,
      buttonLoading: false,
      width: "1200px",
      userid:this.$store.state.account.user.id,

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },

      // 查看成绩
      scoreVisible: false,

      // 查看分组
      groupDetailVisible: false,

      // 分组
      groupVisible: false,

      // 查看作业
      homeworkVisible: false,

      // 操作提示
      tipVisible: false,

      // 参考资料
      fileVisible: false,

      // 阶段详情
      infoVisible: false,
      detailTitle: '',

      // 查看子阶段
      childVisible: false,
      childTitle: ""
    };
  },
  filters: {},
  computed: {
    nowStage(){
      return JSON.parse(window.localStorage.getItem("case"))
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == "/study/now_stage") {
        this.getData();
      } else {
        clearInterval(timer);
      }
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    showStatus(val) {
      switch (val) {
        case 0:
          return "未开始";
        case 1:
          return "已开始";
      }
    },
    // 实时刷新状态
    getData() {
      this.fetch();
      let that = this;
      timer = setInterval(function() {
        that.fetch();
      }, 5000);
    },
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/teach-gradation/list", {
        teachname: this.nowStage.teachname
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },

    // 成绩详情
    showScore() {
      this.$get("caseteach/job/getStuscore", {
        teachId: this.nowStage.teachid,
        studentId: this.userid
      }).then(r => {
        if (r.data.code == 800) {
          this.$message.warning("学生在该教学任务下未被分组");
        } else {
          this.scoreVisible = true;
          this.$refs.score.getData();
        }
      });
    },
    scoreClose() {
      this.scoreVisible = false;
    },

    // 查看分组
    showGroupDetail(row) {
      this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.userid,
        teachId: this.nowStage.teachid
      }).then(r => {
        const data = r.data.data;

        if (data.length === 0) {
          this.$message.warning("学生在该教学任务下未被分组");
        } else {
          this.groupDetailVisible = true;
          this.$refs.group_detail.fetch();
        }
      });
    },
    groupDetailClose() {
      this.groupDetailVisible = false;
    },

    // 分组
    showGroup() {
      this.groupVisible = true;
      this.$refs.group.getData()
    },
    groupClose() {
      this.groupVisible = false;
    },

    // 查看作业
    showHomework() {
      this.homeworkVisible = true;
      this.$refs.homework.fetch()
    },
    homeworkClose() {
      this.homeworkVisible = false;
    },

    // 查看详情
    detailClose() {
      this.infoVisible = false;
    },
    showDetail(row) {
      this.infoVisible = true;
      this.$refs.info.setView(row.gradationWork);
      this.detailTitle = row.gradationName;
    },

    // 操作提示
    showTip(row) {
      if (row.instructions !== "" && row.instructions !== null) {
        this.tipVisible = true;
        this.$refs.tip.setView(row.instructions);
      } else {
        this.$message.warning("暂无操作提示");
      }
    },
    TipClose() {
      this.tipVisible = false;
    },

    // 参考资料
    getFile(row) {
      if (Number(row.status) === 0) {
        this.$message.warning("该阶段未开始");
      } else {
        this.fileVisible = true;
        this.$refs.file.setId(row.id);
      }
    },
    fileClose() {
      this.fileVisible = false;
    },

    // 查看子阶段
    addChild(row) {
      this.childVisible = true;
      this.childTitle = row.gradationName + "—子阶段";
      this.$refs.child.setId(row);
    },
    childClose() {
      this.childVisible = false;
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  .el-table {
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -o-user-select: none;
    user-select: none;
  }
}
</style>
