<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i :class="icon"></i>
      <span>{{ title }}</span>
    </div>
    <el-form
      ref="form"
      :model="oneTeach"
      :rules="rules"
      label-position="right"
      label-width="80px"
      :inline="!modal"
      class="case-form"
    >
      <el-form-item label="教学任务" prop="name">
        <el-input v-model="oneTeach.name" size="small" style="width: 200px" />
      </el-form-item>
      <el-form-item label="专业期班" prop="classid">
        <el-select v-model="oneTeach.classid" placeholder="请选择" size="small">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="case-box">
      <div class="case-title">选修案例</div>
      <div>
        <el-transfer
          :titles="['未选案例', '已选案例']"
          :data="caseList"
          v-model="keyData"
          @change="handleChange"
          ref="case"
        ></el-transfer>
      </div>
      <div class="weight-box">
        <div class="weight-title">案例权重（{{ this.weightTotal }}%）</div>
        <ul class="weight-list" ref="weight">
          <li v-for="(item, index) in caseData" :key="index">
            <el-row :gutter="24">
              <el-col :span="19">
                <el-slider
                  v-model="item.weight"
                  @input="getTotalWeight"
                ></el-slider>
              </el-col>
              <el-col :span="5">
                <span>{{ item.weight }}</span>
                <span v-show="item.weight > 0">%</span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
    </div>

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
import { validMobile } from "@/utils/my-validate";

export default {
  name: "CaseEdit",
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
      oneTeach: this.initTeach(),
      width: "1010px",
      classId: this.$store.state.account.user.classId,
      userid: this.$store.state.account.user.id,
      rules: {
        name: [
          {
            required: true,
            message: "专业名称不能为空",
            trigger: "blur"
          }
        ],
        classid: {
          required: true,
          message: "请选择专业期班",
          trigger: "change"
        }
      },

      caseData: [],
      // 穿梭框数据
      keyData: [],
      classList: [],
      caseList: [],
      weightTotal: 0
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
  watch: {
    isVisible(val) {
      if (val) {
        this.getAllInfo();
      }
    }
  },
  mounted() {},
  methods: {
    getAllInfo() {
      this.common.getAllClass().then(r => {
        this.classList = r;
      });
      this.common.getAllCase().then(r => {
        r.forEach((item, index) => {
          this.caseList.push({
            label: item.caseName,
            key: index,
            id: item.id
          });
        });
      });
    },
    // 加载相关信息
    setData(val) {},

    initTeach() {
      return {
        id: null,
        classid: "",
        name: "",
        sts: []
      };
    },

    close() {
      this.$emit("close");
    },

    // 重置弹窗信息
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.weightTotal = 0;
      this.oneTeach = this.initTeach();
      this.keyData = [];
      this.caseData = [];
      this.caseList = [];
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
    },

    // 移动滑块时触发
    getTotalWeight() {
      this.weightTotal = 0;
      this.caseData.forEach((item, index) => {
        this.weightTotal += item.weight;
      });
    },

    // 移动案例时触发
    handleChange(value, direction, movedKeys) {
      if (direction == "right") {
        movedKeys.forEach((item, index) => {
          let obj = {
            caseId: this.caseList[item].id,
            weight: null,
            remark: null,
            teachId: null
          };
          this.caseData.push(obj);
        });
        this.getTotalWeight();
      } else if (direction == "left") {
        let arr = [];
        movedKeys.forEach((item, index) => {
          arr.push(this.caseList[item].id);
        });
        if (this.keyData.length === 0) {
          this.caseData = [];
        } else {
          this.caseData.forEach((item, index) => {
            arr.forEach((item1, index1) => {
              if (item.caseId == item1) {
                this.caseData.splice(index, 1);
              }
            });
          });
        }
        this.getTotalWeight();
      }
    },

    //最终提交
    submitForm() {
      this.oneTeach.sts = this.caseData;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.oneTeach.sts.length === 0) {
            this.$message.warning("未选择任何案例");
          } else if (this.weightTotal > 100) {
            this.$message.warning("案例权重之和已超过100%");
          } else if (this.weightTotal !== 100) {
            this.$message.warning("案例权重之和需为100%");
          } else {
            this.oneTeach.id = this.teachingInfo.id;
            this.oneTeach.name = this.teachingInfo.teachName;
            this.oneTeach.classid = this.classId;
            let params = {
              id: this.oneTeach.id,
              classid: this.oneTeach.classid,
              name: this.oneTeach.name,
              sts: this.oneTeach.sts,
              userid: this.userid
            };
            // create
            this.$jsonPost("caseteach/teach-case/insert", {
              sts: params
            }).then(() => {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
                type: "success"
              });
              this.$emit("success");
            });
          }
        } else {
          this.$message.warning("未确认教学名称和专业期班");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
