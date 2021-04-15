<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-tijiao table-operation orange size"></i>
        <span>小组已提交作业</span>
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
          label="文件名称"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.filename }}</span>
          </template>
        </el-table-column>

        <el-table-column label="日期" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{
              scope.row.createtime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="作者" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="文件类型"
          :show-overflow-tooltip="true"
          align="center"
          width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.filetype }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operation')"
          align="center"
          width="120px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <a :href="download(row)">
              <i class="iconfont icon-xiazai1 table-operation" title="下载" />
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils";

export default {
  name: "CaseEdit",
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
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
      total: 0,

      job_id: null,
      group_id: null,
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
    nowCase(){
      return JSON.parse(window.localStorage.getItem("case"))
    }
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setId(val) {
      this.job_id = val;

      this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.$store.state.account.user.id,
        teachId: this.nowCase.teachid
      }).then(r => {
        const data = r.data.data;
        this.loading = false;

        if (data.length !== 0) {
          this.group_id = data[0].group_id;
          this.fetch();
        }
      });
    },
    fetch() {
      this.loading = true;
      this.$get("caseteach/teachjob/groupjob", {
        job_id: this.job_id,
        groupid: this.group_id,
        teachid: this.nowCase.teachid
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },

    close() {
      this.$emit("close");
    },

    // 下载文件
    download(row) {
      return (
        globalConfig.baseURL + "file/download?materialId=" + row.materialid
      );
    }
  }
};
</script>
<style lang="scss" scoped></style>
