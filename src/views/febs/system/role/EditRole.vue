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
        :model="oneRole"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="oneRole.roleName" size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="oneRole.remark" size="small" style="width:100%;"/>
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
  },
  data() {
    return {
      modal: false,
      oneRole: this.initRole(),
      buttonLoading: false,
      width: "500px",
      rules: {
        roleName: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
        ],
        caseType: {
          required: true,
          message: "请选择题材类型",
          trigger: "change",
        },
        caseSecrecy: {
          required: true,
          message: "案例密级不能为空",
          trigger: "blur",
        },
        caseAuthor: {
          required: true,
          message: "案例作者不能为空",
          trigger: "change",
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
    setRole(val) {
      // this.oneRole = { ...val };
      this.oneRole.roleName =val.roleName;
      this.oneRole.remark =val.remark;
      this.oneRole.roleId =val.roleId;
    },

    initRole() {
      return {
        roleName: "",
        remark: "",
        roleId: "",
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneRole = this.initRole();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
       
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.oneRole.roleId) {
            // create
            this.$post("caseteach/role", { ...this.oneRole }).then(() => {
              this.buttonLoading = false;
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
                type: "success",
              });
              this.$emit("success");
            });
          } else {
            // update
            this.$put("caseteach/role/update", { ...this.oneRole }).then(() => {
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
  &:first-child {
    width: 200px;
  }
}
</style>
