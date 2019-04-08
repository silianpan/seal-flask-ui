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
    birthRegistrationInfo: Object
  },
  components: {
    LegaWordView
  },
  data() {
    return {
      formItemData: [
        // [
        //   {
        //     type: 'title',
        //     label: '新生儿家庭访视记录表',
        //     textStyle: {
        //       'font-size': '1.4em'
        //     }
        //   }
        // ],
        [{
          label: '姓名',
          prop: 'name',
          span: '12'
        },
        {
          label: '档案编号',
          prop: 'profile_number',
          span: '12'
        }
        ],
        [{
          label: '性别',
          prop: 'gender',
          span: '12',
          formatter: (value) => this.dictFormatter('gender', value)
        },
        {
          label: '出生日期',
          prop: 'birthday',
          span: '12',
          formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
        }
        ],
        [
          {
            label: '身份证号',
            prop: 'id_number',
            span: '12'
          },
          {
            label: '家庭住址',
            prop: 'current_address',
            span: '12'
          }
        ],
        [{
          label: '父亲',
          prop: 'father_name',
          span: '6'
        },
        {
          label: '职业',
          prop: 'father_career',
          span: '6'
        },
        {
          label: '联系电话',
          prop: 'father_phone',
          span: '6'
        },
        {
          label: '出生日期',
          prop: 'father_birthday',
          span: '6',
          formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
        }
        ],
        [{
          label: '母亲',
          prop: 'mather_name',
          span: '6'
        },
        {
          label: '职业',
          prop: 'mather_career',
          span: '6'
        },
        {
          label: '联系电话',
          prop: 'mather_phone',
          span: '6'
        },
        {
          label: '出生日期',
          prop: 'mather_birthday',
          span: '6',
          formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
        }
        ],
        [{
          label: '出生孕周',
          prop: 'gestational_week',
          span: '6',
          formatter: (value) => `${value || ''} 周 `
        },
        {
          label: '母亲妊娠期患病情况',
          labelWidth: 200,
          prop: 'condition_of_pregnancy',
          span: '18',
          formatter: this.formatArrayStr()
        }
        ],
        [{
          label: '助产机构名称',
          labelWidth: 200,
          prop: 'midwifery_hospital',
          span: '12'
        },
        {
          label: '出生情况',
          prop: 'birth_condition',
          span: '12',
          formatter: this.formatArrayStr()
        }
        ],
        [{
          label: '新生儿窒息',
          labelWidth: 200,
          prop: 'asphyxia_neonatorum',
          span: '12'
        },
        {
          label: '畸形',
          prop: 'deformity',
          span: '12',
          formatter: this.formatArrayStr()
        }
        ],
        [{
          label: '新生儿听力筛查',
          labelWidth: 200,
          prop: 'unhs',
          span: '24',
          formatter: this.formatArrayStr()
        }],
        [{
          label: '新生儿疾病筛查',
          labelWidth: 200,
          prop: 'neonatal_screening',
          span: '24',
          formatter: this.formatArrayStr()
        }],
        [{
          label: '新生儿出生体重',
          labelWidth: 200,
          prop: 'birth_weight',
          span: '12',
          formatter: (value) => `${value || ''} kg `
        },
        {
          label: '目前体重',
          prop: 'current_weight',
          span: '6',
          formatter: (value) => `${value || ''} kg `
        },
        {
          label: '出生身长',
          prop: 'birth_height',
          span: '6',
          formatter: (value) => `${value || ''} cm `
        }
        ],
        [{
          label: '喂养方式',
          labelWidth: 200,
          prop: 'feeding',
          span: '12'
        },
        {
          label: '吃奶量',
          prop: 'amount_of_milk',
          span: '6',
          formatter: (value) => `${value || ''} mL/次 `
        },
        {
          label: '吃奶次数',
          prop: 'feeding_times',
          span: '6',
          formatter: (value) => `${value || ''} 次/日 `
        }
        ],
        [{
          label: '呕吐',
          prop: 'vomit',
          span: '12'
        },
        {
          label: '大便',
          prop: 'shape_of_stool',
          span: '6',
          formatter: this.formatArrayStr()
        },
        {
          label: '大便次数',
          prop: 'times_of_stool',
          span: '6',
          formatter: (value) => `${value || ''} 次/日 `
        }
        ],
        [{
          label: '体温',
          prop: 'temperature',
          span: '12',
          formatter: (value) => `${value || ''} ℃ `
        },
        {
          label: '心率',
          prop: 'heart_rate',
          span: '6',
          formatter: (value) => `${value || ''} 次/分 `
        },
        {
          label: '呼吸频率',
          prop: 'breathing_rate',
          span: '6',
          formatter: (value) => `${value || ''} 次/分 `
        }
        ],
        [{
          label: '面色',
          prop: 'face_color',
          span: '12',
          formatter: this.formatArrayStr()
        },
        {
          label: '黄疸部位',
          prop: 'location_of_jaundice',
          span: '12',
          formatter: this.formatArrayStr()
        }
        ],
        [{
          label: '前囟',
          prop: 'bregma',
          formatter: this.formatArrayStr()
        }],
        [{
          label: '眼睛',
          prop: 'eyes',
          span: '12'
        },
        {
          label: '四肢活动度',
          prop: 'limbs_activity',
          span: '12'
        }
        ],
        [{
          label: '耳外观',
          prop: 'ears',
          span: '12'
        },
        {
          label: '颈部包块',
          prop: 'neck_masses',
          span: '12'
        }
        ],
        [{
          label: '鼻',
          prop: 'nose',
          span: '12'
        },
        {
          label: '皮肤',
          prop: 'skin',
          span: '12'
        }
        ],
        [{
          label: '口腔',
          prop: 'mouth',
          span: '12'
        },
        {
          label: '肛门',
          prop: 'anus',
          span: '12'
        }
        ],
        [{
          label: '心肺听诊',
          prop: 'cardiopulmonary_auscultation',
          span: '12'
        },
        {
          label: '胸部',
          prop: 'chest',
          span: '12'
        }
        ],
        [{
          label: '腹部触诊',
          prop: 'abdominal_palpation',
          span: '12'
        },
        {
          label: '脊柱',
          prop: 'spine',
          span: '12'
        }
        ],
        [{
          label: '外生殖器',
          prop: 'external_genitals'
        }],
        [{
          label: '脐带',
          prop: 'umbilical_cord'
        }],
        [{
          label: '指导',
          prop: 'advice',
          formatter: this.formatArrayStr()
        }],
        [{
          label: '本次访视日期',
          prop: 'visit_date',
          formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
        },
        {
          label: '下次随访日期',
          prop: 'next_visit_date',
          formatter: (value) => this.formatUTC(value, 'YYYY-MM-DD')
        }
        ]
      ],
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
        return _v.join(split)
      }
    }
  },
  mounted: function () {
    this.formData = { ...this.birthRegistrationInfo }
  },
  computed: {
    ...mapGetters(['dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
