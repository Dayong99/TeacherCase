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
        :model="oneType"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="类型名称" prop="roleName">
          <el-input v-model="oneType.typeName" size="small" />
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
      oneType: this.initType(),
      buttonLoading: false,
      width: "700px",
      height: "120",
      rules: {
        typeName: [
          {
            required: true,
            message: "类型名称不能为空",
            trigger: "blur",
          },
        ],
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
      this.oneType = { ...val };
    },

    initType() {
      return {
        id: "",
        typeName: ""
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneType = this.initType();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();

      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.oneType.id) {
            // create
            this.$post("caseteach/case-type-info/add", { ...this.oneType }).then(() => {
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
            this.$put("caseteach/case-type-info", { ...this.oneType }).then(() => {
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
