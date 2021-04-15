<template>
  <el-form
    ref="form"
    :model="oneTeacher"
    :rules="rules"
    label-position="right"
    label-width="80px"
    class="form case-form"
  >
    <el-form-item label="账号" prop="username">
      <el-input v-model="oneTeacher.username" size="small" readonly="readonly"/>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="oneTeacher.name" size="small" />
    </el-form-item>

    <el-form-item label="性别" prop="ssex">
      <el-radio v-model="oneTeacher.ssex" label="0">男</el-radio>
      <el-radio v-model="oneTeacher.ssex" label="1">女</el-radio>
    </el-form-item>
    <el-form-item label="角色" prop="position">
      <el-input
        v-model="oneTeacher.position"
        size="small"
        readonly="readonly"
      />
    </el-form-item>
    <el-form-item label="专业" prop="professional">
      <el-input v-model="oneTeacher.professional" size="small" />
    </el-form-item>
    <el-form-item label="单位地址" prop="unit">
      <el-input v-model="oneTeacher.unit" size="small" />
    </el-form-item>

    <el-form-item label="联系电话" prop="mobile">
      <el-input v-model="oneTeacher.mobile" size="small" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="oneTeacher.email" size="small" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ $t('common.edit') }}</el-button>
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
      user:{},
      oneTeacher: this.initTeacher(),
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
      },
    };
  },
  computed: {
  },
  mounted() {
    // this.initDept()
  },
  methods: {
    initTeacher() {
      this.user = this.$store.state.account.user
      return {
        id: this.user.id,
        username: this.user.username,
        email: this.user.email,
        mobile: this.user.mobile,
        ssex: this.user.ssex + "",
        name: this.user.name,
        unit: this.user.unit,
        position: "老师",
        professional: this.user.professional,
      };
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.$put("case/user/putUser", { ...this.oneTeacher }).then(() => {
            this.buttonLoading = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
            this.$store.commit("account/setUser", this.oneTeacher);
          });
        } else {
          return false;
        }
      });
    },
    onSelect(a, b) {
      this.deptName = a.label;
      this.change = true;
    },
    initDept() {
      this.$get("system/dept")
        .then((r) => {
          this.depts = r.data.data.rows;
        })
        .catch((error) => {
          this.$message({
            message: this.$t("tips.getDataFail"),
            type: "error",
          });
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
