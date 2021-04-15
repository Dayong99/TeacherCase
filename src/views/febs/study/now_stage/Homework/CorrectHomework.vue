<template>
  <el-dialog
    :width="width"  
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-edit table-operation orange"></i>
      <span>作业评分</span>
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
      <el-table-column label="成绩" align="center" width="120px">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.stu_score"
            size="small"
            @focus="getOld(scope.row.stu_score)"
            @blur="mark(scope.row.stu_score, scope.$index)"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
export default {
  name: "CaseEdit",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      buttonLoading: false,
      width: "900px",
      groupName: null,
      groupList: [],

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,

      userid:this.$store.state.account.user.id,

      oldVal: 0,
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
      },
    },
    nowCase(){
      return JSON.parse(window.localStorage.getItem("case"))
    }
  },
  mounted() {
  },
  methods: {
    setId() {
      this.fetch();
    },
    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.userid,
        teachId: this.nowCase.id,
      }).then((r) => {
        const data = r.data.data;
        this.loading = false;

        if (data.length !== 0) {
          this.groupName = data[0].group_name;
          this.$get("caseteach/teachjob/group_stu", {
            groupid: data[0].group_id,
            teachid:this.nowCase.id
          }).then((r) => {
            this.groupList = r.data.data;
          });
        }
      });
    },
    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      this.oldVal = 0;
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
    // 打分
    mark(val, index) {
      if (!this.isNumber(val)) {
        this.$message.warning("请输入有效的数字");
        this.$set(this.groupList[index], "stu_score", this.oldVal);
      } else if (val < 0 || val > 100) {
        this.$message.warning("请输入正确的分数");
        this.$set(this.groupList[index], "stu_score", this.oldVal);
      } else {
        this.$post("caseteach/teachjob/stu_code", {
          userid: this.groupList[index].userid,
          teachid: this.nowCase.id,
          score: val,
          adminid:this.userid
        }).then((r) => {
          if (r.data.code == 800) {
            this.$message.warning(r.data.message);
          } else {
            this.$message.success("打分成功");
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  margin-top: 20px;

  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
