<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i :class="icon"></i>
        <span>{{ title }}</span>
      </div>
      <el-form
        ref="form"
        :model="oneStudent"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="oneStudent.username" size="small" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="oneStudent.name" size="small" />
        </el-form-item>

        <el-form-item label="性别" prop="ssex">
          <el-radio v-model="oneStudent.ssex" label="0">男</el-radio>
          <el-radio v-model="oneStudent.ssex" label="1">女</el-radio>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="oneStudent.password" size="small" />
        </el-form-item> -->
        <!-- <el-form-item label="角色" prop="position">
          <el-input
            v-model="oneStudent.position"
            size="small"
            readonly="readonly"
          />
        </el-form-item> -->
        <el-form-item label="期班" prop="classId">
          <el-select
            v-model="oneStudent.classId"
            placeholder="专业期班"
            clearable
            size="small"
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学制" prop="duration">
          <el-input v-model="oneStudent.duration" size="small" />
        </el-form-item>
        <el-form-item label="工作地址">
          <el-input v-model="oneStudent.unit" size="small" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="oneStudent.mobile" size="small" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="oneStudent.email" size="small" />
        </el-form-item>
      </el-form>
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
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
export default {
  name: "EditTeacher",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    classList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      modal: false,
      oneStudent: this.initStudent(),
      buttonLoading: false,
      width: "500px",
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        name: {
          required: true,
          message: "姓名不能为空",
          trigger: "blur",
        },
        classId: {
          required: true,
          message: "班级不能为空",
          trigger: "change",
        },
        duration: {
          required: true,
          message: "学制不能为空",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "密码不能为空",
          trigger: "blur",
        },
        // mobile: {
        //   required: true,
        //   message: "联系电话不能为空",
        //   trigger: "blur",
        // },
        // email: {
        //   required: true,
        //   message: "邮箱不能为空",
        //   trigger: "blur",
        // },
        email: {
          type: "email",
          message: this.$t("rules.email"),
          trigger: "blur",
        },
        mobile: {
          validator: (rule, value, callback) => {
            if (value !== "" && !validMobile(value)) {
              callback(this.$t("rules.mobile"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      },
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
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setStudent(val) {
      // this.oneStudent = { ...val };
      // this.oneStudent.ssex += "";
      this.oneStudent.id = val.id;
      this.oneStudent.username = val.username;
      this.oneStudent.email = val.email;
      this.oneStudent.mobile = val.mobile;
      this.oneStudent.ssex = val.ssex+'';
      this.oneStudent.name = val.name;
      this.oneStudent.duration = val.duration;
      this.oneStudent.position = val.position;
      this.oneStudent.classId = val.class_id;
      this.oneStudent.password = val.password;
      this.oneStudent.unit = val.unit;
    },

    initStudent() {
      return {
        id: "",
        username: "",
        email: "",
        mobile: "",
        ssex: "2",
        name: "",
        duration: null,
        position: "学生",
        classId: null,
        password: "",
        unit: "",
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneStudent = this.initStudent();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.oneStudent.id) {
            // create
            this.$post("case/user/addStudent", { ...this.oneStudent }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
              }
            );
          } else {
            // update
            this.$put("case/user/putUser", { ...this.oneStudent }).then(() => {
              this.buttonLoading = false;
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
              this.$emit("success");
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 200px;
}
</style>
