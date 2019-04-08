<!--  -->
<template>
<div class="resident-container">
  <Card>
    <p slot="title">{{_.isNil(formItem.id)?'新增个人档案':'修改个人档案'}}</p>
    <Row>
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' :loading='buttonLoading' @click.native='handleSaveClick' v-if="!isPreView">
          <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
        <i-button @click.native='handlePreviewClick' v-if="!isPreView">
          <Icon type="md-eye" />预览
        </i-button>
        <i-button v-else @click.native='isPreView =!isPreView'>
          <Icon custom="iconfont icon-edit" size=12 />编辑
        </i-button>
        <i-button type='info' @click.native='isShowDescription = !isShowDescription'>
          <Icon custom="iconfont icon-shuoming" size=12 />说明</i-button>
      </ButtonGroup>
    </Row>
    <FormDescription v-if="isShowDescription"></FormDescription>
    <Row :gutter='1'>
      <Col v-if="!isPreView" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <Card :bordered="false">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Divider>基本信息</Divider>
        <Form ref="form" :model="formItem" :label-width="80" :rules='ruleValidate'>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="照片" prop='photo'>
              <Upload ref="uploadPhoto" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="512" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" type="drag" action="" style="display: inline-block;width:80px;">
                <div style="width: 80px;height:80px;line-height: 80px;">
                  <img v-if="!_.isNil(photoSrc)"
                         :src="photoSrc"
                         style="width:80px;height:80px" />
                  <Icon v-else custom="iconfont icon-user__easyico" size="50"></Icon>
                </div>
              </Upload>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="档案编号" prop='profileNumber'>
              <Input v-model="formItem.profileNumber"
                :disabled="!_.isNil(formItem.id)">
              <Button  slot="append" @click="handleProfileNumberRandomAction">
                    <icon custom="iconfont icon-suiji2" size=16></icon>
                  </Button>
              </Input>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="地区" prop='_area'>
              <al-selector gutter="0" v-model="formItem._area" @input="areaValidator" level="3" auto :disabled="!_.isNil(formItem.id) ===true?[0,1,2,3]:[0,1,2]" />
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="姓名" prop='name'>
              <Input v-model="formItem.name"
                       placeholder="请输入姓名"></Input>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="性别" prop='gender'>
              <Select v-model="formItem.gender"
                        placeholder="请选择性别" :disabled="!_.isNil(formItem.id)">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('gender')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="出生日期" prop='birthday'>
              <DatePicker v-model="formItem.birthday" :disabled="!_.isNil(formItem.id)" type="date" placeholder="出生日期" style="width:100%"></DatePicker>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="身份证号" prop='idNumber'>
              <Input v-model="formItem.idNumber" :disabled="!_.isNil(formItem.id)"></Input>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="本人电话" prop='telephone'>
              <Input v-model="formItem.telephone"></Input>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="工作单位" prop='workUnit'>
              <Input v-model="formItem.workUnit"></Input>
            </FormItem>

            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="现住址" prop="currentAddress">
              <Input v-model="formItem.currentAddress"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="联系人名称">
              <Input v-model="formItem.contactName"></Input>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="联系人电话">
              <Input v-model="formItem.contactPhone"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="常住类型" prop='residentType'>
              <Select v-model="formItem.residentType"
                        placeholder="请选择常住类型">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('residentType')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="民族" prop='nationality'>
              <Select v-model="formItem.nationality"
                        placeholder="民族">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('nationality')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="血型">
              <Row>
                <Col :span="12">
                <Select v-model="formItem.bloodTypeAbo"
                          placeholder="血型">
                    <Option v-for="(item, index) in dictDatasWithGroupKey('bloodTypeAbo')"
                            :key="index"
                            :value="item.value">{{item.key}}</Option>
                  </Select>
                </Col>
                <Col :span="12">
                <Select v-model="formItem.bloodTypeRh"
                          placeholder="血型RH">
                    <Option v-for="(item, index) in dictDatasWithGroupKey('bloodTypeRh')"
                            :key="index"
                            :value="item.value">{{item.key}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="文化程度">
              <Select v-model="formItem.educationLevel">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('educationLevel')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="职业">
              <Select v-model="formItem.career">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('career')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="婚姻状态">
              <Select v-model="formItem.marriage">
                  <Option v-for="(item, index) in dictDatasWithGroupKey('marriage')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="医疗费用支付方式">
              <Select v-model="formItem.paymentMode"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('paymentMode')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="药物过敏史">
              <Select v-model="formItem.drugAllergy"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('drugAllergy')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="暴露史">
              <Select v-model="formItem.exposed"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('exposed')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider>既往史</Divider>
        <div v-for="(formDynamic, key) in dynamicFroms" :key="key">
          <Divider orientation="left">{{formDynamic.divider}}</Divider>
          <Form :ref="formDynamic.ref" :model="formDynamic" :label-width="80">
            <Row v-for="(r, r_index) in formDynamic.rows" :key="r_index" v-if="!r.hidden">
              <i-Col v-for="(col, c_index) in formDynamic.columns" v-if="!_.isNil(col)" :key="c_index" :span="col.span || 2">
                <FormItem :prop="'rows.'+r_index+'.values.'+[col.prop]" :label="col.label">
                  <i-Input v-if="col.type==='input'" v-model="formDynamic.rows[r_index]['values'][col.prop]" :placeholder="(col.options || {}).placeholder ||''"></i-Input>
                  <Select v-if="col.type==='select'"
                          v-model="formDynamic.rows[r_index]['values'][col.prop]"
                          :placeholder="(col.options || {}).placeholder ||''">
                    <Option v-for="(sItem, sIndex) in ((col.options|| {r:function(){}}).r(col) || [])"
                            :key="sIndex"
                            :value="sItem.key">{{sItem.key}}</Option>
                  </Select>
                  <DatePicker v-if="col.type==='datepicker'" v-model="formDynamic.rows[r_index]['values'][col.prop]" :format="(col.options || {}).format || 'yyyy年MM月dd日'" type="date" :placeholder="(col.options || {}).placeholder||''" style="width:100%"></DatePicker>
                </FormItem>
              </i-Col>
              <i-Col :span="1">
                <Button @click="handleDynamicFormItemRemove(key,r_index)"
                        type="primary"
                        shape="circle"
                        icon="md-close"></Button>
              </i-Col>
            </Row>
            <FormItem>
              <Row>
                <i-Col span="12">
                  <Button type="primary"
                          shape="circle"
                          @click="handleDynamicFormAdd(formDynamic)"
                          icon="md-add"></Button>
                </i-Col>
              </Row>
            </FormItem>
          </Form>
        </div>
        <Divider>家族史</Divider>
        <Form ref="familyHistoryForm" :model="familyHistoryForm" :label-width="80" :rules='familyRuleValidate'>
          <Row>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="父亲">
              <Select v-model="familyHistoryForm.familyMedicalHistoryFather"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('pastMedicalHistoryDisease')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="母亲">
              <Select v-model="familyHistoryForm.familyMedicalHistoryMother"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('pastMedicalHistoryDisease')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="兄弟">
              <Select v-model="familyHistoryForm.familyMedicalHistoryBrothers"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('pastMedicalHistoryDisease')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <FormItem label="子女">
              <Select v-model="familyHistoryForm.familyMedicalHistoryChildren"
                        multiple
                        clearable>
                  <Option v-for="(item, index) in dictDatasWithGroupKey('pastMedicalHistoryDisease')"
                          :key="index"
                          :value="item.value">{{item.key}}</Option>
                </Select>
            </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      </Col>
      <Col v-if="isPreView" class="example-view" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <WordView :value="residentView" :showBtns="false"></WordView>
      </Col>
    </Row>
  </Card>
</div>
</template>

<script>
import WordView from './ResidentWordView'
import FormDescription from './FormDescription'
import {
  mapGetters
} from 'vuex'
import {
  formMixin
} from '@/mixin/form-mixin'
import {
  ResidentService
} from '@/api/ehr/resident'
import {
  backMixin
} from '@/mixin/back-mixin'
const needStringifyFields = [
  'drugAllergy',
  'exposed',
  'paymentMode',
  'pastMedicalHistoryBloodTransfusion',
  'pastMedicalHistorySurgery',
  'pastMedicalHistoryTrauma',
  'pastMedicalHistoryDisease',
  'familyMedicalHistoryFather',
  'familyMedicalHistoryMother',
  'familyMedicalHistoryBrothers',
  'familyMedicalHistoryChildren',
  'province',
  'city',
  'county',
  'village'
]
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
    resident: Object
  },
  data() {
    return {
      buttonLoading: false,
      targetRoute: {
        name: 'residentList'
      },
      spinShow: false,
      // 是否是预览状态
      isPreView: false,
      // 是否展示说明
      isShowDescription: false,
      residentView: {},
      // 动态表单
      dynamicFroms: {
        historyDisease: {
          field: 'pastMedicalHistoryDisease',
          divider: '疾病',
          ref: 'history-disease',
          columns: [{
            prop: 'type',
            span: 11,
            label: '疾病类型',
            type: 'select',
            rules: {},
            options: {
              placeholder: '请选择疾病类型',
              r: col => {
                return this.dictDatasWithGroupKey('pastMedicalHistoryDisease')
              }
            }
          },
          {
            span: 12,
            prop: 'date',
            label: '确诊时间',
            type: 'datepicker',
            rules: {},
            options: {
              placeholder: '确诊时间'
            }
          }
          ],
          rows: [{
            hidden: 0,
            values: {
              type: '',
              date: ''
            }
          }]
        },
        historySurgery: {
          field: 'pastMedicalHistorySurgery',
          divider: '手术',
          ref: 'history-surgery',
          columns: [{
            prop: 'name',
            span: 11,
            label: '手术名称',
            type: 'input',
            rules: {},
            options: {
              placeholder: '手术名称'
            }
          },
          {
            span: 12,
            prop: 'date',
            label: '手术时间',
            type: 'datepicker',
            rules: {},
            options: {
              placeholder: '手术时间'
            }
          }
          ],
          rows: [{
            hidden: 0,
            values: {
              name: '',
              date: ''
            }
          }]
        },
        historyTrauma: {
          field: 'pastMedicalHistoryTrauma',
          divider: '外伤',
          ref: 'history-trauma',
          columns: [{
            prop: 'name',
            span: 11,
            label: '外伤名称',
            type: 'input',
            rules: {},
            options: {
              placeholder: '外伤名称'
            }
          },
          {
            span: 12,
            prop: 'date',
            label: '时间',
            type: 'datepicker',
            rules: {},
            options: {
              placeholder: '时间'
            }
          }
          ],
          rows: [{
            hidden: 0,
            values: {
            }
          }]
        },
        historyBloodTransfusion: {
          field: 'pastMedicalHistoryBloodTransfusion',
          divider: '输血',
          ref: 'pastMedicalHistoryBloodTransfusion',
          columns: [{
            prop: 'reason',
            span: 11,
            label: '原因',
            type: 'input',
            rules: {},
            options: {
              placeholder: '输血原因'
            }
          },
          {
            span: 12,
            prop: 'date',
            label: '时间',
            type: 'datepicker',
            rules: {},
            options: {
              placeholder: '时间'
            }
          }
          ],
          rows: [{
            hidden: 0,
            values: {
              reason: '',
              date: ''
            }
          }]
        }
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '请填入姓名',
          trigger: 'blur'
        }],
        _area: [{
          required: true,
          type: 'array',
          message: '请选择区域',
          trigger: 'change'
        }],
        gender: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        profileNumber: [{
          required: true,
          trigger: 'blur',
          validator: this.profileNumberValidator
        }],
        birthday: [{
          required: true,
          type: 'date',
          message: '请选择出生日期',
          trigger: 'change'
        }],
        idNumber: [{
          required: true,
          trigger: 'blur',
          validator: this.idNumerValidator
        }]
      },
      familyRuleValidate: {},
      formItem: {},
      familyHistoryForm: {
        familyMedicalHistoryFather: undefined,
        familyMedicalHistoryMother: undefined,
        familyMedicalHistoryBrothers: undefined,
        familyMedicalHistoryChildren: undefined
      }
    }
  },
  components: {
    WordView,
    FormDescription
  },
  watch: {},
  computed: {
    ...mapGetters(['dictDatasWithGroupKey']),
    photoSrc: function () {
      return this.formItem.photo
    }
  },
  mounted: function () {
    const vm = this
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    vm.spinShow = true
    vm.$nextTick(() => {
      vm._initForm().then(() => {
        this.spinShow = false
      })
    })
  },
  methods: {
    handlePreviewClick() {
      this.isPreView = !this.isPreView
      let datas = this._getDynamicFormDatas(true) || {}
      this.residentView = Object.assign({}, this.formItem, datas, this.familyHistoryForm)
    },
    /** 区域验证器 */
    areaValidator: function (value) {
      const vm = this
      if (value && value.length === 4) {
        if (!vm._.isNil(vm.formItem.profileNumber) && !vm._.isEmpty(vm.formItem.profileNumber)) {
          let _villageCode = value[3].code
          if (_villageCode && !vm.formItem.profileNumber.startsWith(_villageCode)) {
            let _number = (Array(5).join('0') + vm.formItem.profileNumber).slice(-5)
            vm.$set(vm.formItem, 'profileNumber', `${_villageCode}-${_number}`)
          }
        }
      }
    },
    /** 身份证验证器 */
    idNumerValidator: function (rule, value, callBack) {
      const vm = this
      if (vm._.isNil(value) || vm._.isEmpty(value)) {
        callBack([new Error('身份证号码不能为空')])
      } else {
        // 验证格式是否正确
        var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
        if (!reg.test(value)) {
          callBack([new Error('身份证号码格式不正确,请输入正确的18位身份证号')])
        } else {
          let params = {
            id: vm.formItem.id,
            idNumber: value
          }
          // 验证 身份证号码 是否 重复
          ResidentService.validIdNumber(params).then(res => {
            if (res.ok()) {
              if (res.data !== true) {
                callBack([new Error('身份证号码已存在')])
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
    /** 档案编号验证器 */
    profileNumberValidator: function (rule, value, callBack) {
      const vm = this
      if (vm._.isNil(value) || vm._.isEmpty(value)) {
        callBack([new Error('档案编号不能为空')])
      } else {
        // 验证档案编号格式
        let _v = value.split('-').join('')
        let _villageCode = ''
        if (vm.formItem._area) {
          _villageCode = this.formItem._area[3].code
        }
        if (_v.length < 5) {
          _v = (Array(5).join('0') + _v).slice(-5)
        }
        if (!_v.startsWith(_villageCode)) {
          let val = `${_villageCode}-${_v}`
          _v = `${_villageCode}${_v}`
          vm.$set(vm.formItem, 'profileNumber', val)
        }
        if (_v.length !== 17) {
          callBack([new Error('"-"符号不算长度，档案编号长度需要17位')])
        } else {
          let _params = []
          if (!vm._.isNil((vm.formItem || {}).id) && !vm._.isEmpty((vm.formItem || {}).id)) {
            _params.push({
              field: 'id',
              queryType: 'neq',
              value: vm.formItem.id
            })
          }
          _params.push({
            field: 'profileNumber',
            queryType: 'eq',
            value: _v
          })
          // 验证 档案编号 是否 重复
          ResidentService.countByCondition(_params).then(res => {
            if (res.ok()) {
              if (res.data !== 0) {
                callBack([new Error('档案编号已存在')])
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
    /** 随机生成 个人档案编号 */
    handleProfileNumberRandomAction: function () {
      //
      if (this._.isNil(this.formItem.id)) {
        // 获取地区数据
        let num = parseInt(Math.random() * 100000)
        console.log(this.formItem)
        let seq = (Array(5).join('0') + num).slice(-5)
        if (this._.isNil(this.formItem._area)) {
          this.$set(this.formItem, 'profileNumber', `${seq}`)
        } else {
          this.$set(this.formItem, 'profileNumber', `${this.formItem._area[3].code}-${seq}`)
        }
        // 调用下 验证该字段
        this.$refs['form'].validateField('profileNumber')
      }
    },
    /** 预览点击事件 */
    handlePreViewClick: function () {},
    /** 保存点击 */
    handleSaveClick: function () {
      const vm = this
      vm.buttonLoading = true
      vm.spinShow = true
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
          vm.buttonLoading = false
          vm.spinShow = false
        }
      }
      let msg = '信息更改成功'
      opt.success = function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        ResidentService.save(params).then(res => {
          if (res.ok()) {
            vm.$Message.success(msg)
            vm.goBack()
          }
          vm.buttonLoading = false
          vm.spinShow = false
        })
      }
      vm.validate(opt)
    },
    /** 展示说明 */
    handleShowInfoClick: function () {},
    /** 回退 */
    handleBeforeUpload: function (file) {
      const vm = this
      let fileReader = new FileReader()
      fileReader.onload = e => {
        vm.$set(vm.formItem, 'photo', e.target.result)
      }
      fileReader.readAsDataURL(file)
      return false
    },

    handleMaxSize: function (file, fileList) {
      this.$Message.error({
        content: '照片大小超过2M'
      })
    },
    handleFormatError: function (file, fileList) {
      this.$Message.error({
        content: '文件格式错误'
      })
    },

    // 初始化表单
    _initForm: async function () {
      const residentInfo = this._.defaultsDeep({}, this.resident)
      let _form = {}
      _form._area = []
      if (this._.isNil(residentInfo.id)) {
        this.resetFormItem()
        this.resetDynamicFormItem()
        this.resetFamilyHistoryForm()
        areaFields.forEach(item => {
          _form._area[item.index] = item.defaultCode
        })
        this.formItem = this._.defaultsDeep({}, _form)
        return
      }
      const resp = await ResidentService.findById(residentInfo.id)
      if (!resp.ok()) {
        return
      }
      Object.assign(_form, resp.data)
      areaFields.forEach(item => {
        try {
          _form._area[item.index] = JSON.parse(_form[item.field]) || item.defaultCode
        } catch (e) {
          _form._area[item.index] = item.defaultCode
        }
      })
      needStringifyFields.forEach(field => {
        try {
          _form[field] = JSON.parse(_form[field])
        } catch (e) {
          _form[field] = undefined
        }
      })
      this._initDynamicForms(_form)
      this._initFamilyHistoryForm(_form)
      this.formItem = this._.defaultsDeep({}, _form)
    },

    // 初始化动态表单数据
    _initDynamicForms: function (data) {
      const vm = this
      for (let key in vm.dynamicFroms) {
        let _form = vm.dynamicFroms[key]
        let _rows = data[_form.field] || []
        vm.dynamicFroms[key].rows = _rows.map(r => {
          return {
            values: r
          }
        })
      }
    },
    _initFamilyHistoryForm: function (data) {
      const vm = this
      for (let key in vm.familyHistoryForm) {
        vm.familyHistoryForm[key] = data[key]
      }
    },
    resetFamilyHistoryForm: function () {
      const vm = this
      for (let key in vm.familyHistoryForm) {
        vm.familyHistoryForm[key] = undefined
      }
    },
    // 重置动态表单数据
    resetDynamicFormItem: function () {
      const vm = this
      for (let key in this.dynamicFroms) {
        let _form = this.dynamicFroms[key]
        let rowItem = {
          values: {}
        }
        _form.columns.forEach(col => {
          rowItem.values[col.prop] = ''
        })
        let newRow = []
        newRow.push(rowItem)
        vm.dynamicFroms[key].rows = newRow
      }
    },
    /** 动态表单单项移除 */
    handleDynamicFormItemRemove: function (formDynamicKey, rowIndex) {
      this.dynamicFroms[formDynamicKey].rows[rowIndex].hidden = 1
    },
    /** 动态表单添加 */
    handleDynamicFormAdd: function (formDynamic) {
      let _vs = {}
      formDynamic.columns.forEach(c => {
        _vs[c.prop] = undefined
      })
      formDynamic.rows.push({
        hidden: 0,
        values: _vs
      })
    },
    /** 获取所有表单数据 */
    getFormDatas: function () {
      const vm = this
      // 基础信息表单
      let _formData = JSON.parse(JSON.stringify(vm.formItem))
      // 家庭史表单
      let _familyFormData = JSON.parse(JSON.stringify(vm.familyHistoryForm))
      // 动态表单数据
      let dynamicFormDatas = vm._getDynamicFormDatas()
      if (!vm._.isNil(_formData._area)) {
        areaFields.forEach(item => {
          try {
            _formData[item.field] = _formData._area[item.index] || {}
          } catch (e) {
            _formData[item.field] = {}
          }
        })
      }
      delete _formData._area
      // 格式化时间
      _formData['birthday'] = vm
        ._moment(_formData['birthday'])
        .format('YYYY-MM-DD')

      if (_formData['profileNumber']) {
        _formData['profileNumber'] = (_formData['profileNumber']).split('-').join('')
      }
      needStringifyFields.forEach(field => {
        _formData[field] = JSON.stringify(_formData[field])
        if (field in _familyFormData) {
          _familyFormData[field] = JSON.stringify(_familyFormData[field])
        }
      })
      return {
        ..._formData,
        ...dynamicFormDatas,
        ..._familyFormData
      }
    },
    // 获取动态表单数据
    _getDynamicFormDatas: function (tag) {
      const vm = this
      let rt = {}
      for (let key in vm.dynamicFroms) {
        let _form = vm.dynamicFroms[key]
        if (!vm._.isNil(_form.field)) {
          if (tag) {
            rt[_form.field] = (_form.rows || []).filter(r => !r.hidden).map(r => r.values)
          } else {
            rt[_form.field] = JSON.stringify((_form.rows || []).filter(r => !r.hidden).map(r => r.values) || [])
          }
        }
      }
      return rt
    }
  }
}
</script>

<style scoped>
.resident-container .ivu-card-body .ivu-spin-fix .ivu-spin-main {
  position: absolute;
  top: 100px !important;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.resident-container .ivu-row {
  margin-bottom: 10px;
}
</style>
