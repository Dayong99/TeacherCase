<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
     <i class="el-icon-circle-plus-outline nav-operation"></i>
      <span>配置分组</span>
    </div>
    <el-form
      ref="form"
      :model="oneGroup"
      :rules="rules"
      label-position="right"
      label-width="80px"
      :inline="!modal"
      class="case-form"
    >
      <el-form-item label="专业期班" prop="classid">
        <el-input
          v-model="className"
          size="small"
          style="width: 200px"
          :readonly="!modal"
        />
      </el-form-item>
      <el-form-item label="组名" prop="groupName">
        <el-select v-model="oneGroup.groupName" clearable size="small">
          <el-option
            v-for="item in groupNameList"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="case-box">
      <div class="case-title">组员</div>
      <div>
        <el-transfer
          :titles="['未选成员', '已选成员']"
          v-model="keyData"
          :data="memberList"
          @change="handleChange"
        ></el-transfer>
      </div>
      <div class="weight-box" style="width:150px;">
        <div class="weight-title">角色</div>
        <ul class="weight-list">
          <li v-for="(item, index) in groupData" :key="index">
            <el-select v-model="item.roleId" placeholder="请选择" size="small">
              <el-option
                v-for="item in roleList"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id"
              />
            </el-select>
          </li>
        </ul>
      </div>
      <div class="weight-box">
        <div class="weight-title">备注</div>
        <ul class="weight-list">
          <li v-for="(item, index) in groupData" :key="index">
            <input v-model="item.remark" />
          </li>
        </ul>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        plain
        :loading="buttonLoading"
        @click="isVisible = false"
        >{{ $t("common.cancel") }}</el-button
      >
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submitForm"
        >{{ $t("common.confirm") }}</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { validMobile } from "@/utils/my-validate";

export default {
  name: "CaseEdit",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      oneGroup: this.initGroup(),
      buttonLoading: false,
      width: "1160px",
      height: "120",
      rules: {
        groupName: [
          {
            required: true,
            message: "组名不能为空",
            trigger: "blur"
          }
        ],
        classid: {
          required: true,
          message: "请选择专业期班",
          trigger: "change"
        }
      },
      classId: this.$store.state.account.user.classId,
      userid:this.$store.state.account.user.id,


      groupData: [],
      keyData: [],
      memberList: [],
      roleList: [],
      className: "",
      classList: [],

      groupNameList: this.$store.state.groupName.list
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
        nowCase() {
      return JSON.parse(window.localStorage.getItem("case"));
    },
  },
  mounted() {
    this.getClass();
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
      this.classList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          this.className = item.className;
        }
      });
    },

    // 获取角色Id
    getStuRole() {
      this.$get("caseteach/group-stu/backGroupId", {
        stuId: this.userid,
        teachId: this.oneGroup.teachId
      }).then(r => {
        const data = r.data.data;

        if (data.length === 0) {
          this.$message.warning("学生在该教学任务下未被分组");
        } else {
          data.forEach((item,index)=>{
            if(item.student_id== this.$store.state.account.user.id){
              this.oneGroup.roleId=item.role_id
            }
          })
        }
      });
    },

    // 查看未分组成员
    getStudent() {
      if (this.oneGroup.classid) {
        this.memberList = [];
        this.$get("caseteach/teach-case/group", {
          classid: this.oneGroup.classid,
          teachid: this.oneGroup.teachId
        }).then(r => {
          r.data.data.forEach((item, index) => {
            this.memberList.push({
              label: item.name,
              key: index,
              id: Number(item.id)
            });
          });
        });
      }
    },

    // 角色列表
    getRole() {
      this.$get("caseteach/group-stu/showRole").then(r => {
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

    getData(val) {
      this.oneGroup.classid = this.classId;
      this.oneGroup.teachId = this.nowCase.teachid;
      this.showClass(this.oneGroup.classid);
      this.getStuRole()
      this.getStudent();
      this.getRole();
    },

    initGroup() {
      return {
        id: "",
        teachId: "",
        classid: "",
        groupName: "",
        roleId: "",
        stus: []
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneGroup = this.initGroup();
      this.keyData = [];
      this.groupData = [];
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    // 选择学生时触发
    handleChange(value, direction, movedKeys) {
      if (direction == "right") {
        movedKeys.forEach((item, index) => {
          let obj = {
            studentId: this.memberList[item].id,
            roleId: null,
            remark: null
          };
          this.groupData.push(obj);
        });
      } else if (direction == "left") {
        let arr = [];
        movedKeys.forEach((item, index) => {
          arr.push(this.memberList[item].id);
        });
        if (this.keyData.length === 0) {
          this.groupData = [];
        } else {
          this.groupData.forEach((item, index) => {
            arr.forEach((item1, index1) => {
              if (item.caseId === item1) {
                this.groupData.splice(index, 1);
              }
            });
          });
        }
      }
    },
    //最终提交
    submitForm() {
      this.oneGroup.stus = this.groupData;
      let groupIndex = 0;
      let flag = true;
      this.groupData.forEach((item, index) => {
        if (item.roleId === 2) {
          groupIndex += 1;
        }
        if (!item.roleId) {
          flag = false;
        }
      });

      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.oneGroup.stus.length === 0) {
            this.$message.warning("未选择任何学生");
          } else if (groupIndex > 1) {
            this.$message.warning(this.getRoleName(2) + "只能选择一名");
          } else if (groupIndex === 0) {
            this.$message.warning("未选择" + this.getRoleName(2));
          } else if (!flag) {
            this.$message.warning("有成员未选择角色");
          } else {
            // this.buttonLoading = true;
            if (!this.oneGroup.id) {
              // create
              this.$jsonPost("caseteach/teach-case/star_group", {
                ...this.oneGroup
              }).then(r => {
                this.buttonLoading = false;
                if (r.data.code == 500) {
                  this.$message.warning("组名已存在");
                } else {
                  this.isVisible = false;
                  this.$message({
                    message: this.$t("tips.createSuccess"),
                    type: "success"
                  });
                  this.$emit("success");
                }
              });
            } 
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.weight-title {
  padding-left: 0;
}
</style>
