<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.teachName"
        placeholder="教学任务"
        class="filter-item search-item"
        clearable
        @clear="search"
      />
      <el-select
        v-model="queryParams.classId"
        placeholder="专业期班"
        class="filter-item search-item"
        clearable
        @change="search"
        @clear="search"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :label="item.className"
          :value="item.id"
        />
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">{{
        $t("table.search")
      }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{
        $t("table.reset")
      }}</el-button>
      <i
        class="el-icon-circle-plus-outline nav-operation"
        title="新建教学任务"
        @click="add()"
      />
      <i
        class="el-icon-remove-outline nav-operation"
        title="批量删除"
        @click="batchDelete()"
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
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column
        label="教学任务"
        :show-overflow-tooltip="true"
        align="center"
        min-width="200px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.teachName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业期班" align="center" width="200px">
        <template slot-scope="scope">
          <span v-text="showClass(scope.row.classId)"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="案例名称"
        align="center"
        min-width="180px"
        class="table-text"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cases }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="330px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-s-tools table-operation purple"
            @click="detail(row)"
            title="修改教学任务"
          />
          <i
            class="iconfont icon-renshengjieduan table-operation orange"
            @click="stage(row)"
            title="教学阶段"
          />
          <i
            class="iconfont icon-kongzhi table-operation"
            @click="control(row)"
            title="进度控制"
          />
          <i
            class="iconfont icon-jiedianhuiyuanfenzu table-operation green"
            @click="group(row)"
            title="分组详情"
          />
          <i
            class="iconfont icon-wenjian table-operation yellow"
            @click="homework(row)"
            title="作业查询"
          />
          <i
            class="iconfont icon-chengji table-operation light_purple"
            @click="score(row)"
            title="成绩查询"
          />
          <i
            class="el-icon-delete table-operation mr0 red"
            @click="singleDelete(row)"
            title="删除"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
      class="pageBox"
    />

    <!-- 新建/修改教学任务 -->
    <case-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
    />

    <!-- 分组 -->
    <group ref="group" :dialog-visible="groupVisible" @close="groupClose" />

    <!-- 作业查询 -->
    <homework
      ref="homework"
      :dialog-visible="homeworkVisible"
      @close="homeworkClose"
    />

    <!-- 成绩查询 -->
    <score ref="score" :dialog-visible="scoreVisible" @close="scoreClose" />

    <!-- 进度控制 -->
    <control
      ref="control"
      :dialog-visible="controlVisible"
      @close="controlClose"
    />

    <!-- 任务详情 -->
    <detail
      ref="detail"
      :dialog-visible="detailVisible"
      @close="detailClose"
      @success="editSuccess"
      @resetList="search"
    />

    <!-- 教学阶段 -->
    <stage ref="stage" :dialog-visible="stageVisible" @close="stageClose" />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import CaseEdit from "./EditCase";
import Homework from "../homework/Index";
import Group from "../group/Index";
import Score from "../score/Index";
import Control from "../control/Index";
import Detail from "./Detail";
import Stage from "../stage/Index";

export default {
  name: "CASE",
  components: {
    Pagination,
    CaseEdit,
    Homework,
    Group,
    Score,
    Control,
    Detail,
    Stage,
  },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: "",
      },
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1,
      },
      icon: "",
      classList: [],
      processList: [],

      // 作业查询
      homeworkVisible: false,

      // 成绩查询
      scoreVisible: false,

      //分组查询
      groupVisible: false,

      // 进度控制
      controlVisible: false,

      // 任务详情
      detailVisible: false,

      // 教学阶段
      stageVisible: false,
    };
  },
  computed: {},
  filters: {},
  mounted() {
    this.getClass();
    this.getProcess();
    this.fetch();
  },
  methods: {
    // 班级
    getClass() {
      this.$get("case/user/showCalss").then((r) => {
        if (r.data.code == 20000) {
          this.classList = r.data.data;
        }
      });
    },
    showClass(val) {
      let name;
      this.classList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          name = item.className;
        }
      });
      return name;
    },

    // 执行进度
    getProcess() {
      this.$get("caseteach/pro-type-info").then((r) => {
        if (r.data.code == 20000) {
          this.processList = r.data.data;
        }
      });
    },
    showProcess(list) {
      let arr = [];
      list.forEach((item, index) => {
        this.processList.forEach((item1, index1) => {
          if (Number(item.status) === Number(item1.id)) {
            arr.push(item1.typeName);
          }
        });
      });
      if (arr.indexOf("未开始") !== -1) {
        return "未开始";
      } else if (arr.every(item === "已完成")) {
        return "已完成";
      } else {
        return "已开始";
      }
    },

    // 加载表格
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      this.loading = true;
      this.$get("caseteach/teach", { ...params }).then((r) => {
        this.loading = false;
        const data = r.data.data;
        this.total = data.total;
        this.list = data.rows;

        // 案例数据处理
        this.list.forEach((item, index) => {
          // item.teachCases = [];
          this.$set(item, "teachCases", []);

          let caseArr = item.cases.split(",");
          let idArr = item.caseIds.split(",");

          caseArr.forEach((item1, index1) => {
            let obj = {
              caseName: item1,
              caseId: idArr[index1],
            };
            item.teachCases.push(obj);
          });
        });
      });
    },
    search() {
      this.fetch({
        ...this.queryParams,
      });
    },

    // 进度控制
    controlClose() {
      this.controlVisible = false;
    },
    control(row) {
      this.$store.commit("teaching/setInfo", row);
      this.controlVisible = true;
      this.$refs.control.getStage();
    },

    // 新增/修改案例
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },
    add() {
      this.dialog.title = "新建教学任务";
      this.icon = "el-icon-circle-plus-outline nav-operation";
      this.dialog.isVisible = true;
    },
    edit(row) {
      this.$refs.edit.setData(row);
      this.dialog.title = "修改教学任务";
      this.icon = "el-icon-s-tools table-operation";
      this.dialog.isVisible = true;
    },

    // 删除单个案例
    singleDelete(row) {
      this.$refs.table.toggleRowSelection(row, true);
      this.batchDelete();
    },
    // 批量删除
    onSelectChange(selection) {
      this.selection = selection;
    },
    batchDelete() {
      if (!this.selection.length) {
        this.$message({
          message: this.$t("tips.noDataSelected"),
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          const teachIds = [];
          this.selection.forEach((u) => {
            teachIds.push(u.id);
          });
          this.delete(teachIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(teachIds) {
      this.loading = true;
      teachIds.forEach((e) => {
        this.$delete(`caseteach/teach-case/?ids=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
    },

    // 作业查询
    homework(row) {
      this.$store.commit("teaching/setInfo", row);
      this.homeworkVisible = true;
      this.$refs.homework.fetch()
    },
    homeworkClose() {
      this.homeworkVisible = false;
    },

    // 成绩查询...
    score(row) {
      console.log(111)
      this.$store.commit("teaching/setInfo", row);
      this.scoreVisible = true;
      this.$refs.score.getData()
    },
    scoreClose() {
      this.scoreVisible = false;
    },

    // 分组
    group(row) {
      this.$store.commit("teaching/setInfo", row);
      this.groupVisible = true;
      this.$refs.group.getData();
    },
    groupClose() {
      this.groupVisible = false;
    },

    // 任务详情
    detail(row) {
      this.$store.commit("teaching/setInfo", row);
      this.detailVisible = true;
      this.$refs.detail.setCase();
    },
    detailClose() {
      this.detailVisible = false;
    },

    // 教学阶段
    stage(row) {
      this.$store.commit("teaching/setInfo", row);
      this.stageVisible = true;
      this.$refs.stage.fetch();
    },
    stageClose() {
      this.stageVisible = false;
    },

    // 重置相关信息
    reset() {
      this.queryParams = {};
      this.$refs.table.clearFilter();
      this.search();
    },

    // 导出表格
    exportExcel() {
      this.$download(
        "system/user/excel",
        {
          pageSize: this.pagination.size,
          pageNum: this.pagination.num,
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-chengji,
.icon-wenjian {
  font-size: 1.3rem;
}
</style>
