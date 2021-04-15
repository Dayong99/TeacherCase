<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-ai-module table-operation orange size"></i>
        <span>{{ title }}</span>
      </div>

      <div class="filter-container" style="text-align:right;">
        <i
          class="el-icon-circle-plus-outline nav-operation"
          title="新建子阶段"
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
        style="width: 100%;"
        max-height="500"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" align="center" width="40px" />
        <el-table-column
          label="子阶段名称"
          :show-overflow-tooltip="true"
          align="center"
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
          width="140px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i
              class="el-icon-info table-operation"
              @click="view(row)"
              title="任务详情"
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

    <!-- 新建子阶段 -->
    <add-child
      ref="child"
      :title="childTitle"
      :icon="childIcon"
      :dialog-visible="childVisible"
      @close="childClose"
      @success="editSuccess"
    />

    <!-- 参考资料 -->
    <file ref="file" :dialog-visible="fileTipVisible" @close="fileClose" />

    <!-- 操作提示 -->
    <tip
      ref="tip"
      :dialog-visible="tipVisible"
      @close="TipClose"
      @success="editSuccess"
    />

    <!-- 详情 -->
    <case-view
      ref="view"
      :dialog-visible="viewVisible"
      @close="viewClose"
      :detailTitle="detailTitle"
    />
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";

import AddChild from "../Edit/AddChild";
import File from "../Edit/Upload";
import Tip from "./OperationTip";
import caseView from "../../../caseCommon/task/Index";

export default {
  name: "CaseEdit",
  components: { Pagination, AddChild, Tip, File, caseView },
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
      idInfo: {},
      stageInfo: {},

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      selection: [],
      pagination: {
        size: 10,
        num: 1
      },

      // 新增子阶段
      childVisible: false,
      childTitle: "",
      childIcon: "",

      // 参考资料
      fileTipVisible: false,

      // 操作提示
      tipVisible: false,

      // 阶段详情
      viewVisible: false,
      detailTitle: ''
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
    }
  },
  mounted() {},
  methods: {
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
    setId(val) {
      this.stageInfo = val;
      this.list = this.stageInfo.teachGradations;
      this.idInfo = {
        parentId: this.stageInfo.id,
        parentName: this.stageInfo.gradationName
      };
    },

    close() {
      this.$emit("close");
    },

    // 新增子阶段
    add(row) {
      this.childVisible = true;
      this.$refs.child.setChildId(this.idInfo);
      this.childIcon = "el-icon-circle-plus-outline nav-operation";
      this.childTitle = "新增";
    },
    childClose() {
      this.childVisible = false;
    },
    editSuccess() {
      this.$emit("updateList");
    },
    edit(row) {
      this.childTitle = "修改";
      this.childIcon = "el-icon-s-tools table-operation purple";
      this.childVisible = true;
      this.$refs.child.setChild({
        item: row,
        idInfo: this.idInfo
      });
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
          this.loading = false;
          this.$emit("updateList");
        });
      });
    },

    // 参考资料
    getFile(row) {
      this.fileTipVisible = true;
      this.$refs.file.setId(row.id);
    },
    fileClose() {
      this.fileTipVisible = false;
    },

    // 查看详情
    viewClose() {
      this.viewVisible = false;
    },
    view(row) {
      this.viewVisible = true;
      this.$refs.view.setView(row.gradationWork);
      this.detailTitle = row.gradationName;
    },

    // 操作提示
    showTip(row) {
      this.tipVisible = true;
      this.$refs.tip.setTip(row);
    },
    TipClose() {
      this.tipVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
