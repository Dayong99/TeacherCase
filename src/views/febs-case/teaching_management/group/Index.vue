<template>
  <div>
    <el-dialog :width="width" :visible.sync="isVisible">
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-jiedianhuiyuanfenzu table-operation green size"></i>
        <span>分组详情</span>
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <ul class="member-box">
              <li class="group-title">
                <el-row :span="24">
                  <el-col :span="8">成员</el-col>
                  <el-col :span="8">角色</el-col>
                  <el-col :span="8">备注</el-col>
                </el-row>
              </li>
              <li v-for="(item, index) in props.row.member" :key="index">
                <el-row :span="24">
                  <el-col :span="8">{{
                    item.student ? item.student : "无"
                  }}</el-col>
                  <el-col :span="8">{{ item.role }}</el-col>
                  <el-col :span="8" style="border: 1px solid #fff">{{
                    item.remark ? item.remark : "无"
                  }}</el-col>
                </el-row>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          label="组名"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.groupName }}</span>
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
      caseIds:null,

      // 表格
      tableKey: 0,
      loading: false,
      list: null,
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },
      memberList: [],
      roleList: [],

      // 分组配置
      addVisible: false,
      groupTitle: "",
      icon: "",

      // 修改成员信息
      editVisible: false
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
    teachingInfo(){
      return this.$store.state.teaching.teachingInfo;
    }
  },
  mounted() {},
  methods: {
    getData() {
      this.caseIds = this.teachingInfo.caseIds.split(",")[0];
      this.getStudent();
      this.getRole();
      this.fetch();
    },

    // 学生列表
    getStudent() {
      if (this.teachingInfo.classId) {
        this.$get("caseteach/group-stu/showStudent/" + this.teachingInfo.classId).then(
          r => {
            this.memberList = r.data.data.row;
          }
        );
      }
    },
    showStudent(val) {
      let student;
      this.memberList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          student = item.name;
        }
      });
      return student;
    },

    // 角色列表
    getRole() {
      this.$get("caseteach/group-stu/showRole").then(r => {
        this.roleList = r.data.data;
      });
    },
    showRole(val) {
      let role;
      this.roleList.forEach((item, index) => {
        if (Number(val) === Number(item.role_id)) {
          role = item.role_name;
        }
      });
      return role;
    },

    fetch(params = {}) {
      this.loading = true;
      this.$get("caseteach/teach-case/show_group", {
        classid: this.teachingInfo.classId,
        teachid: this.teachingInfo.id
      }).then(r => {
        const data = r.data.data;

        // this.total = data.total;
        this.list = data;
        this.list.forEach((item, index) => {
          this.$get("caseteach/teach-case/group_stu", {
            groupid: item.id,
            teachid: this.teachingInfo.id,
            caseid: this.caseIds
          }).then(r => {
            item.member = r.data.data;
          });
        });

        this.loading = false;
      });
    },

    close() {
      this.$emit("close");
    },

    // 分组配置
    editSuccess() {
      this.fetch();
    },
    add() {
      this.groupTitle = "配置分组";
      this.icon = "el-icon-circle-plus-outline nav-operation";
      this.addVisible = true;
      this.$refs.addGroup.setId(this.ids);
    },
    addClose() {
      this.addVisible = false;
    },

    // 删除分组
    deleteGroup(row) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          // this.$post(`caseteach/teach-case/delet_group`, {
          this.$delete(`caseteach/group-stu/deleteGroup`, {
            groupId: row.id,
            teachid: this.teachingInfo.id
            // this.$delete(`caseteach/group`, {
            //   groupId: row.id,
          }).then(() => {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
            });
            this.fetch();
          });
        })
        .catch(() => {});
    },

    // 删除单个学生
    singleDelete(item) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.$post(`caseteach/teach-case/del_stu`, {
            id: item.id
          }).then(() => {
            this.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
            });
            this.fetch();
          });
        })
        .catch(() => {});
    },

    // 修改学生信息
    getRoleId(str) {
      let id;
      this.roleList.forEach((item, index) => {
        if (item.roleName == str) {
          id = item.roleId;
        }
      });
      return id;
    },
    editStu(row) {
      this.editVisible = true;
      this.groupTitle = "修改分组";
      this.icon = "el-icon-s-tools nav-operation";
      this.$refs.editGroup.setStudent({ row: row, ids: this.ids });
    },
    editClose() {
      this.editVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
