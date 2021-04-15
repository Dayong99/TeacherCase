<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-renshengjieduan table-operation orange size"></i>
        <span>教学阶段</span>
      </div>
      <div class="filter-container" style="text-align: right">
        <i
          class="el-icon-circle-plus-outline nav-operation"
          title="新增阶段"
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
        max-height="500"
      >
        <el-table-column type="selection" align="center" width="40px" />
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
          width="200px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i
              class="el-icon-info table-operation"
              @click="info(row)"
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
            <i
              class="el-icon-s-tools table-operation purple"
              title="修改"
              @click="edit(row)"
            />
            <i
              class="el-icon-delete table-operation red"
              title="删除"
              @click="singleDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新建章节/阶段 -->
    <add-stage
      ref="stage"
      :dialog-visible="stageVisible"
      @close="stageClose"
      @success="editSuccess"
      :title="stageTitle"
      :icon="stageIcon"
    />

    <!-- 参考资料 -->
    <file ref="file" :dialog-visible="fileVisible" @close="fileClose" />

    <!-- 新建子阶段 -->
    <child
      ref="child"
      :dialog-visible="childVisible"
      :title="childTitle"
      @close="childClose"
      @updateList="updateList"
    />

    <!-- 操作提示 -->
    <tip
      ref="tip"
      :dialog-visible="tipVisible"
      @close="TipClose"
      @success="editSuccess"
    />

    <!-- 详情 -->
    <info
      ref="info"
      :dialog-visible="infoVisible"
      @close="infoClose"
      :detailTitle="detailTitle"
    />
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";

import Tip from "./Edit/OperationTip";
import File from "./Edit/Upload";
import AddStage from "./Edit/AddStage";
import Child from "./Edit/Child";
import Info from "../../caseCommon/task/Index";

export default {
  name: "CaseEdit",
  components: {
    Pagination,
    Tip,
    AddStage,
    File,
    Child,
    Info
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
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
      selection: [],
      pagination: {
        num: 5,
        page: 1
      },
      nowStage: null,

      // 新增阶段
      stageVisible: false,
      stageTitle: "",
      stageIcon: "",

      // 新增子阶段
      childVisible: false,
      childTitle: "",

      // 操作提示
      tipVisible: false,

      // 章节详情
      infoVisible: false,
      detailTitle: '',

      // 参考资料
      fileVisible: false
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
    teachingInfo(){
      return this.$store.state.teaching.teachingInfo;
    }
  },
  mounted() {},
  methods: {
    // 查询所有阶段
    fetch(params = {}) {
      params.teachname = this.teachingInfo.teachName;
      this.loading = true;
      this.$get("caseteach/teach-gradation/list", {
        ...params
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },

    showStatus(val) {
      switch (val) {
        case 0:
          return "未开始";
        case 1:
          return "进行中";
        case 2:
          return "已结束";
      }
    },

    close() {
      this.$emit("close");
    },

    // 新增阶段
    editClose() {
      this.stageVisible = false;
    },
    editSuccess() {
      this.fetch();
    },
    add() {
      this.stageTitle = "新建";
      this.stageIcon = "el-icon-circle-plus-outline nav-operation";
      this.stageVisible = true;
    },
    edit(row) {
      this.stageTitle = "修改";
      this.stageIcon = "el-icon-s-tools table-operation purple";
      this.stageVisible = true;
      this.$refs.stage.setStage(row);
    },
    stageClose() {
      this.stageVisible = false;
    },

    // 新增子阶段
    addChild(row) {
      this.nowStage = row.id;
      this.childVisible = true;
      this.childTitle = row.gradationName + "—子阶段";
      this.$refs.child.setId(row);
    },
    childClose() {
      this.childVisible = false;
    },
    async updateList() {
      await this.$get("caseteach/teach-gradation/list", {
        teachname: this.teachingInfo.teachName
      })
        .then(r => {
          const data = r.data.data;
          this.list = data;
          this.loading = false;
        })
        .then(data => {
          this.list.forEach((item, index) => {
            if ((item.id == this.nowStage)) {
              this.addChild(item);
            }
          });
        })
        .catch(r => {
          this.$message.warning("获取数据失败");
        });
    },

    // 操作提示
    showTip(row) {
      this.tipVisible = true;
      this.$refs.tip.setTip(row);
    },
    TipClose() {
      this.tipVisible = false;
    },

    // 查看详情
    infoClose() {
      this.infoVisible = false;
    },
    info(row) {
      this.infoVisible = true;
      this.$refs.info.setView(row.gradationWork);
      this.detailTitle = row.gradationName;
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
          type: "warning"
        });
        return;
      }
      const contain = false;
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          const sectionIds = [];
          this.selection.forEach(u => {
            sectionIds.push(u.id);
          });
          this.delete(sectionIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(sectionIds) {
      this.loading = true;
      sectionIds.forEach(e => {
        this.$post(`caseteach/teach-gradation/del`, {
          id: e
        }).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
          this.fetch();
        });
      });
    },

    // 参考资料
    getFile(row) {
      this.fileVisible = true;
      this.$refs.file.setId(row.id);
    },
    fileClose() {
      this.fileVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
.icon-wenjian {
  font-size: 1.3rem;
}
</style>
