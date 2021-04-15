<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i class="el-icon-s-tools nav-operation purple"></i>
      <span>修改分组</span>
    </div>
    <div class="filter-container">
      <span class="el-form-item__label">未分组</span>
      <el-select v-model="studentId" placeholder="请选择" clearable>
        <el-option
          v-for="item in studentList"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
      <i
        class="el-icon-circle-plus-outline nav-operation"
        title="新增学生"
        @click="addStudent()"
      />
    </div>

    <el-form
      :ref="'form' + index"
      :rules="rules"
      label-position="right"
      label-width="60px"
      inline="inline"
      v-for="(item, index) in studentArr"
      :key="index"
      :model="item.obj"
      class="case-form"
    >
      <el-form-item label="学生">
        <el-input
          v-model="item.student"
          :readonly="'readonly'"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="item.obj.roleId" placeholder="请选择">
          <el-option
            v-for="item1 in roleList"
            :key="item1.role_id"
            :label="item1.role_name"
            :value="item1.role_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="item.obj.remark" />
      </el-form-item>
      <el-form-item>
        <i
          class="el-icon-delete table-operation red"
          @click="deleteStudent(item)"
        ></i>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="submitForm">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "UserEdit",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      student: this.initStu(),
      buttonLoading: false,
      width: "900px",
      roleList: [],
      rules: {
        roleId: [
          { required: true, message: "角色不能为空", trigger: "change" },
        ],
      },
      studentArr: [],
      memberList: [],

      groupId: null,
      classId: this.$store.state.account.user.classId,

      // 新增成员
      studentId: "",
      studentList: [],
      idArr: [],
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
      nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    },
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    // 获取所有学生
    getAllStudent() {
      if (this.classId) {
        this.studentList = [];
        this.$get("caseteach/teach-case/group", {
          classid: this.classId,
          teachid: this.nowCase.id,
        }).then((r) => {
          r.data.data.forEach((item, index) => {
            this.studentList.push({
              label: item.name,
              key: index,
              id: Number(item.id),
            });
          });
        });
      }
    },
    initStu() {
      return {
        id: "",
        groupId: "",
        teachId: "",
        remark: "",
      };
    },
    initRoles() {
      this.$get("caseteach/group-stu/showRole").then((r) => {
        this.roleList = r.data.data;
      });
    },
    getRoleId(str) {
      let id;
      this.roleList.forEach((item, index) => {
        if (item.role_name == str) {
          id = item.role_id;
        }
      });
      return id;
    },
    getRoleName(id) {
      let name;
      this.roleList.forEach((item, index) => {
        if (Number(item.role_id) == Number(id)) {
          name = item.role_name;
        }
      });
      return name;
    },
    setStudent(val) {
      this.groupId = val.id;
      this.memberList = val.member;
      this.memberList.forEach((item, index) => {
        this.$set(this.studentArr, index, {
          obj: {
            id: item.id,
            groupId: this.groupId,
            teachId: this.nowCase.id,
            studentId: item.userid,
            roleId: this.getRoleId(item.role),
            remark: item.remark,
          },

          student: item.student,
        });
      });
      this.getAllStudent();

      val.member.forEach((item, index) => {
        this.idArr.push(item.id);
      });
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      let params = [];
      let groupIndex = 0;
      let groupFlag = true;
      this.studentArr.forEach((item, index) => {
        params.push(item.obj);

        if (item.obj.roleId === 2) {
          groupIndex += 1;
        }
        if (!item.obj.roleId) {
          groupFlag = false;
        }
      });
      if (groupIndex > 1) {
        this.$message.warning(this.getRoleName(2) + "只能选择一名");
      } else if (groupIndex === 0) {
        this.$message.warning("未选择" + this.getRoleName(2));
      } else if (!groupFlag) {
        this.$message.warning("小组成员未选择角色");
      } else {
        this.$jsonPost("caseteach/teach-case/get_stu", {
          stu: JSON.stringify(params),
        }).then(() => {
          this.buttonLoading = false;
          this.isVisible = false;
          this.$message({
            message: "设置成功",
            type: "success",
          });
          this.$emit("success");
        });
      }
    },
    reset() {
      this.student = this.initStu();
      this.studentArr = [];
      this.idArr = [];
      this.studentId = "";
    },
    deleteStudent(item) {
      this.$confirm(this.$t("tips.confirmDelete"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          if (this.studentArr.length === 1) {
            this.$message.warning("小组成员不可为空");
          } else {
            if (this.idArr.indexOf(item.obj.id) == -1) {
              // console.log("不存在");
              const index = this.studentArr.indexOf(item);
              this.$message({
                message: this.$t("tips.deleteSuccess"),
                type: "success",
              });
              this.studentArr.splice(index, 1);
            } else {
              // console.log("已存在");
              this.$post("caseteach/teach-case/delstu", {
                stuid: item.obj.studentId,
                groupid: this.groupId,
                teachid: this.nowCase.id,
              }).then(() => {
                const stuIndex = this.studentArr.indexOf(item);
                this.studentArr.splice(stuIndex, 1);
                const idIndex = this.idArr.indexOf(item.obj.id);
                this.idArr.splice(idIndex, 1);
                this.$message({
                  message: this.$t("删除成功"),
                  type: "success",
                });
                this.$emit("success");
              });
            }
          }
        })
        .catch(() => {});
    },

    addStudent() {
      if (this.studentId == "") {
        this.$message.warning("未选择学生");
      } else {
        if (
          this.studentArr.findIndex(
            (target) => target.obj.id === this.studentId
          ) == -1
        ) {
          console.log("验证通过");
          this.studentList.forEach((item, index) => {
            if (item.id == this.studentId) {
              this.studentArr.push({
                obj: {
                  id: item.id,
                  groupId: this.groupId,
                  teachId: this.nowCase.id,
                  studentId: item.id,
                  roleId: "",
                  remark: "",
                },

                student: item.label,
              });
            }
          });
        } else {
          console.log("验证不通过");
          this.$message.warning("该学生已存在");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  flex-direction: flex-start;
  .el-select {
    width: 150px;
    margin-left: 5px;
  }
  i {
    margin-left: 10px;
    margin-top: 3px;
  }
  .el-button {
    position: absolute;
    right: 50px;
  }
}
</style>
