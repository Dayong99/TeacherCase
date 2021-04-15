<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i class="el-icon-question table-operation green"></i>
      <span>操作提示</span>
    </div>
    <Tinymce ref="tipEditor" :height="height" v-model="tip.instructions" />
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
import Tinymce from "@/components/Tinymce";

export default {
  name: "OperationTip",
  components: { Tinymce },

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      width: "700px",
      height: "400",
      tip: this.initTip(),
      buttonLoading: false
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
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close");
    },
    initTip() {
      return {
        id: null,
        gradationId: null,
        gradationName: null,
        gradationWork: null,
        instructions: null,
        status: 0,
        teachId: null,
        orderNum: null
      };
    },
    // 加载相关信息
    setTip(val) {
       for(var key in this.tip){
        this.tip[key]=val[key]
      }
      if (window.tinymce) {
        if (this.tip.instructions) {
          this.$refs["tipEditor"].setContent(this.tip.instructions);
        }
      }
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.tip = this.initTip();
      this.$nextTick(() => {
        if (window.tinymce) {
          this.$refs["tipEditor"].setContent("");
        }
      });
    },

    //最终提交
    submitForm() {
      if (this.tip.instructions) {
        this.$get("caseteach/teach-gradation/upd", { ...this.tip }).then(
          () => {
            this.buttonLoading = false;
            this.isVisible = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$emit("success");
          }
        );
      } else {
        this.$message.warning("操作提示为空");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
