<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-ai-module table-operation orange size"></i>
        <span>{{ title }}</span>
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
      >
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
          width="120px"
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
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 参考资料 -->
    <file ref="file" :dialog-visible="fileTipVisible" @close="fileClose" />

    <!-- 操作提示 -->
    <tip ref="tip" :dialog-visible="tipVisible" @close="TipClose" />

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

import File from "./Upload";
import Tip from "../../caseCommon/tip/Index";
import caseView from "../../caseCommon/task/Index";
export default {
  name: "CaseEdit",
  components: { Tip, File, caseView },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modal: false,
      buttonLoading: false,
      width: "900px",
      stageInfo: {},

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,

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
          return "已开始";
      }
    },
    setId(val) {
      this.stageInfo = val;
      this.list = this.stageInfo.teachGradations;
    },

    close() {
      this.$emit("close");
    },

    // 参考资料
    getFile(row) {
       if (Number(row.status) === 0) {
        this.$message.warning("该子阶段未开始");
      } else {
       this.fileTipVisible = true;
      this.$refs.file.setId(row.id);
      }
      
    },
    fileClose() {
      this.fileTipVisible = false;
    },

    // 查看详情
    viewClose() {
      this.viewVisible = false;
    },
    view(row) {
      // this.$refs.view.setView(row);
      this.viewVisible = true;
      this.$refs.view.setView(row.gradationWork);
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
