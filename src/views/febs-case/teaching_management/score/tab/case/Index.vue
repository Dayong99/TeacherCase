<template>
  <div v-show="tabShow">
    <div style="text-align: right;margin-bottom:10px;">
      <el-input
        v-model="queryParams.username"
        placeholder="学员名称"
        class="filter-item search-item"
        clearable
        @clear="search"
        style="width:200px;"
      />

      <el-select
        v-model="queryParams.groupname"
        clearable
        @change="search"
        placeholder="小组"
      >
        <el-option
          v-for="item in groupNameList"
          :key="item.label"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">{{
        $t("table.search")
      }}</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">{{
        $t("table.reset")
      }}</el-button>

      <a :href="downloadUrl()">
        <el-button type="primary" icon="el-icon-upload2">导出</el-button>
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
      max-height="500"
    >
      <el-table-column
        label="姓名"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.sexx | showSex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center">
        <template>
          <span>{{ teachingInfo.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总成绩" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.zscor }}</span>
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
            title="详情"
            @click="showDetail(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.num"
      :limit.sync="pagination.size"
      class="pageBox"
    />
    <h3>平均成绩:{{ this.average }}</h3>

    <!--成绩详情 -->
    <detail ref="detail" :dialog-visible="detailVisible" @close="detailClose" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import Detail from "./Detail";

export default {
  name: "CaseEdit",
  components: { Pagination, Detail },
  props: ["tabShow"],

  data() {
    return {
      modal: false,
      buttonLoading: false,
      width: "900px",

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      pagination: {
        size: 10,
        num: 1
      },
      roleList: [],

      //成绩详情
      detailVisible: false,

      average: 0,
      groupNameList: this.$store.state.groupName.list
    };
  },
  computed: {
     teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    }
  },
  filters: {
    showSex(val) {
      switch (val) {
        case "0":
          return "男";
        case "1":
          return "女";
        case "2":
          return "";
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 加载相关信息
    getData() {
      this.queryParams = {};
      this.fetch();
    },
    // 查询该教学该班级下所有学生的总成绩
    fetch(params = {}) {
      params.teachid = this.teachingInfo.id;
      params.classid = this.teachingInfo.classId;
      this.loading = true;
      this.$get("caseteach/job/getAllStu", { ...params }).then(r => {
        const data = r.data.data;
        this.list = data.data;
        this.average = data.ava;
        this.loading = false;
      });
    },
    search() {
      this.fetch({
        ...this.queryParams
      });
    },
    // 重置相关信息
    reset() {
      this.queryParams = {};
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

    // 成绩详情
    showDetail(row) {
      this.$get("caseteach/job/getStuscore", {
        teachId: this.teachingInfo.id,
        studentId: row.userid
      }).then(r => {
        if (r.data.code == 800) {
          this.$message.warning("学生在该教学任务下未被分组");
        } else {
          this.detailVisible = true;
          this.$refs.detail.setId(row);
        }
      });
    },
    detailClose() {
      this.detailVisible = false;
    },

    close() {
      this.$emit("close");
    },

    downloadUrl() {
      return (
        globalConfig.baseURL +
        "caseteach/job/downExcel?teachid=" +
        this.teachingInfo.id +
        "&classid=" +
        this.teachingInfo.classId
      );
    }
  }
};
</script>
<style lang="scss" scoped>
h3 {
  text-align: right;
  margin-top: 10px;
}

button i {
  color: white !important;
}
</style>
