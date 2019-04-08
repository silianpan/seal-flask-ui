<!--  -->
<template>
<div >
  <Card :bordered="false" dis-hover>
    <LegaWordView :formItemData="formItemData" :formData="formData"></LegaWordView>
  </Card>
</div>
</template>

<script>
import LegaWordView from '@/components/LegaWordView'
import {
  parseSplitFields
} from '@/libs/tools'
import {
  mapGetters
} from 'vuex'
const DiseaseTypeEnums = {
  Hypertension: '1',
  Diabetes: '2'
}
const MergeFieldsConfig = {
  symptom: ['symptom'],
  // 体征
  sign: [
    // 血压
    'BP',
    // 身高
    'H',
    // 体重
    'W',
    // 体质指数(BMI)
    'BMI',
    // 心率
    'HR',
    // 足背动脉搏动 情况
    'dorsalis_pedis_status',
    // 足背动脉搏动 区域
    'dorsalis_pedis_area',
    // 其他
    'other'
  ],
  // 生活指导方式
  life_way_adice: [
    // 日吸烟量
    'day_smoking_volume',
    // 日饮酒量
    'day_drinking_volume',
    // 运动频率 次/周
    'motion_frequency_week',
    // 运动时间 次/分钟
    'motion_frequency_minute',
    'food',
    // 心理调整
    'psychological_recovery',
    // 摄盐情况
    'salt_uptake',
    //  遵医行为
    'compliance_behavior'
    //
  ]
}
export default {
  props: {
    // 展示按钮
    title: String,
    // 疾病类型
    diseaseType: String,
    /** 数据 */
    data: Object
  },
  components: {
    LegaWordView
  },
  data() {
    return {
      sourceRoute: null,
      /** 高血压 */
      hypertensionViewItem: {
        sign: [
          {
            label: '体征',
            labelWidth: 120,
            lineHeight: '155px',
            prop: 'head_circumference',
            children: [
              [
                {
                  label: '血压',
                  labelWidth: 120,
                  prop: 'BP',
                  formatter: (value) => {
                    if (value) {
                      return `${value} mmmHg`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '体重',
                  labelWidth: 120,
                  prop: 'W',
                  formatter: (value) => {
                    if (value) {
                      return `${value} (kg)`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '体质指数(BMI)',
                  labelWidth: 120,
                  prop: 'BMI',
                  formatter: (value) => {
                    if (value) {
                      return `${value} kg/m²`
                    }
                    return '✘'
                  }
                }
              ],

              [
                {
                  label: '心率(次/分钟)',
                  labelWidth: 120,
                  prop: 'HR',
                  formatter: (value) => {
                    if (value) {
                      return `${value} 次/分钟`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '其他',
                  labelWidth: 120,
                  prop: 'other'
                }
              ]
            ]
          }
        ],
        life_way_adice: [
          {
            label: '生活方式指导',
            labelWidth: 120,
            lineHeight: '190px',
            children:
            [
              [
                {
                  label: '日吸烟量(支)',
                  labelWidth: 120,
                  prop: 'day_smoking_volume',
                  formatter: (value) => {
                    if (value) {
                      return `${value} 支`
                    }
                    return '✘'
                  }
                }
              ],
              [

                {
                  label: '日饮酒量(两)',
                  labelWidth: 120,
                  prop: 'day_drinking_volume',
                  formatter: (value) => {
                    if (value) {
                      return `${value} 两`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '运动',
                  labelWidth: 120,
                  //  motion_frequency_week 、motion_frequency_minute
                  prop: 'motion_frequency',
                  formatter: (value) => {
                    let str = ''
                    if (this.formData.motion_frequency_week) {
                      str += `${this.formData.motion_frequency_week}次/周`
                    }
                    if (this.formData.motion_frequency_minute) {
                      str += `   ${this.formData.motion_frequency_minute}分钟/次`
                    }
                    return str
                  }
                }
              ],
              [
                {
                  label: '摄盐情况(咸淡)',
                  labelWidth: 120,
                  prop: 'salt_uptake'
                }
              ],
              [
                {
                  label: '心理调整',
                  labelWidth: 120,
                  prop: 'psychological_recovery'

                }
              ],
              [
                {
                  label: '遵医行为',
                  labelWidth: 120,
                  prop: 'compliance_behavior'
                }
              ]

            ]
          }
        ]
      },
      /** Ⅱ型糖尿病  */
      diabetesViewItem: {
        sign: [
          {
            label: '体征',
            labelWidth: 120,
            prop: 'head_circumference',
            lineHeight: '154px',
            children: [
              [
                {
                  label: '血压',
                  labelWidth: 120,
                  prop: 'BP',
                  formatter: (value) => {
                    if (value) {
                      return `${value} mmmHg`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '体重',
                  labelWidth: 120,
                  prop: 'W',
                  formatter: (value) => {
                    if (value) {
                      return `${value} kg`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '体质指数(BMI)',
                  labelWidth: 120,
                  prop: 'BMI',
                  formatter: (value) => {
                    if (value) {
                      return `${value} kg/m²`
                    }
                    return '✘'
                  }
                }
              ],

              [
                {
                  label: '足背动脉搏动',
                  labelWidth: 120,
                  prop: 'dorsalis_pedis',
                  formatter: (value) => {
                    if (this.formData.dorsalis_pedis_status) {
                      return `${this.formData.dorsalis_pedis_status}（${this.formData.dorsalis_pedis_area || ''}）`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '其他',
                  labelWidth: 120,
                  prop: 'other'
                }
              ]
            ]
          }
        ],
        life_way_adice: [
          {
            label: '生活方式指导',
            labelWidth: 120,
            lineHeight: '225px',
            children:
            [
              [
                {
                  label: '日吸烟量(支)',
                  labelWidth: 120,
                  prop: 'day_smoking_volume',
                  formatter: (value) => {
                    if (value) {
                      return `${value} (支)`
                    }
                    return '✘'
                  }
                }
              ],
              [

                {
                  label: '日饮酒量(两)',
                  labelWidth: 120,
                  prop: 'day_drinking_volume',
                  formatter: (value) => {
                    if (value) {
                      return `${value} (两)`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '运动',
                  labelWidth: 120,
                  //  motion_frequency_week 、motion_frequency_minute
                  prop: 'motion_frequency',
                  formatter: (value) => {
                    let str = ''
                    if (this.formData.motion_frequency_week) {
                      str += `${this.formData.motion_frequency_week}次/周`
                    }
                    if (this.formData.motion_frequency_minute) {
                      str += `   ${this.formData.motion_frequency_minute}分钟/次`
                    }
                    return str
                  }
                }
              ],
              [
                {
                  label: '主食（克/天）',
                  labelWidth: 120,
                  prop: 'food',
                  formatter: (value) => {
                    if (value) {
                      return `${value} 克/天`
                    }
                    return '✘'
                  }
                }
              ],
              [
                {
                  label: '摄盐情况(咸淡)',
                  labelWidth: 120,
                  prop: 'salt_uptake'
                }
              ],
              [
                {
                  label: '心理调整',
                  labelWidth: 120,
                  prop: 'psychological_recovery'

                }
              ],
              [
                {
                  label: '遵医行为',
                  labelWidth: 120,
                  prop: 'compliance_behavior'
                }
              ]

            ]
          }
        ]
      },
      formData: {
      }
    }
  },
  methods: {
    dateFormatter: function(value) {
      if (this._moment(value).isValid()) {
        return this._moment(value).format('YYYY-MM-DD')
      }
      return '未知'
    },
    setFormDatas(data) {
      this.formData = this._.defaultsDeep({}, data)
    },
    initForm() {
      let data = { ...this.data }
      let d = parseSplitFields(MergeFieldsConfig, data)
      this.setFormDatas({ ...data, ...d })
    }
  },
  mounted: function () {
    this.initForm()
  },
  computed: {
    ...mapGetters(['dictDatasWithGroupKey', 'dictFormatter']),
    formItemData() {
      // 体征信息
      let sign = []
      let lifeWayAdice = []
      // 糖尿病 or 高血压
      if (this.diseaseType === DiseaseTypeEnums.Hypertension) {
        sign = this.hypertensionViewItem.sign
        lifeWayAdice = this.hypertensionViewItem.life_way_adice
      } else {
        sign = this.diabetesViewItem.sign
        lifeWayAdice = this.diabetesViewItem.life_way_adice
      }
      let _formItemData = [
        [
          {
            type: 'title',
            label: `${this.title}`,
            textStyle: {
              'font-size': '1.4em'
            }
          }
        ],
        [
          {
            label: '姓名',
            prop: 'name',
            labelWidth: 120,
            span: '12'
          },
          {
            label: '档案编号',
            labelWidth: 120,
            prop: 'profile_number',
            span: '12'
          }
        ],
        [
          {
            label: '随访日期',
            labelWidth: 120,
            prop: 'visit_date',
            formatter: this.dateFormatter
          }
        ],
        [
          {
            label: '随访方式',
            labelWidth: 120,
            prop: 'visit_way'
          }
        ],
        [
          {
            label: '病症',
            labelWidth: 120,
            prop: 'symptom',
            formatter: (value) => (value || []).join(',')
          }
        ],
        ...[sign],

        ...[lifeWayAdice],
        [
          {
            label: '辅助检查*',
            labelWidth: 120,
            prop: 'accessory_exam'
          }
        ],
        [
          {
            label: '服药依从性',
            labelWidth: 120,
            prop: 'drug_compliance'
          }
        ],
        [
          {
            label: '药物不良反应',
            labelWidth: 120,
            prop: 'drug_adverse_reaction'
          }
        ],
        [
          {
            label: '用药情况',
            labelWidth: 120,
            prop: 'medication'
          }
        ],
        [
          {
            label: '此次随访分类',
            labelWidth: 120,
            prop: 'follow_up_type'
          }
        ],
        [
          {
            label: '下次随访日期',
            labelWidth: 120,
            prop: 'next_visit_date',
            formatter: this.dateFormatter
          }
        ]

      ]
      return _formItemData
    }
  }
}
</script>

<style  scoped>
</style>
