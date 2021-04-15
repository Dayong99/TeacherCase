<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.teachname"
        placeholder="任务名称"
        clearable
        @clear="search"
        class="filter-item search-item"
      />
      <el-select
        v-model="queryParams.casetype"
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
      <el-select
        v-model="queryParams.stuts"
        placeholder="执行进度"
        @change="search"
        class="filter-item search-item"
        clearable
        @clear="search"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">{{
        $t("table.search")
      }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{
        $t("table.reset")
      }}</el-button>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      :data="list"
      border
      fit
      style="width: 100%"
    >
      <el-table-column
        label="教学任务"
        :show-overflow-tooltip="true"
        align="center"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.teachname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="案例名称"
        :show-overflow-tooltip="true"
        align="center"
        min-width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.casename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="题材类型" align="center" width="150px">
        <template slot-scope="scope">
          <span v-text="showType(scope.row.casetype)"></span>
        </template>
      </el-table-column>

      <el-table-column label="执行进度" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.stuts) === 0 ? "未开始" : "已开始" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        prop="createTime"
        align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.createtime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <i
            class="iconfont icon-renshengjieduan table-operation orange"
            @click="showStage(row)"
            title="教学阶段"
          />
          <i
            class="iconfont icon-yanshibofang table-operation mr0"
            @click="playCase(row)"
            title="案例演示"
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

import { parseTime } from "@/utils";
let timer = "";
export default {
  name: "CASE",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {
        teachname: "",
        execute: "",
        casetype: "",
        stuts: ""
      },
      pagination: {
        size: 10,
        num: 1
      },
      typeList: [],
      statusOptions: [
        {
          label: "未开始",
          value: 0
        },
        {
          label: "已开始",
          value: 1
        }
      ],
    };
  },
  computed: {},
  filters: {
  },
  watch: {
    $route(to, from) {
      if (to.path == "/study/case") {
        this.getData();
      } else {
        clearInterval(timer);
      }
    }
  },
  mounted() {
    this.getData();
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

    // 实时刷新数据
    getData() {
      this.getType();
      this.fetch();
      let that = this;
      timer = setInterval(function() {
        that.fetch();
      }, 5000);
    },

    // 加载表格
    fetch(params = {}) {
      params.pageNum = this.pagination.num;
      params.pageSize = this.pagination.size;
      this.loading = true;
      this.$get("caseteach/teach-section/showCaseInfo", {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        studentId: this.$store.state.account.user.id,
        teachname: this.queryParams.teachname,
        stuts: this.queryParams.stuts + "",
        casetype: this.queryParams.casetype
      }).then(r => {
        const data = r.data.data;
        this.total = data.num;
        this.list = data.date;
        this.loading = false;
      });
    },
    search() {
      this.fetch({
        ...this.queryParams
      });
    },

    // 播放案例
    playCase(row) {
      this.$store.commit("case/setCase", row);
      window.localStorage.setItem("case", JSON.stringify(row));
      this.$router.push({
        path: "/study/now_case"
      });
    },

    // 教学阶段
    showStage(row) {
      this.$store.commit("case/setCase", row);
      window.localStorage.setItem("case", JSON.stringify(row));
      this.$router.push({
        path: "/study/now_stage"
      });
    },

    // 重置相关信息
    reset() {
      this.queryParams = {
        teachname: "",
        execute: "",
        casetype: "",
        stuts: ""
      };
      this.$refs.table.clearFilter();
      this.search();
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  }
};
</script>
<style lang="scss" scoped>
.icon-yanshibofang {
  font-size: 1.4rem;
}

</style>
