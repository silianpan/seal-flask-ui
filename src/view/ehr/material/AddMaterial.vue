<template>
  <Card>
    <h1>{{h2}}</h1>
    <ButtonGroup>
      <i-button @click.native='goBack'>
        <Icon type="ios-arrow-back" />返回</i-button>
      <i-button type='primary' :loading='buttonLoading' @click.native='save'>
        <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
      <i-button type='info' @click.native='isShowDescription = !isShowDescription'>
        <Icon custom="iconfont icon-shuoming" size=12 />说明</i-button>
    </ButtonGroup>
    <LegaForm ref="materialForm" :labelWidth="caseFormContent.labelWidth" :formItemData="caseFormContent.formItemData" :formRules="caseFormContent.formRules" @single-dosage-click="modalFlag = !modalFlag"></LegaForm>
  </Card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MaterialService } from '@/api/ehr/material'
import {
  backMixin
} from '@/mixin/back-mixin'
export default {
  mixins: [ backMixin ],
  name: 'addMaterial',
  props: {
    materialflag: String,
    materialId: String
  },
  data() {
    const saleAndCost = (rule, value, callback) => {
      value = this._.isNil(value) ? 0 : parseFloat(value)
      value = isNaN(value) ? 0 : value
      if (rule.field === 'materialSale') {
        this.$refs.materialForm.setFormFieldData('materialSale', value)
      } else {
        this.$refs.materialForm.setFormFieldData('materialCost', value)
      }
      callback()
    }
    const discountCheck = (rule, value, callback) => {
      if (value === '') {
        this.$refs.materialForm.setFormFieldData('discount', undefined)
        callback()
      } else {
        value = parseFloat(value)
        if (!this._.isNaN(value) && value >= 0 && value <= 1) {
          callback()
        } else {
          callback(new Error('请填写0-1之间的数字'))
        }
      }
    }
    const checkTime = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/
      if (this._.isNil(value)) {
        callback()
      }
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请填写正整数'))
      }
    }
    return {
      targetRoute: { name: 'materialInfo' },
      isShowDescription: false,
      buttonLoading: false,
      caseFormContent: {
        formRules: {
          materialName: [{ required: true, message: '不能为空', trigger: 'blur' }],
          materialFactory: [{ required: true, message: '不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '必选', trigger: 'change' }],
          materialSale: [{ validator: saleAndCost, trigger: 'blur' }],
          materialCost: [{ validator: saleAndCost, trigger: 'blur' }],
          discount: [{ required: true, validator: discountCheck, trigger: 'change' }],
          warnTime: [{ validator: checkTime, trigger: 'blur' }],
          warnQuantity: [{ validator: checkTime, trigger: 'blur' }]
        },
        labelWidth: 150,
        formItemData: [
          {
            name: '物资基本信息'
          },
          [
            {
              type: 'input',
              label: '物资名称',
              prop: 'materialName',
              tip: '物资名称'
            },
            {
              type: 'input',
              label: '英文名称',
              prop: 'enName',
              tip: '英文名称'
            },
            {
              type: 'input',
              label: '规格',
              prop: 'materialSpec',
              tip: '规格'
            }
          ],
          [
            {
              type: 'select',
              label: '单位(物资的最小单位)',
              prop: 'materialUnit',
              tip: '请选择',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugPackUnit')
              }
            },
            {
              type: 'input',
              label: '零售价',
              prop: 'materialSale',
              tip: '零售价',
              button: true,
              buttonName: '元',
              buttonClick: 'wu'
            },
            {
              type: 'input',
              label: '成本价',
              prop: 'materialCost',
              tip: '成本价',
              button: true,
              buttonName: '元',
              buttonClick: 'wu'
            }
          ],
          [
            {
              type: 'input',
              label: '拼音码',
              prop: 'materialNameSpell',
              tip: '拼音码'
            },
            {
              type: 'input',
              label: '生产厂商',
              prop: 'materialFactory',
              tip: '生产厂商'
            },
            {
              type: 'input',
              label: '折扣',
              prop: 'discount'
            }
          ],
          [
            {
              type: 'input',
              label: '备注',
              prop: 'info',
              tip: '备注'
            },
            {
              type: 'input',
              label: '国际编码',
              prop: 'materialCode',
              tip: '国际编码'
            },
            {
              type: 'radioGroup',
              label: '物资状态',
              prop: 'status',
              options: [
                {
                  id: '1',
                  name: '启用'
                },
                {
                  id: '0',
                  name: '停用'
                }
              ]
            }
          ],
          [
            {
              type: 'input',
              label: '物资有效预警时间',
              prop: 'warnTime',
              tip: '物资有效预警时间',
              button: true,
              buttonName: '天',
              buttonClick: 'wu'
            },
            {
              type: 'input',
              label: '物资库存预警数量',
              prop: 'warnQuantity',
              tip: '物资库存预警数量'
            }
          ]
        ]
      }
    }
  },
  methods: {
    ...mapActions(['closeTagNav']),
    test() {
      console.log(this.$refs.materialForm.getFormDatas())
    },
    // 修改模式进入是初始化界面
    initEdit() {
      MaterialService.findById(this.materialId).then(res => {
        let editData = res.data
        this.$refs.materialForm.setFormDatas(editData)
      })
    },
    save() {
      this.$refs.materialForm.validate({
        success: params => {
          this.buttonLoading = true
          // 若是修改，设置要修改得id
          if (!this._.isNil(this.materialId)) {
            params.id = this.materialId
          }
          MaterialService.save(params).then(res => {
            if (res.ok()) {
              this.buttonLoading = false
              this.$Message.success('保存成功')
              this.goBack()
            }
          })
        },
        fail: () => {
          this.buttonLoading = false
          this.$Message.warning('请填写完整')
        }
      })
    },
    ok() {},
    cancel() {}
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    h2() {
      return this._.isNil(this.materialId) ? '新增物资' : '修改物资'
    }
  },
  mounted() {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    // 代表是编辑
    if (!this._.isNil(this.materialId)) {
      this.initEdit()
    }
  }
}
</script>

<style>
</style>
