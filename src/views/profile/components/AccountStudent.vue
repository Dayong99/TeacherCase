<template>
  <el-form
    ref="form"
    :model="oneStudent"
    :rules="rules"
    label-position="right"
    label-width="80px"
    class="form case-form"
    
  >
    <el-form-item label="账号" prop="username">
      <el-input
        v-model="oneStudent.username"
        size="small"
        readonly="readonly"
      />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="oneStudent.name" size="small" />
    </el-form-item>

    <el-form-item label="性别" prop="ssex">
      <el-radio v-model="oneStudent.ssex" label="0">男</el-radio>
      <el-radio v-model="oneStudent.ssex" label="1">女</el-radio>
    </el-form-item>
    <el-form-item label="角色" prop="position">
      <el-input
        v-model="oneStudent.position"
        size="small"
        readonly="readonly"
      />
    </el-form-item>
    <el-form-item label="期班" prop="classId">
      <el-select
        v-model="oneStudent.classId"
        placeholder="专业期班"
        clearable
        size="small"
        :disabled="disabled"
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
      <el-input
        v-model="oneStudent.duration"
        size="small"
      />
    </el-form-item>
    <el-form-item label="工作地址" prop="unit">
      <el-input v-model="oneStudent.unit" size="small" />
    </el-form-item>

    <el-form-item label="联系电话" prop="mobile">
      <el-input v-model="oneStudent.mobile" size="small" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="oneStudent.email" size="small" />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submit"
        >{{ $t("common.edit") }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { validMobile } from "@/utils/my-validate";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  props: {
    // user: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       name: "",
    //       email: "",
    //     };
    //   },
    // },
  },
  data() {
    return {
      disabled: true,
      classList: [],
      user: {},
      oneStudent: this.initStudent(),
      buttonLoading: false,
      change: false,
      rules: {
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
        sex: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "change",
        },
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
      },
    };
  },
  computed: {},
  mounted() {
    this.getClass();
  },
  methods: {
    // 班级
    getClass() {
      this.$get("case/user/showCalss").then((r) => {
        if (r.data.code == 20000) {
          this.classList = r.data.data;
        }
      });
    },
    initStudent() {
      this.user = this.$store.state.account.user;
      return {
        id: this.user.id,
        username: this.user.username,
        email: this.user.email,
        mobile: this.user.mobile,
        ssex: this.user.ssex + "",
        name: this.user.name,
        duration: this.user.duration,
        position: "学生",
        classId: this.user.classId,
        unit:this.user.unit
      };
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.$put("case/user/putUser", { ...this.oneStudent }).then(() => {
            this.buttonLoading = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
            this.$store.commit("account/setUser", this.oneStudent);
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form {
  padding: 10px 0 0 0;
}
</style>
