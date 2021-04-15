<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.username"
        placeholder="账号"
        class="filter-item search-item"
        clearable
        @clear="search"
      />
      <el-select
        v-model="queryParams.classId"
        placeholder="专业期班"
        clearable
        class="filter-item search-item"
        @change="search"
        @clear="fetch"
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
        class="iconfont icon-zhuce nav-operation orange"
        title="批量注册"
        @click="batch()"
      />
      <i
        class="el-icon-circle-plus-outline nav-operation"
        title="新建"
        @click="add()"
      />
      <i
        class="el-icon-remove-outline nav-operation"
        title="批量删除"
        @click="batchDelete()"
      />
      <a :href="downloadUrl()">
        <i class="iconfont icon-daoru nav-operation" title="导出表格" />
      </a>
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
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ssex | showSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.original_pass }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="期班"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-html="showClass(scope.row.class_id)"></span>
        </template>
      </el-table-column>
      <el-table-column label="学制" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作地址" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="120px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-s-tools table-operation purple"
            @click="edit(row)"
            title="修改信息"
          />
          <i
            class="iconfont icon-xiugaimima table-operation"
            @click="editPassword(row)"
            title="修改密码"
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
      :page.sync="pagination.pageNum"
      :limit.sync="pagination.pageSize"
      @pagination="fetch"
      class="pageBox"
    />

    <!-- 新建/修改 -->
    <student-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :icon="icon"
      @success="editSuccess"
      @close="editClose"
      :classList="classList"
    />

    <!-- 批量注册 -->
    <batch
      ref="batch"
      :dialog-visible="batchVisible"
      @success="editSuccess"
      @close="batchClose"
      :classList="classList"
    />

    <!-- 修改密码 -->
    <password
      ref="password"
      :dialog-visible="passwordVisible"
      @success="editSuccess"
      @close="passwordClose"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import studentEdit from "./EditStudent";
import batch from "./Batch";
import password from "./Password";

export default {
  name: "CASE",
  components: { Pagination, studentEdit, batch, password },
  data() {
    return {
      dialog: {
        isVisible: false,
        title: ""
      },
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      selection: [],
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      icon: "",
      classList: [],

      batchVisible: false,
      passwordVisible: false
    };
  },
  computed: {},
  filters: {
    showSex(val) {
      switch (Number(val)) {
        case 0:
          return "男";
        case 1:
          return "女";
        default:
          return "未知";
      }
    }
  },
  mounted() {
    this.getClass();
    this.fetch();
  },
  methods: {
    // 班级
    getClass() {
      this.$get("case/user/showCalss").then(r => {
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

    // 加载表格
    fetch(params = {}) {
      params.pageSize = this.pagination.pageSize;
      params.pageNum = this.pagination.pageNum;
      this.loading = true;
      this.$get("case/user/showStudent", {
        ...params
      }).then(r => {
        const data = r.data.data;
        this.total = data.total;
        this.list = data.records;
        this.loading = false;
      });
    },
    search() {
      if (!this.queryParams.classId) {
        delete this.queryParams.classId;
      }
      this.loading = true;
      this.$get("case/user/showStudent", {
        pageSize: 10,
        pageNum: 1,
        ...this.queryParams
      }).then(r => {
        const data = r.data.data;
        this.total = data.total;
        this.list = data.records;
        this.loading = false;
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
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum,
          ...this.queryParams
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
      this.getClass();
    },
    edit(row) {
      this.$refs.edit.setStudent(row);
      this.dialog.title = "修改";
      this.icon = "el-icon-s-tools table-operation purple";
      this.dialog.isVisible = true;
      this.getClass();
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
          const studentIds = [];
          this.selection.forEach(u => {
            studentIds.push(u.id);
          });
          this.delete(studentIds);
        })
        .catch(() => {
          this.clearSelections();
        });
    },
    clearSelections() {
      this.$refs.table.clearSelection();
    },
    delete(studentIds) {
      this.loading = true;
      studentIds.forEach(e => {
        this.$delete(`case/user/?jobId=${e}`).then(() => {
          this.$message({
            message: this.$t("tips.deleteSuccess"),
            type: "success"
          });
          this.search();
        });
      });
    },

    // 批量注册
    batchClose() {
      this.batchVisible = false;
    },
    batchSuccess() {
      this.search();
    },
    batch() {
      this.batchVisible = true;
      this.getClass();
    },
    // 修改密码
    editPassword(row) {
      this.passwordVisible = true;
      this.$refs.password.setId(row);
    },
    passwordClose() {
      this.passwordVisible = false;
    },

    downloadUrl() {
      if (this.queryParams.classId) {
        return (
          globalConfig.baseURL +
          "caseteach/Excel?classId=" +
          this.queryParams.classId
        );
      } else {
        return globalConfig.baseURL + "caseteach/Excel";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.icon-daoru {
  font-size: 20px;
}
.icon-zhuce,
.icon-xiugaimima {
  font-size: 1.3rem;
}
</style>
