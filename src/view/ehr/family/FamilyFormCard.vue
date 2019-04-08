<!--  -->
<template>
<div>
  <Card>
    <p slot="title">{{_.isNil(formData.id)?'新增家庭档案':'修改家庭档案'}}</p>
    <Row>
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' :loading='buttonLoading' @click.native='handleSaveClick' v-if="!isPreView">
          <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
        <i-button @click='handlePreViewClick' v-if="!isPreView">
          <Icon type="md-eye" />预览
        </i-button>
        <i-button v-else @click='handlePreViewClick'>
          <Icon custom="iconfont icon-edit" size=12 />编辑
        </i-button>
        <i-button type='info' @click.native='isShowDescription = !isShowDescription'>
          <Icon custom="iconfont icon-shuoming" size=12 />说明</i-button>
      </ButtonGroup>
    </Row>
    <div class="animated fadeIn" v-show="!isPreView">
     <lega-form  ref="familyForm" :form-item-data="familyFormItemData" :form-rules="familyFormRules" @randomFamilyAccount="randomFamilyAccount">
      </lega-form>
    </div>
    <div class="animated fadeIn" v-show="isPreView">
      <FamilyView  :value="familyInfo" ></FamilyView>
    </div>
  </Card>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  formMixin
} from '@/mixin/form-mixin'
import {
  backMixin
} from '@/mixin/back-mixin'
import LegaForm from '@/components/form/LegaForm'
import {
  FamilyService
} from '@/api/ehr/family'
import {
  ResidentService
} from '@/api/ehr/resident'
import FamilyView from './FamilyInfoView'

const areaFields = [{
  index: 0,
  field: 'province',
  defaultCode: '540000'
},
{
  index: 1,
  field: 'city',
  defaultCode: '540300'
}, {
  index: 2,
  field: 'county',
  defaultCode: '540330'
}, {
  index: 3,
  field: 'village'
}
]
export default {
  mixins: [formMixin, backMixin],
  props: {
  },
  components: {
    LegaForm,
    FamilyView
  },
  data() {
    return {
      targetRoute: {
        name: 'familyList'
      },
      familyInfo: {},
      // 按钮是否处于加载
      buttonLoading: false,
      // 是否是预览状态
      isPreView: false,
      // 是否展示说明
      isShowDescription: false,
      formData: {},
      // 表单验证规则
      ruleValidate: {},
      familyFormRules: {
        _area: [{
          required: true,
          type: 'array',
          message: '请选择区域',
          trigger: 'change'
        }],
        householdProp: [{
          required: true,
          message: '请选择户属性',
          trigger: 'change'
        }],
        partAttr: [{
          required: true,
          message: '请选择参合属性',
          trigger: 'change'
        }],
        familyAccount: [{
          required: true,
          trigger: 'blur',
          validator: this.familyAccountValidator
        }],
        houseOwner: [
          {
            required: true,
            trigger: 'blur',
            message: '户主不能为空'
          }
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm._initForm(to.params || {})
    })
  },
  methods: {
    handlePreViewClick() {
      this.isPreView = !this.isPreView
      this.familyInfo = this.makeData(this.$refs['familyForm'].getFormDatas())
    },
    /** 当区域变化时 户号变化 */
    handleAreaChangeValidtor: function(value) {
      const vm = this
      if (value && value.length === 4) {
        let formDatas = vm.$refs['familyForm'].getFormDatas()
        if (!vm._.isNil(formDatas.familyAccount) && !vm._.isEmpty(formDatas.familyAccount)) {
          let _villageCode = value[3].code
          if (_villageCode && !formDatas.familyAccount.startsWith(_villageCode)) {
            let _number = (Array(4).join('0') + formDatas.familyAccount).slice(-4)
            vm.$refs['familyForm'].setFormFieldData('familyAccount', `${_villageCode}-${_number}`)
          }
        }
      }
    },
    /** 户号验证器 */
    familyAccountValidator: function(rule, value, callBack = function () {}) {
      const vm = this
      if (vm._.isNil(value) || vm._.isEmpty(value)) {
        callBack([new Error('户号不能为空')])
      } else {
        // 验证户号长度
        let _v = value.split('-').join('')
        let _villageCode = ''
        let formDatas = vm.$refs['familyForm'].getFormDatas()
        if (formDatas._area && formDatas._area.length === 4) {
          _villageCode = formDatas._area[3].code
        }
        if (_v.length < 4) {
          _v = (Array(4).join('0') + _v).slice(-4)
        }
        if (!_v.startsWith(_villageCode)) {
          let val = `${_villageCode}-${_v}`
          _v = `${_villageCode}${_v}`
          vm.$refs['familyForm'].setFormFieldData('familyAccount', val)
        }
        if (_v.length !== 16) {
          callBack([new Error('"-"符号不算长度，户号长度需要16位')])
        } else {
          // 验证户号是否重复
          let _params = []
          if (!vm._.isNil((vm.formData || {}).id) && !vm._.isEmpty((vm.formData || {}).id)) {
            _params.push({
              field: 'id',
              queryType: 'neq',
              value: vm.formData.id
            })
          }
          _params.push({
            field: 'familyAccount',
            queryType: 'eq',
            value: _v
          })
          // 验证 身份证号码 是否 重复
          FamilyService.countByCondition(_params).then(res => {
            if (res.status === 0) {
              if (res.data !== 0) {
                callBack([new Error('户号已经存在')])
              } else {
                callBack()
              }
            } else {
              callBack([new Error(res.msg)])
            }
          })
        }
      }
    },
    // 随机生成 家庭户号
    randomFamilyAccount: function() {
      const vm = this
      if (_.isNil(vm.formData.id)) {
        // 在新增条件下
        let num = parseInt(Math.random() * 10000)
        let seq = (Array(4).join('0') + num).slice(-4)
        let formDatas = vm.$refs['familyForm'].getFormDatas()
        if (this._.isNil(formDatas._area)) {
          vm.$refs['familyForm'].setFormFieldData('familyAccount', seq)
        } else {
        // 乡编号 - seq
          vm.$refs['familyForm'].setFormFieldData('familyAccount', `${formDatas._area[3].code}-${seq}`)
        }
        // 调用下 验证该字段
        this.$refs['familyForm'].$refs.form.validateField('familyAccount')
      }
    },
    /** 保存点击 */
    handleSaveClick: function () {
      const vm = this
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
          vm.buttonLoading = false
        }
      }
      vm.buttonLoading = true
      let msg = '信息更改成功'
      opt.success = function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        // 将参数整理成 需要的数据
        let _p = vm.makeData(params)
        FamilyService.saveFamilyInfo(_p).then((res) => {
          if (res.status === 0) {
            vm.$Message.success(msg)
            vm.goBack()
          } else {
            vm.$Message.error('失败')
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['familyForm'].validate(opt)
    },
    /** 将参数整理成 需要的数据 */
    makeData: function (formData) {
      const vm = this
      if (!vm._.isNil(formData._area)) {
        areaFields.forEach(item => {
          try {
            formData[item.field] = JSON.stringify(formData._area[item.index] || {})
          } catch (e) {
            formData[item.field] = ''
          }
        })
      }
      if (formData.familyAccount) {
        formData.familyAccount = formData.familyAccount.split('-').join('')
      }
      delete formData._area
      return formData
    },
    _initForm: function (params) {
      let _formData = JSON.parse(JSON.stringify(params || {}))
      if (this._.isNil(_formData.id)) {
        // this.resetFormItem()
      }
      _formData._area = []
      areaFields.forEach(item => {
        try {
          _formData._area[item.index] = JSON.parse(_formData[item.field]) || item.defaultCode
        } catch (e) {
          _formData._area[item.index] = item.defaultCode
        }
      })
      this.formData = _formData
      this.$refs['familyForm'].setFormDatas(_formData)
    },
    getFormDatas: function () {
      const vm = this
      let _formData = JSON.parse(JSON.stringify(vm.formItem || {}))
      let areaData = {}
      if (!vm._.isNil(_formData._area)) {
        areaFields.forEach(item => {
          areaData[item.field] = JSON.stringify(_formData._area[item.index] || {})
          if (!vm._.isNil(item.codeField)) {
            areaData[item.codeField] = (_formData._area[item.index] || {}).code || ''
          }
        })
      }
      return { ..._formData,
        ...areaData
      }
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey'
    ]),

    familyFormItemData() {
      let disabled = !this._.isNil(this.formData.id)
      let areaDisabled = disabled === true ? [0, 1, 2, 3] : [0, 1, 2]
      let familyFormItemData = [
        {
          name: '基本信息'
        },
        [{
          type: 'alSelector',
          prop: '_area',
          level: 3,
          label: '区域',
          disabled: areaDisabled,
          onInput: this.handleAreaChangeValidtor,
          onlyRead: {
            r: (data) => {
              const _area = JSON.parse(JSON.stringify(data || {}))._area || []
              let areaText = []
              _area.forEach(item => {
                areaText.push(item.name)
              })
              return areaText.join('-')
            },
            icon: {
              custom: 'iconfont icon-diqu'
            }
          }
        }],
        [
          {
            type: 'select',
            prop: 'householdProp',

            label: '户属性',
            r: (rowItem) => {
              return this.dictDatasWithGroupKey('householdProp')
            },
            dictGroup: 'householdProp',
            onlyRead: {
              r: 'dictFormatter',
              icon: {
                custom: 'iconfont icon-shouru'
              }
            }
          },
          {
            type: 'select',
            prop: 'partAttr',
            label: '参合属性',
            r: (rowItem) => {
              return this.dictDatasWithGroupKey('partAttr')
            },
            dictGroup: 'partAttr',
            onlyRead: {
              r: 'dictFormatter',
              icon: {
                custom: 'iconfont icon-shouru'
              }
            }
          }
        ],
        [
          {
            type: 'input',
            prop: 'familyAccount',
            disabled: disabled,
            label: '户号',
            tip: '乡编号-家庭编号',
            onlyRead: {
              icon: {
                custom: 'iconfont icon-tree-round-house-number'
              }
            },
            button: true,
            customIcon: 'iconfont icon-suiji2',
            iconSize: 20,
            buttonClick: 'randomFamilyAccount'
          },
          {
            type: 'dynamic-modal',
            textField: 'houseOwnerName',
            valueField: 'houseOwner',
            prop: 'houseOwner',
            label: '户主',
            options: {
              title: '选择户主',
              footerHide: true,
              width: '70%',
              renderHeader: (h) => {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'md-person',
                      size: 30
                    }
                  }),
                  '选择户主'
                ])
              },
              renderBody: (h) => {
                return h('LegaTable', {
                  props: {
                    options: {
                      actionsHandle: {
                        select: (params, column) => {
                          let row = params.row
                          this.$refs['familyForm'].setFormFieldsData({
                          // 户主名称
                            houseOwnerName: row.name,
                            // 户主id
                            houseOwner: row.id,
                            // 户主档案编号
                            householdsProfileNumber: row.profileNumber
                          })
                          this.$refs['familyForm'].getDynamicModalByKey('houseOwnerName').remove()
                        }
                      },
                      permissionPerfix: 'residentList',
                      url: `${ResidentService.baseUrlPrefix}/page/not/in/family`,
                      columns: [{
                        key: 'name',
                        title: '姓名'
                      },
                      {
                        key: 'gender',
                        title: '性别',
                        dictGroup: 'gender',
                        render: 'dictFormatter'
                      },
                      {
                        key: 'birthday',
                        title: '出生日期'
                      },
                      {
                        key: 'idNumber',
                        title: '身份证号码'
                      },
                      {
                        key: 'telephone',
                        title: '联系电话'
                      },
                      {
                        key: 'address',
                        title: '详细地址'
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: ['select']
                      }
                      ],
                      searchOptions: {
                        hiddenItems: [{
                          type: 'select',
                          label: '性别',
                          prop: 'gender',
                          tip: '请选择性别',
                          r: (rowItem) => {
                            return this.dictDatasWithGroupKey('gender')
                          }
                        },
                        {
                          type: 'input',
                          label: '身份证号码',
                          prop: 'idNumber',
                          tip: '请输入身份证号码'
                        },
                        {
                          type: 'input',
                          label: '联系电话',
                          prop: 'telephone',
                          tip: '请输入联系电话'
                        },
                        {
                          type: 'select',
                          label: '常住类型',
                          prop: 'residentType',
                          tip: '常住类型',
                          r: (rowItem) => {
                            return this.dictDatasWithGroupKey('residentType')
                          }
                        },
                        {
                          type: 'select',
                          label: '民族',
                          prop: 'nationality',
                          tip: '民族',
                          r: (rowItem) => {
                            return this.dictDatasWithGroupKey('nationality')
                          }
                        },
                        {
                          type: 'select',
                          label: '文化程度',
                          prop: 'educationLevel',
                          tip: '文化程度',
                          r: (rowItem) => {
                            return this.dictDatasWithGroupKey('educationLevel')
                          }
                        }
                        ],
                        showItems: [{
                          type: 'input',
                          label: '姓名',
                          prop: 'name',
                          tip: '请输入姓名'
                        }
                        ]
                      }
                    }
                  }
                })
              }
            },
            onlyRead: {
              icon: {
                custom: 'iconfont icon-fangwumianji'
              }
            }
          }
        ],
        [{
          type: 'inputNumber',
          prop: 'population',
          label: '常住人口数',
          max: 10,
          min: 0,
          formatter: value => `${value}人`,
          style: 'width:100%',
          dictGroup: 'population',
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-fangwu'
            }
          }
        },
        {
          type: 'select',
          prop: 'yearlyIncome',
          label: '年收入',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('yearlyIncome')
          },
          dictGroup: 'yearlyIncome',
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-shouru'
            }
          }
        }
        ],
        [{
          type: 'input',
          prop: 'address',
          label: '住址'
        }], {
          name: '居住条件与卫生设施'
        },
        [{
          type: 'select',
          prop: 'housingType',
          label: '住房类型',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('housingType')
          },
          dictGroup: 'housingType',
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-fangwu'
            }
          }
        },
        {
          type: 'inputNumber',
          prop: 'dwellingArea',
          label: '住房面积',
          max: 1000,
          min: 0,
          formatter: value => `${value}平方米`,
          style: 'width:100%',
          onlyRead: {
            r: (data) => `${data['dwellingArea'] || 0} 平方米`,
            icon: {
              custom: 'iconfont icon-fangwumianji'
            }
          }
        }
        ],
        [{
          type: 'select',
          prop: 'fuelType',
          label: '燃料类型',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('fuelType')
          },
          dictGroup: 'fuelType',
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-water_icon'
            }
          }

        },
        {
          type: 'select',
          prop: 'drinkingWater',
          label: '饮用水来源',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('drinkingWater')
          },
          dictGroup: 'drinkingWater',
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-water_icon'
            }
          }
        }
        ],
        [{
          type: 'select',
          prop: 'toiletType',
          label: '厕所类型',
          dictGroup: 'toiletType',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('toiletType')
          },
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-cesuo'
            }
          }

        },
        {
          type: 'select',
          prop: 'corral',
          label: '禽畜栏',
          dictGroup: 'corral',
          r: (rowItem) => {
            return this.dictDatasWithGroupKey('corral')
          },
          onlyRead: {
            r: 'dictFormatter',
            icon: {
              custom: 'iconfont icon-guimohuaxuqinyangzhichang'
            }
          }
        }
        ]
      ]
      return familyFormItemData
    }
  }
}
</script>

<style scoped>
</style>
