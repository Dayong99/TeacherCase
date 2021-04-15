<template>
  <el-dialog
    :width="width"
    :modal-append-to-body="false"
    :append-to-body="true"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i :class="icon"></i>
      <span>{{ title }}</span>
    </div>
    <el-form
      ref="form"
      :model="homework"
      :rules="rules"
      label-position="right"
      label-width="100px"
      class="case-form"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="作业名称" prop="jobname">
            <el-input
              v-model="homework.jobname"
              placeholder="请输入内容"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="教学阶段" prop="gradationid">
            <el-select
              v-model="homework.gradationid"
              placeholder="请选择"
              size="small"
              clearable
              @change="getChild(homework.gradationid)"
              @clear="resetStage"
            >
              <el-option
                v-for="(item, index) in stageList"
                :key="index"
                :label="item.gradationName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教学子阶段" prop="childSectionId">
            <el-select
              v-model="childSectionId"
              placeholder="请选择"
              size="small"
              clearable
              @clear="resetChild"
            >
              <el-option
                v-for="(item, index) in childList"
                :key="index"
                :label="item.gradationName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作业要求" prop="jobrequire">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            rows="7"
            resize="none"
            style="width: 100%"
            v-model="homework.jobrequire"
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
export default {
  name: "AssignHomework",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modal: false,
      homework: this.initHomework(),
      buttonLoading: false,
      width: "900px",
      rules: {
        gradationid: {
          required: true,
          message: "请选择教学阶段",
          trigger: "change"
        },
        jobname: {
          required: true,
          message: "作业名称不可为空",
          trigger: blur
        },
        jobrequire: {
          required: true,
          message: "作业要求不可为空",
          trigger: blur
        },
      },

      stageList: [],
      childList: [],
      childSectionId: "",
      stageId: null
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
    },
    teachingInfo() {
      return this.$store.state.teaching.teachingInfo;
    }
  },
  mounted() {},
  methods: {
    getStageList() {
      this.stageList = [];
      this.childList = [];
      this.homework.gradationid = null;
      this.homework.teachid = this.teachingInfo.id;
      this.childSectionId = null;
      this.$get("caseteach/teach-gradation/list", {
        teachname: this.teachingInfo.teachName
      }).then(r => {
        this.stageList = r.data.data;
      });
    },
    getChild(id) {
      this.childList = [];
      this.childSectionId = null;
      this.stageList.forEach((item, index) => {
        if (item.id == id) {
          this.stageId = id;
          this.childList = item.teachGradations;
        }
      });
    },

    resetStage() {
      this.childList = [];
      this.childSectionId = null;
      this.stageId = null;
    },
    resetChild() {
      this.childList = [];
      this.childSectionId = null;
      if (this.stageId) {
        this.homework.gradationid = this.stageId;
        this.getChild(this.stageId);
      }
    },

    initHomework() {
      return {
        id: null,
        gradationid: null,
        jobname: null,
        jobrequire: null,
        teachStuWeight: 0,
        teachid: null,
        weight: 0
      };
    },
    setEditValue(val) {
      this.$get("caseteach/teach-gradation/list", {
        teachname: this.teachingInfo.teachName
      }).then(r => {
        this.stageList = r.data.data;
        this.homework.teachid = val.teachId;
        this.homework.id = val.id;
        this.homework.weight = val.weight;
        this.homework.jobrequire = val.jobRequire;
        this.homework.jobname = val.jobName;
        this.homework.teachStuWeight = Number(val.teachStuWeight);
        // 存在子阶段
        if (val.fgradationid) {
          this.getChild(val.fgradationid);
          this.homework.gradationid = val.fgradationid;
          this.childSectionId = val.gradationId;
        } else {
          this.getChild(val.gradationId);
          this.homework.gradationid = val.gradationId;
          this.childSectionId = "";
        }
      });
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.buttonLoading = true;
          if (this.childSectionId) {
            this.homework.gradationid = this.childSectionId;
          }
          if (!this.homework.id) {
            // create

            console.log(this.homework);

            this.$post("caseteach/teachjob/insert_job", {
              ...this.homework
            }).then(() => {
              this.buttonLoading = false;
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
                type: "success"
              });
              this.$emit("success");
            });
          } else {
            // update
            this.$post("caseteach/teachjob/updJob", {
              gradationId: this.homework.gradationid,
              id: this.homework.id,
              jobName: this.homework.jobname,
              jobRequire: this.homework.jobrequire,
              teachId: this.homework.teachid,
              teachStuWeight: this.homework.teachStuWeight,
              weight: 0
            }).then(() => {
              this.buttonLoading = false;
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success"
              });
              this.$emit("success");
            });
          }
        } else {
          return false;
        }
      });
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
      this.homework = this.initHomework();
      this.childSectionId = "";
      this.stageList = [];
      this.childList = [];
    }
  }
};
</script>
<style lang="scss" scoped></style>
