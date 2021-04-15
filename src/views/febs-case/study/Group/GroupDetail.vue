<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-jiedianhuiyuanfenzu table-operation green size"></i>
        <span>分组详情</span>
      </div>
      <h3>组名：{{ groupName }}</h3>
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="loading"
        :data="groupList"
        border
        fit
        style="width: 100%"
        max-height="500"
      >
        <el-table-column label="学生" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.student }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";

export default {
  name: "CaseEdit",
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      width: "900px",

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      memberList: [],
      groupName: null,
      groupList: [],
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
      },
    },
    nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    },
  },
  watch: {},
  mounted() {},
  methods: {
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.$store.state.account.user.id,
        teachId: this.nowCase.teachid,
      }).then((r) => {
        const data = r.data.data;
        this.loading = false;

        if (data.length !== 0) {
          this.groupName = data[0].group_name;
          this.$get("caseteach/teach-case/group_stu", {
            groupid: data[0].group_id,
            teachid: this.nowCase.teachid,
            caseid: this.nowCase.caseid,
          }).then((r) => {
            this.groupList = r.data.data;
          });
        }
      });
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.member-box {
  text-align: center;
  line-height: 30px;

  li {
    &:first-child {
      font-weight: bold;
      font-size: 14px;
    }
  }
}
h3 {
  margin-bottom: 10px;
}
</style>
