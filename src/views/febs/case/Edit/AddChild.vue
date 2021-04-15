<template>
  <el-dialog
    :width="width"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i :class="icon"></i>
      <span>{{title}}子章节</span>
    </div>
    <el-form class="case-form" ref="form" :model="section" :rules="rules" label-position="right" label-width="120px">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="子章节名称" prop="sectionName">
            <el-input v-model="section.sectionName" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属章节">
            <el-input v-model="parentName" size="small" :readonly="!modal" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="任务" prop="sectionWork">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            rows="4"
            resize="none"
            style="width:100%;"
            v-model="section.sectionWork"
            clearable
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        plain
        :loading="buttonLoading"
        @click="isVisible = false"
      >{{ $t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submitForm"
      >{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Tinymce from "@/components/Tinymce";

export default {
  name: "AddChapter",
  components: { Tinymce },
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
      value1: true,
      height: "300",
      section: this.initSection(),
      buttonLoading: false,
      width: "900px",
      rules: {
        sectionName: [
          {
            required: true,
            message: "子章节名称不可为空",
            trigger: "blur",
          },
        ],
        instructions: [
          {
            required: true,
            message: "简介不可为空",
            trigger: "blur",
          },
        ],
        sectionWork: [
          {
            required: true,
            message: "任务不可为空",
            trigger: "blur",
          },
        ],
      },
      parentName: "",
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
        sectionId:""
      };
    },
    setSection(val,name) {
      this.section = { ...val };
      this.section.isControl +=''
      this.parentName = name;
    },
    setSectionId(val) {
      this.section.sectionId = val.sectionId;
      this.section.caseId = val.caseId;
      this.parentName = val.sectionName;
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.section.id) {
            // create
            this.$get("caseteach/case-section/addChildSection", { 
              instruc:this.section.instructions,
              sctionname:this.section.sectionName,
              sctionwork:this.section.sectionWork,
              iscontrol:this.section.isControl,
              caseid:this.section.caseId,
              sectionid:this.section.sectionId
             }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success",
                });
                this.$emit("success");
              }
            );
          } else {
            // update
            this.$put("caseteach/case-section", { ...this.section }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.updateSuccess"),
                  type: "success",
                });
                this.$emit("success");
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.section = this.initSection();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
