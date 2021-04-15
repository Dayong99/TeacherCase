<template>
  <div class="app-container">
    <introduction :nowCase="nowCase" />

    <h3 class="study-title">
      <i class="el-icon-s-management table-operation" />
      <span>任务简介</span>
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
      >
      <el-table-column
        label="章节"
        :show-overflow-tooltip="true"
        align="center"
        min-width="80px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sectionname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="子章节" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.sectionName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="任务"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span v-html="showWork(scope.row.sectinwork)"></span>
        </template>
      </el-table-column>
      <el-table-column label="进度状态" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | showStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="资料"
        align="center"
        width="120px"
        class-name="iconBox"
      >
        <template slot-scope="{ row }">
          <i
            class="iconfont icon-download table-operation"
            @click="getFile(row)"
          ></i>
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
            title="详情"
            @click="showDetail(row)"
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
    <file
      ref="file"
      :title="title"
      :icon="icon"
      :dialog-visible="fileVisible"
      @close="fileClose"
    />

    <!-- 操作提示 -->
    <tip ref="tip" :dialog-visible="caseTipVisible" @close="TipClose" />

    <!-- 阶段详情 -->
    <detail
      ref="detail"
      :dialog-visible="detailVisible"
      :detailTitle="sectionName"
      @close="detailClose"
    />

    <!-- 查看成绩 -->
    <score ref="score" :dialog-visible="scoreVisible" @close="scoreClose" />

    <!-- 查看分组 -->
    <group-detail
      ref="group_detail"
      :dialog-visible="groupDetailVisible"
      @close="groupDetailClose"
    />

    <!-- 分组 -->
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
import File from "../../caseCommon/Download/Index";
import Score from "./Score";
import GroupDetail from "../Group/GroupDetail";
import Group from "../Group/Index";

import Homework from "./Homework/Index";
import Detail from "../../caseCommon/task/Index";
import Introduction from "./Introduction";

let timer = "";
export default {
  name: "CaseEdit",
  components: {
    Pagination,
    Tip,
    File,
    Score,
    GroupDetail,
    Group,
    Homework,
    Detail,
    Introduction,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
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
      typeList: [],

      // 查看成绩
      scoreVisible: false,

      // 查看分组
      groupDetailVisible: false,

      // 分组
      groupVisible: false,

      // 查看作业
      homeworkVisible: false,

      // 操作提示
      caseTipVisible: false,

      // 参考资料
      fileVisible: false,
      title: "参考资料",
      icon: "el-icon-upload table-operation",

      // 阶段详情
      detailVisible: false,
      sectionName: ""
    };
  },
  filters: {
    showStatus(val) {
      switch (val) {
        case 0:
          return "未开始";
        case 1:
          return "已开始";
      }
    },
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
    nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    },
  },
  watch: {
    $route(to, from) {
      if (to.path == "/study/now_case") {
        this.getData();
      } else {
        clearInterval(timer);
      }
    },
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getType() {
      this.$get("caseteach/case-type-info").then((r) => {
        if (r.data.code == 20000) {
          this.typeList = r.data.data;
        }
      });
    },
    showType(val) {
      let name;
      this.typeList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          name = item.typeName;
        }
      });
      return name;
    },

    //实时更新数据 
    getData() {
      this.getUrl();
      this.getType();
      this.fetch();
      let that = this;
      timer = setInterval(function () {
        that.fetch();
      }, 5000);
    },
    fetch() {
      this.loading = true;
      this.$get("caseteach/teach-section/showSections", {
        teachid: this.nowCase.teachid,
        caseid: this.nowCase.caseid,
      }).then((r) => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },
    getProcessType() {
      this.$get("caseteach/pro-type-info").then((r) => {
        if (r.data.code == 20000) {
          this.processList = r.data.data;
        }
      });
    },
    showProcess(val) {
      let process;
      this.processList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          process = item.typeName;
        }
      });
      return process;
    },

    // 成绩详情
    showScore() {
      this.$get("caseteach/job/getStuscore", {
        teachId: this.nowCase.teachid,
        studentId: this.userid,
      }).then((r) => {
        if (r.data.code == 800) {
          this.$message.warning("学生在该教学任务下未被分组");
        } else {
          this.scoreVisible = true;
          this.$refs.score.getData()
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
        teachId: this.nowCase.teachid,
      }).then((r) => {
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
      this.$refs.group.getData();
    },

    groupClose() {
      this.groupVisible = false;
    },

    // 查看作业
    showHomework(row) {
      this.homeworkVisible = true;
      this.$refs.homework.fetch();
    },
    homeworkClose() {
      this.homeworkVisible = false;
    },

    // 操作提示
    showTip(row) {
      if (row.instructions !== ""&&row.instructions!==null) {
        this.caseTipVisible = true;
        this.$refs.tip.setView(row.instructions);
      } else {
        this.$message.warning("暂无操作提示");
      }
    },
    TipClose() {
      this.caseTipVisible = false;
    },

    // 阶段详情
    showDetail(row) {
      this.detailVisible = true;
      this.sectionName = row.sectionname;
      this.$refs.detail.setView(row.sectinwork);
    },
    detailClose() {
      this.detailVisible = false;
    },

    // 参考资料
    getFile(row) {
      if (Number(row.status) === 0) {
        this.$message.warning("该章节未开始");
      } else {
        this.fileVisible = true;
        this.$refs.file.setFile(row.sectionId);
        this.icon = "iconfont icon-download nav-operation";
      }
    },
    fileClose() {
      this.fileVisible = false;
    },

    // 封面图片
    getUrl() {
      if (this.nowCase.caseid) {
        return (
          globalConfig.baseURL +
          "attach/findImg?caseId=" +
          this.nowCase.caseid +
          "&num=" +
          Math.random()
        );
      }
    },

    showWork(work) {
      if (work.length >= 30) {
        return work.substring(0, 30) + "...";
      } else {
        return work;
      }
    },
  },
  beforeDestroy() {
    clearInterval(timer);
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  .el-card {
    margin-bottom: 30px;
    font-size: 16px;
    font-weight: 500;
    line-height: 30px;
    .el-image {
      max-width: 300px;
      max-height: 200px;
    }
    .content {
      height: 100px;
      display: flex;
    }
    span {
      margin-right: 10px;
    }
    .type {
      margin-left: 20px;
    }
  }

  .icon-download {
    font-size: 1.4rem !important;
  }

  .el-table {
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -o-user-select: none;
    user-select: none;
  }
}
</style>
