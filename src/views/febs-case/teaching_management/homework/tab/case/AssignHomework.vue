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
          <el-form-item label="案例名称" prop="caseid">
            <el-select
              v-model="homework.caseid"
              placeholder="请选择"
              size="small"
              clearable
              @change="getChapter(homework.caseid)"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in caseList"
                :key="index"
                :label="item.caseName"
                :value="item.caseId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="案例章节" prop="sectionid">
            <el-select
              v-model="homework.sectionid"
              placeholder="请选择"
              size="small"
              clearable
              @change="getChild(homework.sectionid)"
              @clear="resetChild"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in chapterList"
                :key="index"
                :label="item.sectionName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="案例子章节" prop="childSectionId">
            <el-select
              v-model="childSectionId"
              placeholder="请选择"
              size="small"
              clearable
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in childList"
                :key="index"
                :label="item.sectionName"
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      height: "300",
      homework: this.initHomework(),
      buttonLoading: false,
      width: "900px",
      rules: {
        caseid: {
          required: true,
          message: "请选择案例",
          trigger: "change"
        },
        sectionid: {
          required: true,
          message: "请选择章节",
          trigger: "change"
        }
      },

      caseList: [],
      chapterList: [],
      childList: [],
      childSectionId: ""
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
  mounted() {
    this.getCase();
  },
  methods: {
    // 查询案例，章节，子章节
    getCase(arr) {
      this.caseList = arr;
    },
    getChapter(id) {
      this.chapterList = [];
      this.childList = [];
      this.homework.sectionid = null;
      this.homework.childSectionId = null;
      if (id) {
        this.caseList.forEach((item, index) => {
          if (item.caseid === id) {
            this.homework.weight = item.weight;
          }
        });

        if (id) {
          this.$get("caseteach/case-section/getSection", { caseid: id }).then(
            r => {
              if (r.data.code == 20000) {
                this.chapterList = r.data.data;
              }
            }
          );
        }
      }
    },
    getChild(id) {
      this.childList = [];
      this.homework.childSectionId = null;
      if (id) {
        this.$get("caseteach/case-section/getChildSection", {
          sectionid: id
        }).then(r => {
          if (r.data.code == 20000) {
            this.childList = r.data.data;
          }
        });
      }
    },

    resetChild() {
      this.childList = [];
      this.childSectionId = null;
    },

    initHomework() {
      return {
        id: "",
        weight: "",
        caseid: "",
        sectionid: "",
        teachid: "",
        jobrequire: ""
      };
    },
    setEditValue(val) {
      this.homework.id = val.id;
      this.homework.weight = val.weight;
      this.homework.jobrequire = val.jobrequire;
      this.homework.caseid = val.caseid;

      if (this.homework.caseid) {
        this.getChapter(this.homework.caseid);
      }
      this.homework.sectionid = val.sectionid;

      // 存在子阶段
      if (val.fid) {
        this.getChild(val.fid);
        this.homework.sectionid = val.fid;
        this.childSectionId = val.sectionid;
      } else {
        this.getChild(val.sectionid);
        this.homework.sectionid = val.sectionid;
        this.childSectionId = "";
      }
    },
    setAddValue(val) {
      this.homework.teachid = this.teachingInfo.id;
      this.params = {
        fileSource: 3,
        parentId: null
      };
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.buttonLoading = true;
          if (!this.homework.id) {
            // create
            if (this.childSectionId) {
              this.homework.sectionid = this.childSectionId;
            }
            this.$get("caseteach/job/insert_job", {
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
            this.$get("caseteach/job/update_job", {
              jobid: this.homework.id,
              caseid: this.homework.caseid,
              childid: this.homework.childSectionId,
              require: this.homework.jobrequire
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
      this.chapterList = [];
      this.childList = [];
    }
  }
};
</script>
<style lang="scss" scoped></style>
