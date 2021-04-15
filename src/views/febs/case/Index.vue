<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.caseName"
        placeholder="案例名称"
        clearable
        @clear="search"
        class="filter-item search-item"
      />
      <el-select
        v-model="queryParams.caseType"
        placeholder="题材类型"
        @change="search"
        class="filter-item search-item"
        clearable
        @clear="search"
      >
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="queryParams.caseAuthor"
        placeholder="案例作者"
        class="filter-item search-item"
        clearable
        @clear="search"
      />
      <el-button class="filter-item" type="primary" plain @click="search">{{
        $t("table.search")
      }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{
        $t("table.reset")
      }}</el-button>
      <i
        class="el-icon-circle-plus-outline nav-operation"
        title="新建案例"
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
        label="案例名称"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题材类型" width="150px" align="center">
        <template slot-scope="scope">
          <span v-text="showType(scope.row.caseType)"></span>
        </template>
      </el-table-column>
      <el-table-column label="案例作者" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.caseAuthor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密级" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{
            Number(scope.row.caseSecrecy) === 1 ? "公开" : "密级"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        prop="createTime"
        align="center"
        width="170px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案例封面" align="center" width="150px">
        <template slot-scope="{ row }">
          <el-image
            :src="getUrl(row)"
            :preview-src-list="preview(row)"
            class="table-img"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="200px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-info table-operation"
            @click="view(row)"
            title="案例详情"
          />
          <i
            class="iconfont icon-bofang table-operation orange"
            @click="play(row)"
            title="案例预览"
          />

          <i
            class="el-icon-s-tools table-operation purple"
            @click="edit(row)"
            title="修改案例"
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

    <!-- 新建/修改案例 -->
    <case-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
      :typeList="typeList"
    />
    <!-- 播放案例 -->
    <case-play
      ref="play"
      :dialog-visible="casePlayVisible"
      @close="playClose"
      :icon="icon"
    />
    <!-- 案例详情 -->
    <case-view
      ref="view"
      :dialog-visible="caseViewVisible"
      @close="viewClose"
      :icon="icon"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import caseEdit from "./Operation/EditCase";
import caseView from "../caseCommon/detail/Index";
import casePlay from "../caseCommon/play/Index";

export default {
  name: "CASE",
  components: { Pagination, caseEdit, caseView, casePlay },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ""
      },
      caseViewVisible: false,
      casePlayVisible: false,
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        size: 10,
        num: 1
      },
      icon: "",
      typeList: []
    };
  },
  computed: {},
  filters: {},
  mounted() {
    this.getType();
    this.fetch();
  },
  methods: {
    getType() {
      this.$get("caseteach/case-type-info").then(r => {
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

    // 加载表格
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      this.loading = true;
      this.$get("caseteach/case-library", {
        ...params
      }).then(r => {
        const data = r.data.data;
        this.total = data.total;
        this.list = data.rows;
        this.loading = false;
      });
    },
    search() {
      this.fetch({
        ...this.queryParams,
        ...this.sort
      });
    },

    // 播放案例
    playClose() {
      this.casePlayVisible = false;
    },
    play(row) {
      this.icon = "iconfont icon-bofang table-operation";
      this.casePlayVisible = true;
      this.$refs.play.setData(row);
    },

    // 查看详情
    viewClose() {
      this.caseViewVisible = false;
    },
    view(row) {
      // this.$refs.view.setView(row);
      this.icon = "el-icon-tickets table-operation";
      this.caseViewVisible = true;
      this.$refs.view.setView(row);
    },

    // 重置相关信息
    reset() {
      this.queryParams = {};
      this.sort = {};
      this.$refs.table.clearSort();
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
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },

    // 新增/修改案例
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },
    add() {
      this.dialog.title = "新增案例";
      this.icon = "el-icon-circle-plus-outline table-operation ";
      this.dialog.isVisible = true;
    },
    edit(row) {
      this.dialog.title = "修改案例";
      this.icon = "el-icon-s-tools table-operation purple";
      this.dialog.isVisible = true;
      let that = this;
      setTimeout(function() {
        that.$refs.edit.setCase(row);
      }, 10);
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
          const caseIds = [];
          this.selection.forEach(u => {
            caseIds.push(u.id);
          });
          this.delete(caseIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(caseIds) {
      this.loading = true;
      caseIds.forEach(e => {
        this.$delete(`caseteach/case-library/?ids=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
          this.search();
        });
      });
    },

    // 头像预览
    getUrl(row) {
      console.log(globalConfig.baseURL + "attach/findImg?caseId=" + row.id);
      return (
        globalConfig.baseURL +
        "attach/findImg?caseId=" +
        row.id +
        "&num=" +
        Math.random()
      );
    },
    preview(row) {
      let arr = [];
      arr.push(
        globalConfig.baseURL +
          "attach/findImg?caseId=" +
          row.id +
          "&num=" +
          Math.random()
      );

      return arr;
    }
  }
};
</script>
<style lang="scss" scoped></style>
