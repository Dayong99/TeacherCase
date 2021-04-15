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
        :model="oneClass"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="oneClass.className" size="small" />
        </el-form-item>
        <el-form-item label="年级" prop="edition">
          <el-date-picker
            v-model="oneClass.edition"
            type="year"
            size="small"
            placeholder="请选择"
            value-format="yyyy"
          ></el-date-picker>
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
      oneClass: this.initClass(),
      buttonLoading: false,
      width: "500px",
      rules: {
        className: [
          {
            required: true,
            message: "班级名称不能为空",
            trigger: "blur",
          },
        ],
        edition: {
          required: true,
          message: "请选择年级",
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
  watch: {
    "oneClass.edition"(val) {
      this.oneClass.edition = "" + val;
    },
  },
  mounted() {},
  methods: {
    // 加载相关信息
    setClass(val) {
      this.oneClass = { ...val };
    },

    initClass() {
      return {
        id: "",
        className: "",
        edition: "",
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneClass = this.initClass();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.oneClass.id) {
            // create
            this.$post("caseteach/class", { ...this.oneClass })
              .then((r) => {
                this.buttonLoading = false;
                if (r.data.code == 500) {
                  this.$message.warning(r.data.message);
                } else if (r.data.code == 20000) {
                  this.isVisible = false;
                  this.$message({
                    message: this.$t("tips.createSuccess"),
                    type: "success",
                  });
                  this.$emit("success");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            // update
            this.$put("caseteach/class", { ...this.oneClass }).then((r) => {
              this.buttonLoading = false;
              if (r.data.code == 500) {
                this.$message.warning(r.data.message);
              } else if (r.data.code == 20000) {
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.updateSuccess"),
                  type: "success",
                });
                this.$emit("success");
              }
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
