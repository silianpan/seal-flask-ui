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
    <LegaForm ref="drugForm" :labelWidth="caseFormContent.labelWidth" :formItemData="caseFormContent.formItemData" :formRules="caseFormContent.formRules" @single-dosage-click="modalFlag = !modalFlag"></LegaForm>
    <!-- <Button type="primary" @click="test">测试</Button> -->
    <Modal v-model="modalFlag" title="单次剂量单位" :footer-hide="true">
      <p>默认单位：{{singleDosageUnit}}</p>
      <CheckboxGroup v-model="singleUnit">
        <Checkbox v-for="(item, index) in checkBoxData" :key="index" :label="item.value"><span>{{item.key}}</span></Checkbox>
      </CheckboxGroup>
    </Modal>
  </Card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DrugService } from '@/api/ehr/drug'
import {
  backMixin
} from '@/mixin/back-mixin'
export default {
  mixins: [ backMixin ],
  name: 'addDrug',
  props: {
    drugFlag: String,
    drugId: String
  },
  data() {
    const checkDosage = (rule, value, callback) => {
      let data = this.$refs.drugForm.getFormDatas()
      // 设置默认值
      if (this._.isNil(data.dosageQuantity)) {
        this.$refs.drugForm.setFormFieldData('dosageQuantity', 1)
      }
      // 合法性检验
      this.$refs.drugForm.$refs.form.validateField('preparation')
      if (data.dosage === data.preparation && data.dosageQuantity !== 1 && !this._.isNil(data.dosage)) {
        if (rule.field === 'dosageQuantity') {
          callback(new Error('剂量单位和制剂单位一致时，剂量必须是1'))
        } else {
          this.$refs.drugForm.$refs.form.validateField('dosageQuantity')
        }
      } else {
        if (rule.field !== 'dosageQuantity') {
          this.$refs.drugForm.$refs.form.validateField('dosageQuantity')
        }
      }
      // 封装一个json
      this.convertSpecJson(data)
      callback()
    }
    const checkPreparation = (rule, value, callback) => {
      let data = this.$refs.drugForm.getFormDatas()
      // 设置默认值
      if (this._.isNil(data.preparationQuantity)) {
        this.$refs.drugForm.setFormFieldData('preparationQuantity', 1)
      }
      // 合法性检验
      this.$refs.drugForm.$refs.form.validateField('preparation')
      if (data.preparation === data.drugUnit && data.preparationQuantity !== 1 && !this._.isNil(data.preparation)) {
        if (rule.field === 'preparationQuantity') {
          callback(new Error('制剂单位和包装单位一致时，制剂数量必须是1'))
        } else {
          this.$refs.drugForm.$refs.form.validateField('preparationQuantity')
        }
      } else {
        if (rule.field !== 'preparationQuantity') {
          this.$refs.drugForm.$refs.form.validateField('preparationQuantity')
        }
      }
      // 设置销售额的单位
      if (rule.field === 'drugUnit') {
        this.moneyUnitCode = this.$refs.drugForm.getFormDatas().drugUnit
      }
      // 封装一个json
      this.convertSpecJson(data)
      callback()
    }
    const check = (rule, value, callback) => {
      let data = this.$refs.drugForm.getFormDatas()
      // 设置默认值
      if (this._.isNil(data.dosageQuantity)) {
        this.$refs.drugForm.setFormFieldData('dosageQuantity', 1)
      }
      if (this._.isNil(data.preparationQuantity)) {
        this.$refs.drugForm.setFormFieldData('preparationQuantity', 1)
      }
      // 合法性检验
      if ((data.dosage === data.preparation && data.dosageQuantity !== 1 && !this._.isNil(data.dosage)) &&
       (data.preparation === data.drugUnit && data.preparationQuantity !== 1 && !this._.isNil(data.preparation))) {
        callback(new Error('剂量,制剂,包装单位一致时，值都必须是1'))
      }
      // 封装一个json
      this.convertSpecJson(data)
      callback()
    }
    const saleAndCost = (rule, value, callback) => {
      value = this._.isNil(value) ? 0 : parseFloat(value)
      value = isNaN(value) ? 0 : value
      if (rule.field === 'drugSale') {
        this.$refs.drugForm.setFormFieldData('drugSale', value)
      } else {
        this.$refs.drugForm.setFormFieldData('drugCost', value)
      }
      callback()
    }
    const discountCheck = (rule, value, callback) => {
      if (value === '') {
        this.$refs.drugForm.setFormFieldData('discount', undefined)
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
    return {
      targetRoute: { name: 'materialInfo' },
      modalFlag: false,
      isShowDescription: false,
      buttonLoading: false,
      singleUnit: [], // 存放单次剂量的单位
      moneyUnitCode: '',
      drugSpecJson: null, // 存放药品规格的json
      singleDosageJson: null, // 存放单次剂量的json
      caseFormContent: {
        formRules: {
          drugName: [{ required: true, message: '不能为空', trigger: 'blur' }],
          drugFactory: [{ required: true, message: '不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '必选', trigger: 'change' }],
          drugSale: [{ validator: saleAndCost, trigger: 'blur' }],
          drugCost: [{ validator: saleAndCost, trigger: 'blur' }],
          discount: [{ required: true, validator: discountCheck, trigger: 'change' }],
          dosageQuantity: [{ required: true, validator: checkDosage, trigger: 'change' }],
          dosage: [{ required: true, validator: checkDosage, trigger: 'change' }],
          preparationQuantity: [{ required: true, validator: checkPreparation, trigger: 'change' }],
          preparation: [{ required: true, validator: check, trigger: 'change' }],
          drugUnit: [{ required: true, validator: checkPreparation, trigger: 'change' }]
        },
        labelWidth: 100,
        formItemData: [
          {
            name: '药品表单'
          },
          [
            {
              type: 'input',
              label: '国药准字',
              prop: 'nmpn',
              tip: '西/中成药必填'
            },
            {
              type: 'input',
              label: '条形码',
              prop: 'barcode',
              tip: '药品条形码'
            }
          ],
          {
            name: '药品基本信息'
          },
          [
            {
              type: 'input',
              label: '药品名',
              prop: 'drugName',
              tip: '药品名'
            },
            {
              type: 'input',
              disabled: true,
              label: '药品规格',
              prop: 'drugSpecShow',
              tip: '药品规格'
            },
            {
              type: 'input',
              label: '生产厂商',
              prop: 'drugFactory',
              tip: '生产厂商'
            }
          ],
          [
            {
              type: 'cascader',
              label: '药品类型',
              prop: 'drugTypeShow',
              tip: '药品类型',
              r: rowItem => {
                return this.cascaderData
              }
            }
          ],
          [
            {
              type: 'input',
              label: '拼音码',
              prop: 'drugNameSpell'
            },
            {
              type: 'select',
              label: '剂型',
              prop: 'drugForm',
              tip: '剂型',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugForm')
              }
            },
            {
              type: 'radioGroup',
              label: '药品状态',
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
          {
            name: '销售信息'
          },
          [
            {
              type: 'inputNumber',
              min: 0,
              label: '剂量',
              prop: 'dosageQuantity',
              tip: '剂量'
            },
            {
              type: 'select',
              label: '剂量单位',
              prop: 'dosage',
              tip: '剂量单位',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugPackUnit')
              }
            },
            {
              type: 'inputNumber',
              min: 0,
              label: '制剂数量',
              prop: 'preparationQuantity',
              tip: '制剂数量'
            },
            {
              type: 'select',
              label: '制剂单位',
              prop: 'preparation',
              tip: '制剂单位',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugPackUnit')
              },
              onChange: (value) => {
                this.$refs.drugForm.$refs.form.validateField('dosageQuantity')
                this.$refs.drugForm.$refs.form.validateField('preparationQuantity')
              }
            },
            {
              type: 'select',
              label: '包装单位',
              prop: 'drugUnit',
              tip: '包装单位',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugPackUnit')
              }
            }
          ],
          [
            {
              type: 'input',
              label: '零售价',
              prop: 'drugSale',
              tip: '零售价',
              button: true,
              buttonName: rowItem => {
                return this.money
              },
              buttonClick: 'wu'
            },
            {
              type: 'input',
              label: '成本价',
              prop: 'drugCost',
              tip: '成本价',
              button: true,
              buttonName: rowItem => {
                return this.money
              },
              buttonClick: 'wu'
            },
            {
              type: 'input',
              label: '折扣',
              prop: 'discount'
            }
          ],
          {
            name: '默认用法用量'
          },
          [
            {
              type: 'input',
              label: '单次剂量',
              prop: 'singleDosageShow',
              tip: '单次剂量',
              button: true,
              buttonName: rowItem => {
                return this.singleDosageUnit
              },
              buttonClick: 'single-dosage-click'
            },
            {
              type: 'select',
              label: '默认用法',
              prop: 'defaultUsage',
              tip: '默认用法',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugUsage')
              }
            },
            {
              type: 'select',
              label: '默认频次',
              prop: 'defaultFreq',
              tip: '默认频次',
              r: rowItem => {
                return this.dictDatasWithGroupKey('drugUseFreq')
              }
            },
            {
              type: 'input',
              label: '备注',
              prop: 'info',
              tip: '备注'
            }
          ],
          {
            name: '其他信息'
          },
          [
            {
              type: 'input',
              label: '英文名',
              prop: 'enName',
              tip: '英文名'
            },
            {
              type: 'input',
              label: '上药编码',
              prop: 'drugCode',
              tip: '上药编码'
            }
          ]
        ]
      }
    }
  },
  methods: {
    ...mapActions(['closeTagNav', 'getAllType']),
    // 修改模式进入是初始化界面
    initEdit() {
      DrugService.findById(this.drugId).then(res => {
        let editData = res.data
        // 设置药品类型
        if (!this._.isNil(editData.drugType)) {
          editData.drugTypeShow = JSON.parse(editData.drugTypes)
        }
        // 设置规格
        if (!this._.isNil(editData.drugSpec)) {
          let json = JSON.parse(editData.drugSpec)
          editData.drugSpecShow =
            json.dosageQuantity +
            this.dictFormatter('drugPackUnit', json.dosage) +
            '*' +
            json.preparationQuantity +
            this.dictFormatter('drugPackUnit', json.preparation)
          editData.dosageQuantity = json.dosageQuantity
          editData.dosage = json.dosage
          editData.preparationQuantity = json.preparationQuantity
          editData.preparation = json.preparation
        }
        // 设置价格单位
        if (!this._.isNil(editData.drugUnit)) {
          this.moneyUnitCode = editData.drugUnit
        }
        // 设置单次剂量
        if (!this._.isNil(editData.singleDosage)) {
          let json = JSON.parse(editData.singleDosage)
          editData.singleDosageShow = json.value
          for (let item of json.unit) {
            this.singleUnit.push(item.code)
          }
        }
        this.$refs.drugForm.setFormDatas(editData)
      })
    },
    initForm() {
      if (this.drugFlag === 'china') {
        this.caseFormContent.formItemData[1].forEach(item => {
          item.disabled = true
        })
        this.$forceUpdate()
      }
    },
    convertSpecJson(data) {
      if (
        !this._.isNil(data.dosageQuantity) &&
        !this._.isNil(data.dosage) &&
        !this._.isNil(data.preparationQuantity) &&
        !this._.isNil(data.preparation)
      ) {
        let json = {
          dosageQuantity: data.dosageQuantity,
          dosage: data.dosage,
          preparationQuantity: data.preparationQuantity,
          preparation: data.preparation
        }
        this.drugSpecJson = JSON.stringify(json)
        let spec =
          json.dosageQuantity +
          this.dictFormatter('drugPackUnit', json.dosage) +
          '*' +
          json.preparationQuantity +
          this.dictFormatter('drugPackUnit', json.preparation)
        this.$refs.drugForm.setFormFieldData('drugSpecShow', spec)
      }
    },
    save() {
      this.$refs.drugForm.validate({
        success: params => {
          this.buttonLoading = true
          if (
            this.drugFlag === 'west' &&
            (this._.isNil(params.nmpn) || params.nmpn === '')
          ) {
            this.$Message.warning('西/中成药必填国药准字')
            return null
          }
          // 封装单次剂量的json
          if (
            !this._.isNil(params.singleDosageShow) &&
            params.singleDosageShow !== '' &&
            !this._.isEmpty(this.singleUnit)
          ) {
            let json = {
              value: params.singleDosageShow,
              defaultUnit: this.singleUnit[0]
            }
            let unit = []
            for (let item of this.singleUnit) {
              let obj = {}
              obj.code = item
              obj.name = this.dictFormatter('drugPackUnit', item)
              unit.push(obj)
            }
            json.unit = unit
            this.singleDosageJson = JSON.stringify(json)
          } else if (
            (this._.isNil(params.singleDosageShow) ||
              params.singleDosageShow === '') &&
            this._.isEmpty(this.singleUnit)
          ) {
            this.singleDosageJson = null
          } else {
            this.$Message.warning('请填写完整的单次剂量')
            return null
          }
          // 重新封装数据
          let data = JSON.parse(JSON.stringify(params))
          if (!this._.isNil(data.drugTypeShow)) {
            data.drugTypes = JSON.stringify(data.drugTypeShow)
            data.drugType = data.drugTypeShow[data.drugTypeShow.length - 1]
          }
          if (!this._.isNil(this.drugSpecJson)) {
            data.drugSpec = this.drugSpecJson
          }
          if (!this._.isNil(this.singleDosageJson)) {
            data.singleDosage = this.singleDosageJson
          }
          // 删除无用数据
          delete data.dosageQuantity
          delete data.dosage
          delete data.preparationQuantity
          delete data.preparation
          delete data.drugTypeShow
          delete data.drugSpecShow
          // 若是修改，设置要修改得id
          if (!this._.isNil(this.drugId)) {
            data.id = this.drugId
          }
          DrugService.save(data).then(res => {
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
    test() {
      // let arr = JSON.parse(JSON.stringify(this.$store.state.drug.typeData))
      // console.log('111', this.covertDataToTree(arr))
      // console.log(this.setTypeTree(undefined, arr))
    },
    covertDataToTree(arr) {
      let rt = []
      arr.forEach(child => {
        child.label = child.drugTypeName
        child.value = child.id
        let findParent = false
        if (!this._.isNil(child.pid)) {
          arr.forEach(parent => {
            if (parent.id === child.pid) {
              findParent = true
              if (this._.isNil(parent.children)) {
                parent.children = []
              }
              parent.children.push(child)
            }
          })
        }
        if (!findParent) {
          rt.push(child)
        }
      })
      return rt
    },
    setTypeTree(id, arr) {
      let rt = []
      arr.forEach((item, index) => {
        let obj = {}
        if (item.pid === id) {
          obj.label = item.drugTypeName
          obj.value = item.id
          if (item.childNum > 0) {
            obj.children = []
            obj.children = this.setTypeTree(item.id, arr) || []
          }
          rt.push(obj)
        }
      })
      return rt
    }
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    h2() {
      return this.drugFlag === 'china' ? '民族药' : '西/中成药'
    },
    // 用于展示单次剂量的默认单位
    singleDosageUnit() {
      let str = '选择单位'
      if (!this._.isNil(this.singleUnit[0])) {
        str = this.dictFormatter('drugPackUnit', this.singleUnit[0])
      }
      return str
    },
    // 用于显示销售和成本价的单位
    money() {
      return '元/' + this.dictFormatter('drugPackUnit', this.moneyUnitCode)
    },
    // 显示药品类型级联菜单
    cascaderData() {
      let arr = JSON.parse(JSON.stringify(this.$store.state.drug.typeData))
      let options = this.covertDataToTree(arr)
      return options
    },
    // 多选框的值
    checkBoxData() {
      return this.dictDatasWithGroupKey('drugPackUnit')
    }
  },
  mounted() {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this.getAllType()
    // 根据中西药初始化界面
    this.initForm()
    // 代表是编辑
    if (!this._.isNil(this.drugId)) {
      this.initEdit()
    }
  },
  watch: {

  }
}
</script>

<style>
</style>
