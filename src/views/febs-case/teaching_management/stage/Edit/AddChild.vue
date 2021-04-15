<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i :class="icon"></i>
      <span>{{ title }}教学子阶段</span>
    </div>
    <el-form
      class="case-form"
      ref="form"
      :model="stage"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="子阶段名称" prop="gradationName">
            <el-input
              v-model="stage.gradationName"
              size="small"
              style="width:200px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属阶段">
            <el-input
              v-model="parentName"
              size="small"
              :readonly="!modal"
              style="width:200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="排序" prop="orderNum">
            <el-input
              v-model.number="stage.orderNum"
              size="small"
              style="width:200px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="任务" prop="gradationWork">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            rows="4"
            resize="none"
            style="width:100%;"
            v-model="stage.gradationWork"
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
  name: "AddChapter",
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
      value1: true,
      height: "300",
      stage: this.initStage(),
      buttonLoading: false,
      width: "900px",
      rules: {
        gradationName: [
          {
            required: true,
            message: "阶段名称不可为空",
            trigger: "blur"
          }
        ],
        instructions: [
          {
            required: true,
            message: "简介不可为空",
            trigger: "blur"
          }
        ],
        gradationWork: [
          {
            required: true,
            message: "任务不可为空",
            trigger: "blur"
          }
        ],
        orderNum: [
          { required: true, message: "排序不能为空" },
          { type: "number", message: "排序必须为数字值" }
        ]
      },
      parentName: "",
      options: [
        {
          value: 0,
          label: "未开始"
        },
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "已结束"
        }
      ]
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
    initStage() {
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
    setChild(val) {
      console.log(val);
      for (var key in this.stage) {
        this.stage[key] = val.item[key];
      }
      this.stage.gradationId = val.idInfo.parentId;
      this.parentName = val.idInfo.parentName;
    },
    setChildId(val) {
      console.log(val);
      this.stage.gradationId = val.parentId;
      this.parentName = val.parentName;
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.stage.teachId = this.teachingInfo.id;
          if (!this.stage.id) {
            // create
            this.$get("caseteach/teach-gradation/add", { ...this.stage }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.createSuccess"),
                  type: "success"
                });
                this.$emit("success");
              }
            );
          } else {
            // update
            this.$get("caseteach/teach-gradation/upd", { ...this.stage }).then(
              () => {
                this.buttonLoading = false;
                this.isVisible = false;
                this.$message({
                  message: this.$t("tips.updateSuccess"),
                  type: "success"
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
      this.stage = this.initStage();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
