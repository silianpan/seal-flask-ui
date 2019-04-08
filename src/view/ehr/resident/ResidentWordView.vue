<template>
<div class="resident-word-view-container">
    <ButtonGroup v-if="showBtns===true">
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button  type="primary" style="margin-bottom:10px" @click="printClick">打印</i-button>
    </ButtonGroup>
    <div id="info-base-wordview">
      <slot>
         <Row type="flex" >
          <i-col :xs="24" :sm="24" :md="12" :lg="12">
            <IdCardInfo
            :photoSrc="value.photo"
            :name="value.name"
            :idNumber="value.idNumber"
            :gender="dictFormatter('gender',value.gender)"
            :nationality="dictFormatter('nationality',value.nationality)"
            :birthday="value.birthday"
            :address="value.currentAddress"
            ></IdCardInfo>
          </i-col>
        </Row>
      </slot>
      <div class="bs-callout-small bs-callout-primary">
        <h4>个人基本信息 </h4>
      </div>
      <LegaWordView  :formItemData="residentFormContent.formItemData" :formData="residentFormContent.formData"></LegaWordView>
      <div class="bs-callout-small bs-callout-primary">
        <h4>既往史 </h4>
      </div>
      <div style="margin-left:20px">
        <!-- 疾病  -->
        <div v-if="pastMedicalHistoryDisease && pastMedicalHistoryDisease.length > 0">
          <span style="font-weight:bold;font-size:16px">疾病</span>
          <div v-for="(item, index) in pastMedicalHistoryDisease" :key="index" v-if="_moment(item.date).isValid()">
            <div style="margin-left:20px">
              <span style="font-size:10px">于</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{_moment(item.date).format("YYYY-MM-DD")}}</span>
              <span style="font-size:10px">确诊</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{item.type}}</span>
            </div>
          </div>
          <div v-else style="margin-left:20px;font-size:10px">暂无</div>
        </div>
        <!-- 手术-->
        <div v-if="pastMedicalHistorySurgery && pastMedicalHistorySurgery.length > 0">
          <span style="font-weight:bold;font-size:16px">手术</span>
          <div v-for="(item, index) in pastMedicalHistorySurgery" :key="index" v-if="_moment(item.date).isValid()">
            <div style="margin-left:20px">
              <span style="font-size:10px">于</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{_moment(item.date).format("YYYY-MM-DD")}}</span>
              <span style="font-size:10px">进行手术</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{item.name || '未知'}}</span>
            </div>
          </div>
          <div v-else style="margin-left:20px;font-size:10px">暂无</div>
        </div>
        <!-- 外伤-->
        <div v-if="pastMedicalHistoryTrauma && pastMedicalHistoryTrauma.length > 0">
          <span style="font-weight:bold;font-size:16px">外伤</span>
          <div v-for="(item, index) in pastMedicalHistoryTrauma" :key="index" v-if="_moment(item.date).isValid()">
            <div style="margin-left:20px">
              <span style="font-size:10px">于</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{_moment(item.date).format("YYYY-MM-DD")}}</span>
              <span style="font-size:10px"></span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{item.name || '未知'}}</span>
            </div>
          </div>
          <div v-else style="margin-left:20px;font-size:10px">暂无</div>
        </div>
        <!-- 输血 pastMedicalHistoryBloodTransfusion -->
        <div v-if="pastMedicalHistoryBloodTransfusion && pastMedicalHistoryBloodTransfusion.length > 0">
          <span style="font-weight:bold;font-size:16px">输血</span>
          <div v-for="(item, index) in pastMedicalHistoryBloodTransfusion" :key="index" v-if="_moment(item.date).isValid()">
            <div style="margin-left:20px">
              <span style="font-size:10px">于</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{_moment(item.date).format("YYYY-MM-DD")}}</span>
              <span style="font-size:10px">进行输血，输血原因：</span>
              <span style="margin:5px;font-weight:bold;font-size:16px">{{item.reason || '未知'}}</span>
            </div>
          </div>
          <div v-else style="margin-left:20px;font-size:10px">暂无</div>
        </div>
      </div>
      <div class="bs-callout-small bs-callout-primary">
        <h4>家族史 </h4>
      </div>
      <div>
        <div >
          <div style="margin-left:20px" v-for="(item,index) in familyMedicalHistoryFields" :key="index" v-if="getFieldValue(item.field).length > 0" >
              <span  style="font-size:16px;font-weight:bold;">{{item.name}}</span>
              <span  style="margin:5px;font-size:10px">患有</span>
              <span style="margin:5px;font-weight:bold;font-size:16px" >
                {{dictFormatter({value:getFieldValue(item.field)})}}
              </span>
          </div>
          <div v-else style="margin-left:20px">
            <span style="font-size:10px"> <span  style="font-size:16px;font-weight:bold;margin-right:10px">{{item.name}}</span>暂无疾病史</span>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import { backMixin } from '@/mixin/back-mixin'
import LegaWordView from '@/components/LegaWordView'
import IdCardInfo from './IdCardInfo'
import printJS from 'print-js'
import {
  cssText
} from './infoBasePrintCss.js'
export default {
  mixins: [backMixin],
  props: {
    showBtns: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    LegaWordView,
    IdCardInfo
  },
  data: function () {
    return {
      targetRoute: {
        name: 'residentList'
      },
      residentFormContent: {
        formItemData: [
          [{
            label: '姓名',
            prop: 'name',
            span: '8'
          },
          {
            label: '档案编号',
            prop: 'profileNumber',
            span: '16'
          }
          ],
          [{
            label: '性别',
            prop: 'gender',
            span: '8',
            formatter: value => {
              return this.dictFormatter('gender', value)
            }
          },
          {
            label: '出生日期',
            prop: 'birthday',
            span: '16',
            formatter: value => {
              if (this._moment(value).isValid()) {
                return this._moment(value).format('YYYY-MM-DD')
              }
              return '未知'
            }
          }
          ],
          [{
            label: '身份证号',
            prop: 'idNumber'
          },
          {
            label: '工作单位',
            prop: 'workUnit'
          }
          ],
          [{
            label: '本人电话',
            prop: 'telephone'
          }],
          [{
            label: '联系人姓名',
            prop: 'contactName'
          },
          {
            label: '联系人电话',
            prop: 'contactPhone'
          }
          ],
          [{
            label: '常住类型',
            prop: 'residentType',
            formatter: value => {
              return this.dictFormatter('residentType', value)
            }
          },
          {
            label: '民族',
            prop: 'nationality',
            formatter: value => {
              return this.dictFormatter('nationality', value)
            }
          }
          ],
          [{
            label: '血型',
            prop: 'bloodType',
            formatter: (value, formData) => {
              return (
                this.dictFormatter(
                  'bloodTypeAbo',
                  formData.bloodTypeAbo || ''
                ) +
                '/ ' +
                this.dictFormatter('bloodTypeRh', formData.bloodTypeRh || '')
              )
            }
          }],
          [{
            label: '文化程度',
            prop: 'educationLevel',
            formatter: value => {
              return this.dictFormatter('educationLevel', value)
            }
          },
          {
            label: '婚姻状态',
            prop: 'marriage',
            formatter: value => {
              return this.dictFormatter('marriage', value)
            }
          }
          ],
          [{
            label: '医疗费用支付方式',
            prop: 'paymentMode',
            render: (h, params) => {
              var value = params.value.paymentMode
              const str = this.dictFormatter('paymentMode', {
                value,
                split: '/'
              })
              return (
                <span > {str} </span>
              )
            }
          }],
          [{
            label: '药物过敏史',
            prop: 'drugAllergy',
            formatter: value => {
              return this.dictFormatter('drugAllergy', {
                value,
                split: '/'
              })
            }
          }],
          [{
            label: '暴露史',
            prop: 'exposed',
            formatter: value => {
              return this.dictFormatter('exposed', {
                value,
                split: '/'
              })
            }
          }]
        ],
        formData: {}
      },
      familyMedicalHistoryFields: [
        {
          field: 'familyMedicalHistoryFather',
          name: '父亲'
        },
        {
          field: 'familyMedicalHistoryFather',
          name: '母亲'
        },
        {
          field: 'familyMedicalHistoryFather',
          name: '兄弟'
        },
        {
          field: 'familyMedicalHistoryFather',
          name: '子女'
        }
      ]
    }
  },
  mounted() {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    if (!this._.isNil(this.value)) {
      this.init()
    }
  },
  computed: {
    ...mapGetters(['dictFormatter']),
    pastMedicalHistoryDisease() {
      return this.getFieldValue('pastMedicalHistoryDisease')
    },
    pastMedicalHistoryTrauma() {
      return this.getFieldValue('pastMedicalHistoryTrauma')
    },
    pastMedicalHistorySurgery() {
      return this.getFieldValue('pastMedicalHistorySurgery')
    },
    pastMedicalHistoryBloodTransfusion() {
      return this.getFieldValue('pastMedicalHistoryBloodTransfusion')
    }
  },
  methods: {
    getFieldValue(field) {
      const val = (this.value || {})[field]
      if (val && this._.isArray(val)) {
        return val
      }
      if (this._.isString(val)) {
        try {
          return JSON.parse(val)
        } catch (e) {
        }
      }
      return []
    },
    init() {
      this.residentFormContent.formData = Object.assign({}, this.value)
    },
    printClick() {
      printJS({
        printable: 'info-base-wordview',
        type: 'html',
        style: cssText,
        scanStyles: false
      })
    }
  },
  watch: {
    value(newVal) {
      console.log(newVal)
      if (!this._.isEmpty(newVal)) {
        this.init()
      }
    }
  }
}
</script>
