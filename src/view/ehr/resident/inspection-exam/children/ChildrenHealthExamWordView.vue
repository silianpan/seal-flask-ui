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
  mapGetters
} from 'vuex'
export default {
  props: {
    childrenHealthExamInfo: Object
  },
  components: {
    LegaWordView
  },
  data() {
    return {
      formData: {
      }
    }
  },
  methods: {
    formatUTC: function(value, format) {
      if (this._moment(value || '').isValid()) {
        return this._moment(value).format(format || 'YYYY-MM-DD')
      }
      return '未知'
    },
    // 格式化数组字符串
    formatArrayStr: function (split = ',') {
      return (value) => {
        let _v
        try {
          _v = JSON.parse(value) || []
        } catch (e) {
          _v = []
        }
        if (!this._.isArray(_v)) {
          _v = [_v]
        }
        return _v.join(split)
      }
    }
  },
  mounted: function () {
    this.formData = { ...this.childrenHealthExamInfo }
  },
  computed: {
    ...mapGetters(['dictDatasWithGroupKey', 'dictFormatter']),
    formItemData() {
      let _formItemData = [
        // [
        //   {
        //     type: 'title',
        //     label: `${this.monthAge}月龄儿童健康检查记录表`,
        //     textStyle: {
        //       'font-size': '1.4em'
        //     }
        //   }
        // ],
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
            label: '月（年）龄',
            prop: 'monthly',
            labelWidth: 120,
            formatter: (value) => `${value || ''} 个月`
          }
        ],
        [
          {
            label: '随访日期',
            labelWidth: 120,
            prop: 'visit_date',
            formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
          }
        ],
        [
          {
            label: '体重/kg',
            labelWidth: 120,
            prop: 'weight',
            formatter: (value) => `${value || ''} kg `
          }
        ],
        [

          {
            label: '身高/cm',
            labelWidth: 120,
            prop: 'height',
            formatter: (value) => `${value || ''} cm `
          }
        ],
        [
          {
            label: '头围/cm',
            labelWidth: 120,
            prop: 'head_circumference',
            formatter: (value) => `${value || ''} cm `
          }
        ]
      ]
      // 体格检查项
      _formItemData = _formItemData.concat(this.physicalExamItems)
      const otherItems = [
        [
          {
            label: '户外活动',
            prop: 'outdoor_activities',
            labelWidth: 120,
            formatter: (value) => `${value || ''} 小时/日 `
          }
        ],
        [
          {
            label: '复用维生素D',
            prop: 'vd',
            labelWidth: 120,
            formatter: (value) => `${value || ''} IU/日 `
          }
        ],
        [
          {
            label: '发育评估',
            labelWidth: 120,
            prop: 'development_assessment',
            formatter: this.formatArrayStr()
          }
        ],
        [
          {
            label: '指导',
            labelWidth: 120,
            prop: 'head_circumference',
            formatter: this.formatArrayStr()
          }
        ],
        [
          {
            label: '下次随访日期',
            labelWidth: 120,
            prop: 'next_visit',
            formatter: (value) => {
              if (value) {
                return this.formatUTC(value, 'YYYY-MM-DD')
              }
              return ''
            }
          }
        ]
      ]
      _formItemData = _formItemData.concat(otherItems)

      return _formItemData
    },
    childrenExamItems12_36() {
      return [
        [
          {
            label: '面色',
            labelWidth: 120,
            prop: 'face_color'
          }
        ],
        [
          {
            label: '皮肤',
            labelWidth: 120,
            prop: 'skin'
          }
        ],
        [
          {
            label: '前囟',
            labelWidth: 120,
            prop: 'bregma'
          }
        ],
        [
          {
            label: '眼睛',
            labelWidth: 120,
            prop: 'eyes'
          }
        ],
        [
          {
            label: '耳外观',
            labelWidth: 120,
            prop: 'ears'
          }
        ],
        [
          {
            label: '听力',
            labelWidth: 120,
            prop: 'hearing'
          }
        ],
        [
          {
            label: '出牙/龋齿数(颗)',
            labelWidth: 120,
            prop: 'mouth'
          }
        ],
        [
          {
            label: '胸部',
            labelWidth: 120,
            prop: 'chest'
          }
        ],
        [
          {
            label: '腹部',
            labelWidth: 120,
            prop: 'abdomen'
          }
        ],
        [
          {
            label: '四肢',
            labelWidth: 120,
            prop: 'limbs_activity'
          }
        ],
        [
          {
            label: '步态',
            labelWidth: 120,
            prop: '22'
          }
        ],
        [
          {
            label: '可疑佝偻病体征',
            labelWidth: 120,
            prop: 'signs_of_suspected_rickets',
            formatter: this.formatArrayStr()
          }
        ],
        [
          {
            label: '血红蛋白值',
            labelWidth: 120,
            prop: 'hemoglobin',
            formatter: (val) => `${val} g/L`
          }
        ]
      ]
    },
    childrenExamItems1_12() {
      return [
        [
          {
            label: '面色',
            labelWidth: 120,
            prop: 'face_color'
          }
        ],
        [
          {
            label: '皮肤',
            labelWidth: 120,
            prop: 'skin'
          }
        ],
        [
          {
            label: '前囟',
            labelWidth: 120,
            prop: 'bregma'
          }
        ],
        [
          {
            label: '眼睛',
            labelWidth: 120,
            prop: 'eyes'
          }
        ],
        [
          {
            label: '耳外观',
            labelWidth: 120,
            prop: 'ears'
          }
        ],
        [
          {
            label: '听力',
            labelWidth: 120,
            prop: 'hearing'
          }
        ],
        [
          {
            label: '口腔',
            labelWidth: 120,
            prop: 'mouth'
          }
        ],
        [
          {
            label: '胸部',
            labelWidth: 120,
            prop: 'chest'
          }
        ],
        [
          {
            label: '腹部',
            labelWidth: 120,
            prop: 'abdomen'
          }
        ],
        [
          {
            label: '脐部',
            labelWidth: 120,
            prop: 'umbilical_cord'
          }
        ],
        [
          {
            label: '四肢',
            labelWidth: 120,
            prop: 'limbs_activity'
          }
        ],
        [
          {
            label: '可疑佝偻病体征',
            labelWidth: 120,
            prop: 'signs_of_suspected_rickets',
            formatter: this.formatArrayStr()
          }
        ],
        [
          {
            label: '肛门',
            labelWidth: 120,
            prop: 'anus'
          }
        ],
        [
          {
            label: '外生殖器',
            labelWidth: 120,
            prop: 'external_genitals'
          }
        ],
        [
          {
            label: '血红蛋白值',
            labelWidth: 120,
            prop: 'hemoglobin',
            formatter: (val) => `${val || ''} g/L`
          }
        ]
      ]
    },
    childrenExamItems36_72() {
      return [
        [
          {
            label: '视力',
            labelWidth: 120,
            prop: 'eyes'
          }
        ],
        [
          {
            label: '听力',
            labelWidth: 120,
            prop: 'hearing'
          }
        ],
        [
          {
            label: '牙数(颗)/龋齿数',
            labelWidth: 120,
            prop: 'next_visit'
          }
        ],
        [
          {
            label: '胸部',
            labelWidth: 120,
            prop: 'chest'
          }
        ],
        [
          {
            label: '腹部',
            labelWidth: 120,
            prop: 'abdomen'
          }
        ],
        [
          {
            label: '血红蛋白值',
            labelWidth: 120,
            prop: 'hemoglobin',
            formatter: (val) => `${val} g/L`
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
    },
    // 体格检查项
    physicalExamItems() {
      let _items
      let _lh = 30
      if (this.monthAge < 12) {
        _items = this.childrenExamItems1_12
      } else if (this.monthAge < 36) {
        _lh = 26
        _items = this.childrenExamItems12_36
      } else {
        _items = this.childrenExamItems36_72
        _lh = 13.5
      }
      return [
        [
          {
            label: '体格检查',
            labelWidth: 120,
            lineHeight: (_items[0].length * _lh),
            prop: 'physicalExamItems',
            children: _items
          }
        ]
      ]
    },
    // 月龄
    monthAge() {
      if (this.formData.monthly) {
        return this.formData.monthly
      }
      return 1
    }
  }
}
</script>

<style  scoped>
</style>
