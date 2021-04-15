<template>
  <el-dialog :width="width" :visible.sync="isVisible">
    <div slot="title" class="dialog-title">
      <i class="el-icon-s-tools table-operation purple"></i>
      <span>修改教学任务</span>
    </div>
    <el-form
      ref="form"
      :model="oneTeach"
      :rules="rules"
      label-position="right"
      label-width="80px"
      class="case-form"
    >
      <el-form-item label="教学任务" prop="name">
        <el-input v-model="oneTeach.name" size="small" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="教学案例">
        <el-select v-model="caseId" placeholder="案例" size="small" clearable>
          <el-option
            v-for="item in allCase"
            :key="item.id"
            :label="item.caseName"
            :value="item.id"
          />
        </el-select>
        <i
          class="el-icon-circle-plus-outline nav-operation"
          title="新增案例"
          @click="addCase()"
        />
      </el-form-item>
    </el-form>

    <!--    分栏布局-->
    <!--    <ul >-->
    <!--      <li >-->
    <el-row class="detailBox" v-for="(item, index) in caseList" :key="index">
      <el-col :span="22">
        <div>
          <span>{{ item.caseName }}</span>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="li-right">
          <i class="el-icon-delete red fl" @click="deleteCase(item)"></i>
        </div>
      </el-col>
    </el-row>
    <!--      </li>-->
    <!--    </ul>-->
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">{{
          $t('common.cancel')
        }}
      </el-button>
      <el-button type="primary" plain @click="submitForm">{{
          $t('common.confirm')
        }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'Upload',
  components: { Pagination },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      modal: false,
      buttonLoading: false,
      width: '700px',
      caseList: [],
      idArr: [],
      oneTeach: this.initTeach(),
      caseId: '',
      caseName: '',
      allCase: [],
      rules: {
        name: [
          {
            required: true,
            message: '任务名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  filters: {},
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    },
    teachingInfo() {
      return this.$store.state.teaching.teachingInfo
    }
  },
  watch: {
    isVisible(val) {
      if (val) {
        this.getAllInfo()
      }
    }
  },
  mounted() {
  },
  methods: {
    // 获取所有案例
    getAllInfo() {
      this.common.getAllCase().then(r => {
        this.allCase = r
      })
    },
    reset() {
      this.caseList = []
      this.idArr = []
      this.caseId = ''
      this.caseName = ''
      this.$emit('resetList')
    },

    close() {
      this.$emit('close')
    },
    initTeach() {
      return {
        id: null,
        classid: '',
        name: '',
        sts: []
      }
    },
    setCase() {
      this.oneTeach.teachid = this.teachingInfo.id
      this.oneTeach.name = this.teachingInfo.teachName
      this.oneTeach.classid = this.teachingInfo.classId
      this.caseList = this.teachingInfo.teachCases
      this.caseList.forEach((item, index) => {
        item.weight = 0
      })
      this.teachingInfo.teachCases.forEach((item, index) => {
        this.idArr.push(item.caseId)
      })
    },

    // 是否显示删除按钮
    deleteShow(item) {
      if (this.idArr.indexOf(item.caseId) == -1) {
        // console.log("不存在");
        return false
      } else {
        // console.log("已存在");
        return true
      }
    },

    deleteCase(item) {
      if (this.caseList.length === 1) {
        this.$message.warning('教学任务不可为空')
      } else {
        const index = this.caseList.indexOf(item)
        this.$message({
          message: this.$t('tips.deleteSuccess'),
          type: 'success'
        })
        this.caseList.splice(index, 1)
      }
    },

    submitForm() {
      console.log(this.caseList)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.oneTeach.sts = this.caseList
          this.$jsonPost('caseteach/teach-case/update_teachcase', {
            sts: this.oneTeach
          }).then(() => {
            this.isVisible = false
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.$emit('success')
          })
        }
      })
    },

    // 新增案例
    addCase() {
      if (this.caseId == '') {
        this.$message.warning('未选择案例')
      } else {
        if (
          this.caseList.findIndex(target => target.caseId === this.caseId) == -1
        ) {
          this.allCase.forEach((item, index) => {
            if (item.id == this.caseId) {
              this.caseList.push({
                caseId: this.caseId,
                caseName: item.caseName,
                weight: 0
              })
            }
          })
        } else {
          this.$message.warning('该案例已存在')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.detailBox {
  font-size: 16px;
  margin-left: 15px;
  line-height: 38px;

  i {
    font-size: 1.2rem;
    cursor: pointer;
  }
}

//.li-right {
//  float: right;
//  padding-right: 22px;
//}

h3 {
  text-align: right;
}

.filter-container {
  display: flex;
  flex-direction: flex-start;

  i {
    margin-left: 10px;
    margin-top: 3px;
  }

  .el-button {
    position: absolute;
    right: 5px;
  }
}
</style>
