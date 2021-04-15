<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.roleName" placeholder="角色名" class="filter-item search-item" clearable @clear="search"/>

      <el-button class="filter-item" type="primary" plain @click="search">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{ $t('table.reset') }}</el-button>
      <!-- <i class="el-icon-s-grid nav-operation" title="导出" @click="exportExcel" /> -->
      <i class="el-icon-circle-plus-outline nav-operation" title="新建" @click="add()" />
      <i class="el-icon-remove-outline nav-operation" title="批量删除" @click="batchDelete()" />
      <!-- <i class="iconfont icon-daoru nav-operation" title="导入文件" @click="importFile()" /> -->
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
       <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
    
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <i class="el-icon-s-tools table-operation" @click="edit(row)" title="修改" />
          <i class="el-icon-delete table-operation mr0" @click="singleDelete(row)" title="删除" v-show="row.roleId!==2"/>
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

    <!-- 新建/修改 -->
    <role-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import roleEdit from "./EditRole";

export default {
  name: "CASE",
  components: { Pagination, roleEdit },
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
      this.loading = true;
      this.$get("caseteach/role", {
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

    // 新增/修改
    editClose() {
      this.dialog.isVisible = false;
    },
    editSuccess() {
      this.search();
    },
    add() {
      this.dialog.title = "新增";
      this.icon = "el-icon-circle-plus-outline nav-operation";
      this.dialog.isVisible = true;
    },
    edit(row) {
      this.$refs.edit.setRole(row);
      this.dialog.title = "修改";
      this.icon = "el-icon-s-tools table-operation";
      this.dialog.isVisible = true;
    },

    // 删除单个数据项
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
          const roleIds = [];
          this.selection.forEach((u) => {
            roleIds.push(u.roleId);
          });
          this.delete(roleIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(roleIds) {
      this.loading = true;
      roleIds.forEach((e) => {
        this.$delete(`caseteach/role/?jobId=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success",
          });
          this.search();
        });
      });
    },

    // 导入文件
    importFile() {},
  },
};
</script>
<style lang="scss" scoped>
.icon-daoru {
  font-size: 20px;
}
</style>
