<template>
  <el-form
    ref="form"
    :model="p"
    :rules="rules"
    label-position="right"
    label-width="80px"
    class="form case-form"
  >
    <el-form-item :label="$t('table.user.oldPassword')" prop="oldPassword">
      <el-input v-model="p.oldPassword" type="password" />
    </el-form-item>
    <el-form-item :label="$t('table.user.newPassword')" prop="newPassword">
      <el-input v-model="p.newPassword" type="password" />
    </el-form-item>
    <el-form-item
      :label="$t('table.user.confirmPassword')"
      prop="confirmPassword"
    >
      <el-input v-model="p.confirmPassword" type="password" />
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
export default {
  data() {
    return {
      buttonLoading: false,
      p: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (this.p.newPassword !== value) {
                callback(this.$t("tips.notEqual"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.$put("case/user/updatePassword", {
            password: this.p.newPassword,
            oldPassword: this.p.oldPassword,
            id: this.$store.state.account.user.id,
          }).then((r) => {
            this.buttonLoading = false;
            if (r.data.code == 501) {
              this.$message.error(r.data.message);
            }else if (r.data.code == 502) {
              this.$message.warning(r.data.message);
            } else if (r.data.code == 20000) {
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
            }

            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
</style>
