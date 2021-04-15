<template>
  <div>
    <el-dialog
      :width="width"
      
      
      
      :visible.sync="isVisible"
    >
      <div slot="title" class="dialog-title">
        <i :class="icon"></i>
        <span>{{title}}</span>
      </div>
      <el-form class="case-form" ref="form" :model="oneData" :rules="rules" label-position="right" label-width="80px">
        <el-form-item label="字典类型" prop="caseType">
          <el-select v-model="oneData.caseType" placeholder="请选择" size="small">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据项" prop="caseName" >
          <el-input v-model="oneData.caseName" size="small" style="width:200px;"/>
        </el-form-item>
        
        <el-form-item label="说明" prop="caseType">
          <el-input type="textarea" placeholder="请输入内容" rows="7" resize="none" style="width:100%;"></el-input>
        </el-form-item>
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
export default {
  name: "CaseEdit",
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
    typeList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      modal: false,
      oneData: this.initData(),
      buttonLoading: false,
      width: "700px",
      height: "120",
      rules: {
        caseName: [
          {
            required: true,
            message: "案例名称不能为空",
            trigger: "blur",
          },
        ],
        caseType: {
          required: true,
          message: "请选择题材类型",
          trigger: "change",
        },
        caseSecrecy: {
          required: true,
          message: "案例密级不能为空",
          trigger: "blur",
        },
        caseAuthor: {
          required: true,
          message: "案例作者不能为空",
          trigger: "change",
        },
      },
      processList: [],
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
    this.getProcessType();
  },
  methods: {
    // 加载相关信息
    setData(val) {
      this.oneData = { ...val };
    },
  
    getProcessType() {
      this.$get("caseteach/pro-type-info").then((r) => {
        if (r.data.code == 20000) {
          this.processList = r.data.data;
        }
      });
    },
    showProcess(val) {
      let process;
      this.processList.forEach((item, index) => {
        if (Number(val) === Number(item.id)) {
          process = item.typeName;
        }
      });
      return process;
    },
    initData() {
      return {
        id: "",
        caseName: "",
        caseType: "",
        caseSecrecy: "",
        caseAuthor: "",
        caseIntroduce: "",
        casePhoto: "",
        execute: null,
        isDelete: null,
        ratio: null,
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneData = this.initData();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();

      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
         // this.buttonLoading = true;
          if (!this.oneCase.id) {
            // create
            this.$post("caseteach/case-library", { ...this.oneCase }).then(
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
            this.$put("caseteach/case-library", { ...this.oneCase }).then(
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
<style lang="scss" scoped>
</style>
