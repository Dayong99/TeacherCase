<template>
  <el-dialog
    :width="width"
    :modal-append-to-body="false"
    :append-to-body="true"
    :visible.sync="isVisible"
  >
    <div slot="title" class="dialog-title">
      <i class="iconfont icon-pigai table-operation orange"></i>
      <span>打分</span>
    </div>

    <el-form
      ref="form"
      :model="oneScore"
      :rules="rules"
      label-position="right"
      label-width="80px"
      class="case-form"
    >
      <el-form-item label="当前成绩">
        {{ nowScore }}
      </el-form-item>
      <el-form-item label="修改分数" prop="score">
        <el-input v-model.number="oneScore.score" size="small" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">{{
        $t("common.cancel")
      }}</el-button>
      <el-button type="primary" plain @click="submitForm">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "CaseEdit",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      readonly: true,
      oneScore: this.initScore(),
      buttonLoading: false,
      width: "700px",
      height: "120",
      rules: {
        score: [
          {
            required: true,
            message: "分数不能为空",
            trigger: "blur"
          },
          { type: "number", message: "分数必须为数字值" }
        ]
      },
      jobid: "",
      groupid: "",
      nowScore: ""
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
    // 加载相关信息
    setId(val) {
      this.nowScore = val.score;
      this.jobid = val.jobid;
      this.groupid = val.groupid;
      this.oneScore.score = Number(val.score);
    },
    initScore() {
      return {
        score: ""
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneScore = this.initScore();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },
    //最终提交
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // this.buttonLoading = true;
          // update
          this.$post("caseteach/teachjob/teach_score", {
            jobid: this.jobid,
            groupid: this.groupid,
            code: this.oneScore.score
          }).then(() => {
            this.buttonLoading = false;
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success"
            });
            this.$emit("success");
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 200px;
}
</style>
