<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
         <i class="iconfont icon-wenjian table-operation yellow"></i>
        <span>作业查询</span>
      </div>
      <div class="filter-container" style="text-align: right">
        <i
          class="el-icon-circle-plus-outline nav-operation"
          title="布置作业"
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
                ? scope.row.fgradationname
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
            <el-input
              v-model="scope.row.weight"
              size="small"
              @focus="getOld(scope.row.weight)"
              @blur="judgeWeight(scope.row.weight, scope.$index)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="作业附件"
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
          width="150px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <i
              class="el-icon-info table-operation"
              title="作业详情"
              @click="showDetail(row)"
            />
            <i
              class="el-icon-edit table-operation orange"
              title="批改作业"
              @click="correct(row)"
            />
            <i
              class="el-icon-s-tools table-operation purple"
              title="修改作业"
              @click="edit(row)"
            />
            <i
              class="el-icon-delete table-operation red"
              title="删除作业"
              @click="singleDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="dialog-footer">
        <el-button type="warning" plain @click="close">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" plain @click="confirmWeight"
          >确定作业权重</el-button
        >
      </div>
    </el-dialog>
    <!-- 作业详情 -->
    <detail ref="detail" :dialog-visible="detailVisible" @close="detailClose" />

    <!-- 布置作业 -->
    <assign-homework
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
    />

    <!-- 批改作业 -->
    <correct-homework
      ref="correct"
      :dialog-visible="correctVisible"
      @close="correctClose"
    />

    <!-- 作业附件 -->
    <file ref="file" :dialog-visible="fileVisible" @close="fileClose" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import Detail from "./Detail";
import AssignHomework from "./AssignHomework";
import CorrectHomework from "./CorrectHomework";
import File from "./Upload";

export default {
  name: "CaseEdit",
  components: { Pagination, Detail, AssignHomework, CorrectHomework, File },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      width: "1200px",
      caseList: [],

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

      // 作业详情
      detailVisible: false,

      // 布置作业
      dialog: {
        isVisible: false,
        title: ""
      },
      icon: "",

      // 批改作业
      correctVisible: false,

      // 附件作业
      fileVisible: false,

      weightArr: [],

      oldVal: 0
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
    }
  },
  watch: {},
  mounted() {},
  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/teachjob/joblist", {
        teachid: this.teachingInfo.id
      }).then(r => {
        const data = r.data.data;
        // this.total = data.total;
        this.list = data;
        this.weightArr = new Array(data.length).fill("");
        this.loading = false;
      });
    },

    // 重置相关信息
    reset() {
      this.sort = {};
      this.$refs.table.clearSort();
      this.$refs.table.clearFilter();
      // this.search();
    },

    close() {
      this.$emit("close");
    },

    // 布置作业
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.fetch();
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "布置作业";
      this.icon = "el-icon-circle-plus-outline nav-operation";
      this.$refs.edit.getStageList();
    },
    edit(row) {
      this.$refs.edit.setEditValue(row);

      this.dialog.isVisible = true;
      this.dialog.title = "修改作业";
      this.icon = "el-icon-s-tools table-operation purple";
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
        this.$post("caseteach/teachjob/delJob", {
          jobid: e
        }).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
          this.fetch();
        });
      });
    },

    // 作业详情
    showDetail(row) {
      this.detailVisible = true;
      this.$refs.detail.setView(row);
    },
    detailClose() {
      this.detailVisible = false;
    },

    // 批改作业
    correct(row) {
      let arr = [];
      let total = 0;
      this.list.forEach((item, index) => {
        let obj = {
          Id: item.id,
          weight: item.weight
        };
        arr.push(obj);
        total += Number(item.weight);
      });
      if (total > 100) {
        this.$message.warning("作业权重之和已大于100，请重新设置");
      } else if (total !== 100) {
        this.$message.warning("作业权重之和应为100");
      } else {
        this.$jsonPost("caseteach/teachjob/upd_weight", {
          stu: arr
        }).then(() => {
          this.correctVisible = true;
          this.$refs.correct.setId(row.id);
        });
      }
    },
    correctClose() {
      this.correctVisible = false;
    },

    // 上传作业附件
    getFile(row) {
      this.$refs.file.setId(row.id);
      this.fileVisible = true;
    },
    fileClose() {
      this.fileVisible = false;
    },
    // 确认权重
    confirmWeight() {
      let arr = [];
      let total = 0;
      this.list.forEach((item, index) => {
        let obj = {
          Id: item.id,
          teachId: this.teachingInfo.id,
          caseId: item.caseid,
          sectionId: item.sectionid,
          childSectionId: item.childid,
          jobRequire: item.jobRequire,
          weight: item.weight
        };
        arr.push(obj);
        total += Number(item.weight);
      });
      if (total > 100) {
        this.$message.warning("作业权重之和已大于100，请重新设置");
      } else if (total !== 100) {
        this.$message.warning("作业权重之和应为100");
      } else {
        this.$jsonPost("caseteach/teachjob/upd_weight", {
          stu: arr
        }).then(() => {
          this.$message({
            message: "修改作业权重成功",
            type: "success"
          });
          this.$emit("success");
        });
      }
    },
    // 判断数字
    isNumber(value) {
      const patrn = /^(-)?\d+(\.\d+)?$/;
      if (patrn.exec(value) == null || value == "") {
        return false;
      } else {
        return true;
      }
    },
    // 获取原始值
    getOld(val) {
      this.oldVal = val;
    },
    // 判断权重
    judgeWeight(val, index) {
      if (val == null || val == "") {
        this.$message.warning("作业权重不可为空");
        this.$set(this.list[index], "weight", this.oldVal);
      } else if (!this.isNumber(val)) {
        this.$message.warning("请输入有效的数字");
        this.$set(this.list[index], "weight", this.oldVal);
      } else if (val < 0 || val > 100) {
        this.$message.warning("请输入正确的作业权重");
        this.$set(this.list[index], "weight", this.oldVal);
      }
    },
    closeHomework() {
      this.$emit("closeHomework");
    }
  }
};
</script>
<style lang="scss" scoped>
.el-icon-circle-plus-outline {
  line-height: 32px;
}
.el-input__inner {
  text-align: center !important;
}
.footer {
  float: right;
  margin-top: 10px;
}
</style>
