<template>
  <div>
    <el-dialog
      :width="width"
      
      
      
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-xiugaimima nav-operation"></i>
        <span>修改密码</span>
      </div>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="原密码">
          <el-input
            v-model="formData.oldPassword"
            size="small"
            readonly="readonly"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="formData.newPassword" size="small" clearable/>
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
  },
  data() {
     var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value==this.formData.oldPassword) {
        callback(
          new Error("新密码不可与原密码相同")
        );
      } else{
        return callback()
      }
    };

    return {
      modal: false,
      formData: this.initForm(),
      buttonLoading: false,
      width: "500px",
      rules: {
        newPassword: {
          required: true,
          trigger: "blur",
          validator: validatePass
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
    setId(val) {
      // this.formData = { ...val };
      this.formData.userId = val.id;
      this.formData.oldPassword = val.original_pass;
    },

    initForm() {
      return {
        userId: "",
        oldPassword: "",
        newPassword: "",
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      this.formData = this.initForm();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$put("case/user/updatePassword", { 
            oldPassword: this.formData.oldPassword,
            password:this.formData.newPassword,
            id:this.formData.userId
           }).then(() => {
            this.buttonLoading = false;
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
            this.$emit("success");
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
.el-input {
  width: 200px;
}
</style>
