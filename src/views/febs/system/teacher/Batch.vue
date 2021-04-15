<template>
  <div>
    <el-dialog
      :width="width"
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i class="iconfont icon-zhuce nav-operation orange"></i>
        <span>批量注册</span>
      </div>
      <el-form
        ref="form"
        :model="oneBatch"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="前缀" prop="nameStar">
          <el-input v-model="oneBatch.nameStar" size="small" />
        </el-form-item>
        <el-form-item label="密码" prop="passworld">
          <el-input v-model="oneBatch.passworld" size="small" />
        </el-form-item>

        <el-form-item label="个数" prop="num">
          <el-input-number
            v-model="oneBatch.num"
            :min="1"
            size="small"
          ></el-input-number>
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
    }
  },
  data() {
    return {
      modal: false,
      oneBatch: this.initBatch(),
      buttonLoading: false,
      width: "500px",
      rules: {
        nameStar: [
          {
            required: true,
            message: "前缀不能为空",
            trigger: "blur",
          },
        ],
        passworld: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ]
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
    setTeacher(val) {
      this.oneBatch = { ...val };
    },

    initBatch() {
      return {
        nameStar: "",
        num: "",
        passworld:""
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneBatch = this.initBatch();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // create
          this.$post("case/user/addThears", { ...this.oneBatch }).then(() => {
            this.buttonLoading = false;
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.createSuccess"),
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
