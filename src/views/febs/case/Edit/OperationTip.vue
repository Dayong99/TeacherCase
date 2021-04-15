<template>
  <el-dialog
    :width="width"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-question table-operation green"></i>
      <span>操作提示</span>
    </div>
    <Tinymce ref="tipEditor" :height="height" v-model="section.instructions" />
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
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      width: "700px",
      height: "400",
      section: this.initSection(),
      buttonLoading: false,
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
  mounted() {
  
  },
  methods: {
    close() {
      this.$emit("close");
    },
    initSection() {
      return {
        caseId: "",
        id: "",
        instructions: "",
        isControl: "1",
        isDelete: 0,
        sectionId: null,
        sectionName: "",
        sectionStatus: 0,
        sectionWork: "",
      };
    },
    // 加载相关信息
    setSection(val) {
      this.section = { ...val };
      if (window.tinymce) {
        if (this.section.instructions) {
          this.$refs["tipEditor"].setContent(this.section.instructions);
        }
      }
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.section = this.initSection();
      this.$nextTick(() => {
        if (window.tinymce) {
          this.$refs["tipEditor"].setContent("");
        }
      });
    },

    //最终提交
    submitForm() {
      if (this.section.instructions) {
        this.$put("caseteach/case-section", { ...this.section }).then(() => {
          this.buttonLoading = false;
          this.isVisible = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.$emit("success");
        });
      } else {
        this.$message.warning("操作提示为空");
      }
    },
  },
};
</script>

