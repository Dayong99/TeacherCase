<template>
  <div>
    <el-dialog
      :width="width"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="isVisible"
    >
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
          label="名称"
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

        <el-table-column label="文件类型" align="center" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.filetype }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operation')"
          align="center"
          width="150px"
          class-name="small-padding fixed-width iconBox"
        >
          <template slot-scope="{ row }">
            <a :href="download(row)">
              <i class="iconfont icon-xiazai1 table-operation" title="下载" />
            </a>
            <i
              class="el-icon-delete table-operation red"
              title="删除"
              @click="singleDelete(row)"
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
      width: "900px",

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },

      jobid: null,
      groupid: null
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
    },
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setId(val) {
      this.jobid = val.jobid;
      this.groupid = val.groupid;
      this.fetch();
    },
    fetch(params = {}) {
      this.$get("caseteach/teachjob/groupjob", {
        job_id: this.jobid,
        groupid: this.groupid,
        teachid: this.teachingInfo.id
      }).then(r => {
        const data = r.data.data;
        this.list = data;
        this.loading = false;
      });
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.list = [];
    },
    // 下载文件
    download(row) {
      return (
        globalConfig.baseURL + "file/download?materialId=" + row.materialid
      );
    },

    singleDelete(row) {
      this.$delete("caseteach/teachjob/delSubmitjob", {
        submitJobid: row.id
      }).then(r => {
        this.$message.success("删除成功");
        this.fetch();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
