<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.caseName" placeholder="用户名" class="filter-item search-item" />
      <el-button class="filter-item" type="primary" plain @click="search">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{ $t('table.reset') }}</el-button>
      <i class="el-icon-s-grid nav-operation" title="导出" @click="exportExcel" />
      <i class="el-icon-remove-outline nav-operation" title="批量删除" @click="batchDelete()" />
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="40px" />

      <el-table-column label="用户名" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆系统" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseAuthor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseSecrecy }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.execute }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i class="el-icon-delete table-operation mr0 red" @click="singleDelete(row)" title="删除" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      @pagination="search"
      class="pageBox"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "CASE",
  components: { Pagination },
  data() {
    return {
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
    };
  },
  computed: {},
  filters: {},
  mounted() {
    this.fetch();
  },
  methods: {
    // 加载表格
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      if (this.queryParams.timeRange) {
        params.createTimeFrom = this.queryParams.timeRange[0];
        params.createTimeTo = this.queryParams.timeRange[1];
      }
      this.loading = true;
      this.$get("caseteach/case-library", {
        ...params,
      }).then((r) => {
        const data = r.data.data;
        this.total = data.total;
        this.list = data.rows;
        this.loading = false;
      });
    },
    search() {
      this.fetch({
        ...this.queryParams,
        ...this.sort,
      });
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
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
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
      const contain = false;
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          const caseIds = [];
          this.selection.forEach((u) => {
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
      caseIds.forEach((e) => {
        this.$delete(`caseteach/case-library/?ids=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
