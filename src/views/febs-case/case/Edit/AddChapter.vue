<template>
  <div>
    <el-dialog
      :width="width"      
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i :class="icon"></i>
        <span>{{title}}章节</span>
      </div>

      <el-form
        ref="form"
        :model="section"
        :rules="rules"
        label-position="right"
        label-width="120px"
        class="case-form"
      >
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="章节名称" prop="sectionName">
              <el-input v-model="section.sectionName" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="任务" prop="sectionWork">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="section.sectionWork"
              rows="4"
              resize="none"
              style="width:100%;"
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
  </div>
</template>
<script>
import { validMobile } from "@/utils/my-validate";
import Pagination from "@/components/Pagination";
import Tinymce from "@/components/Tinymce";

export default {
  name: "CaseEdit",
  components: { Pagination, Tinymce },
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
      section: this.initSection(),
      buttonLoading: false,
      width: "900px",
      height: "300",
      rules: {
        sectionName: [
          {
            required: true,
            message: "章节名称不可为空",
            trigger: "blur",
          },
        ],
        instructions:[
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
      };
    },
    // 加载相关信息
    setSection(val) {
      this.section = { ...val };
      this.section.isControl += "";
     
    },

    setId(val) {
      this.section.caseId = val;
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.section = this.initSection();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.section.id) {
            this.$get(
              "caseteach/case-section/addSection",{
                instruc:this.section.instructions,
                sctionname:this.section.sectionName,
                sctionwork:this.section.sectionWork,
                iscontrol:this.section.isControl,
                caseid:this.section.caseId
              }
            ).then(() => {
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
  },
};
</script>
