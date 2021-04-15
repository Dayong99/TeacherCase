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
      <el-form
        ref="form"
        :model="oneTeacher"
        :rules="rules"
        label-position="right"
        label-width="80px"
        class="case-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="oneTeacher.username" size="small" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="oneTeacher.name" size="small" />
        </el-form-item>
       
        <el-form-item label="性别" prop="ssex">
          <el-radio v-model="oneTeacher.ssex" label="0">男</el-radio>
          <el-radio v-model="oneTeacher.ssex" label="1">女</el-radio>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="oneTeacher.password" size="small" />
        </el-form-item> -->
        <el-form-item label="角色" prop="position">
          <el-input v-model="oneTeacher.position" size="small" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="专业" prop="professional">
          <el-input v-model="oneTeacher.professional" size="small" />
        </el-form-item>
        <el-form-item label="单位地址" prop="unit">
          <el-input v-model="oneTeacher.unit" size="small" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="oneTeacher.mobile" size="small" />
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="oneTeacher.email" size="small" />
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
  name: "EditTeacher",
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
    }
  },
  data() {
    return {
      modal: false,
      oneTeacher: this.initTeacher(),
      buttonLoading: false,
      width: "500px",
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        name: {
          required: true,
          message: "姓名不能为空",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "密码不能为空",
          trigger: "blur",
        },
        professional: {
          required: true,
          message: "专业不能为空",
          trigger: "blur",
        },
        unit: {
          required: true,
          message: "单位地址不能为空",
          trigger: "blur",
        },
        email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        mobile: { validator: (rule, value, callback) => {
          if (value !== '' && !validMobile(value)) {
            callback(this.$t('rules.mobile'))
          } else {
            callback()
          }
        }, trigger: 'blur' },
        // mobile: {
        //   required: true,
        //   message: "联系电话不能为空",
        //   trigger: "blur",
        // },
        // email: {
        //   required: true,
        //   message: "邮箱不能为空",
        //   trigger: "blur",
        // },
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
  },
  methods: {
    // 加载相关信息
    setTeacher(val) {
      this.oneTeacher = { ...val };
      this.oneTeacher.ssex = ''+val.ssex
    },

    initTeacher() {
      return {
        id: "",
        username: "",
        email: "",
        mobile: "",
        ssex: "2",
        name: "",
        unit: null,
        position: '老师',
        professional: null,
        password:''
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.oneTeacher = this.initTeacher();
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
       
      });
    },

    //最终提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
         // this.buttonLoading = true;
          if (!this.oneTeacher.id) {
            // create
            this.$post("case/user/addTeacher", { ...this.oneTeacher }).then(
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
            this.$put("case/user/putUser", { ...this.oneTeacher }).then(
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
.el-input {
  width: 200px;
}
</style>
