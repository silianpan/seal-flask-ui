<template>
  <div>
     <div class="bs-callout-small bs-callout-primary">
        <h4>{{title}}</h4>
    </div>
    <Spin fix size="large" v-if="loading"></Spin>
    <div v-if="this.firstCheckFormContent.formData">
      <LegaWordView :formItemData="firstCheckFormContent.formItemData" :formData="firstCheckFormContent.formData"></LegaWordView>
    </div>
     <div v-else style="text-align:center">
        暂无检查记录
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LegaWordView from '@/components/LegaWordView'
import { formatUTC, parseSplitFields } from '@/libs/tools'
const needJson = {
  'blood_routine': ['hemoglobin', 'leukocyte', 'platelet', 'blood_other'], // 血常规
  'urine_routine': ['urine_protein', 'urine_sugar', 'urine_acetone_bodies', 'bld', 'urine_other'], // 尿常规
  'fasting_glucose': ['fasting_glucose_num', 'fasting_glucose_unit'], // 空腹血糖
  'liver_function': ['ALT', 'SGOT', 'albumin', 'total_bilirubin', 'conjugated_bilirubin'], // 肝功能
  'renal_function': ['serum_creatinine', 'blood_urea', 'serum_potassium', 'serum_sodium'], // 肾功能
  'advice': ['advice'] // 指导
}
export default {
  components: {
    LegaWordView
  },
  props: {
    // 孕次信息（包含孕次及检查机构）
    title: String,
    gestationalInfo: Object,
    queryDataAction: Function
  },
  data() {
    return {
      loading: false,
      firstCheckFormContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '第一次产前检查服务记录表'
            }
          ],
          [
            {
              label: '姓名',
              prop: 'name'
            },
            {
              label: '性别',
              prop: 'gender',
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('gender', value)
              }
            },
            {
              label: '档案编号',
              prop: 'profile_number'
            }
          ],
          [
            {
              label: '身份证号',
              prop: 'id_number'
            },
            {
              label: '出生',
              prop: 'birthday',
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              label: '民族',
              prop: 'nationality',
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('nationality', value)
              }
            }
          ],
          [
            {
              label: '婚否',
              prop: 'marriage',
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('marriage', value)
              }
            },
            {
              label: '检查日期',
              prop: 'exam_date',
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              label: '孕周',
              prop: 'gestational_week'
            }
          ],
          [
            {
              label: '孕妇年龄',
              prop: 'age'
            }
          ],
          [
            {
              label: '丈夫姓名',
              prop: 'husband_name'
            },
            {
              label: '丈夫年龄',
              prop: 'husband_age'
            },
            {
              label: '丈夫电话',
              prop: 'husband_phone'
            }
          ],
          [
            {
              label: '孕次',
              prop: 'gestational_times',
              span: '8'
            },
            {
              label: '产次',
              prop: 'parity',
              span: '16'
            }
          ],
          [
            {
              prop: 'lmp',
              label: '末次月经',
              span: '8',
              formatter: value => {
                return this._.isNil(value) ? '' : formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              prop: 'edc',
              label: '预产期',
              span: '16',
              formatter: value => {
                return this._.isNil(value) ? '' : formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              prop: 'past_medical_history_disease',
              label: '既往史',
              formatter: value => {
                try {
                  value = JSON.parse(value)
                  let str = ''
                  for (let item of value) {
                    str += formatUTC(item.date, 'YYYY-MM-DD') + ':' + this.dictFormatter('pastMedicalHistoryDisease', item.type) + ','
                  }
                  str = str.substring(0, str.length - 1)
                  return str
                } catch (e) {}
              }
            }
          ],
          [
            {
              prop: 'genetic_disease',
              label: '家族史'
            }
          ],
          [
            {
              prop: 'exposed',
              label: '个人史(接触)',
              formatter: value => {
                try {
                  value = JSON.parse(value)
                  return this.dictFormatter('exposed', {
                    value: value,
                    split: ','
                  })
                } catch (e) {}
              }
            }
          ],
          [
            {
              prop: 'history_of_gynecologic_surgery',
              label: '妇产科手术史'
            }
          ],
          [
            {
              prop: 'history_of_pregnancy',
              label: '孕产史'
            }
          ],
          [
            {
              prop: 'height',
              label: '身高',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            },
            {
              prop: 'weight',
              label: '体重',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(kg)'
              }
            }
          ],
          [
            {
              prop: 'height',
              label: '体质指数',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(kg/m²)'
              }
            },
            {
              prop: 'blood_pressure',
              label: '血压',
              formatter: (value, formData) => {
                let a = this._.isNil(formData.systolic_pressure) ? '' : formData.systolic_pressure
                let b = this._.isNil(formData.diastolic_pressure) ? '' : formData.diastolic_pressure
                return a + '/' + b + '(mmHg)'
              }
            }
          ],
          [
            {
              prop: 'heart',
              label: '心脏'
            },
            {
              prop: 'lung',
              label: '肺'
            }
          ],
          [
            {
              label: '妇科',
              prop: 'fuke',
              lineHeight: '154px',
              children: [
                [
                  {
                    label: '外阴',
                    prop: 'vulva'
                  }
                ],
                [
                  {
                    label: '阴道',
                    prop: 'vagina'
                  }
                ],
                [
                  {
                    label: '宫颈',
                    prop: 'cervix'
                  }
                ],
                [
                  {
                    label: '宫体',
                    prop: 'corpus_uteri'
                  }
                ],
                [
                  {
                    label: '附件',
                    prop: 'adnexa'
                  }
                ]
              ]
            }
          ],
          [
            {
              label: '辅助检查',
              prop: 'fuzhu',
              lineHeight: '574px',
              children: [
                [
                  {
                    label: '血常规',
                    prop: 'xuechanggui',
                    children: [
                      [
                        {
                          label: '血红蛋白',
                          prop: 'hemoglobin',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(g/L)'
                          }
                        },
                        {
                          label: '白细胞',
                          prop: 'leukocyte',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '×10⁹/L'
                          }
                        },
                        {
                          label: '血小板',
                          prop: 'platelet',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '×10⁹/L'
                          }
                        },
                        {
                          label: '其他',
                          prop: 'blood_other',
                          lineHeight: '28px'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '尿常规',
                    prop: 'niaochanggui',
                    children: [
                      [
                        {
                          label: '尿蛋白',
                          prop: 'urine_protein'
                        },
                        {
                          label: '尿糖',
                          prop: 'urine_sugar'
                        },
                        {
                          label: '尿酮体',
                          prop: 'urine_acetone_bodies'
                        },
                        {
                          label: '尿潜血',
                          prop: 'bld'
                        }
                      ],
                      [
                        {
                          label: '其他',
                          prop: 'urine_other',
                          lineHeight: '21px'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '血型',
                    prop: 'xuexing',
                    children: [
                      [
                        {
                          label: 'ABO',
                          prop: 'blood_type_abo',
                          formatter: value => {
                            return this.dictFormatter('bloodTypeAbo', value)
                          }
                        }
                      ],
                      [
                        {
                          label: 'Rh',
                          prop: 'blood_type_rh',
                          lineHeight: '21px',
                          formatter: value => {
                            return this.dictFormatter('bloodTypeRh', value)
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '空腹血糖',
                    prop: 'fasting_glucose',
                    formatter: (value, formData) => {
                      let str = ''
                      if (!this._.isNil(formData.fasting_glucose_num) && !this._.isNil(formData.fasting_glucose_num)) {
                        str = formData.fasting_glucose_num + '(' + formData.fasting_glucose_unit + ')'
                      }
                      return str
                    }
                  }
                ],
                [
                  {
                    label: '肝功能',
                    prop: 'gangongneng',
                    lineHeight: '63px',
                    children: [
                      [
                        {
                          prop: 'ALT',
                          label: '血清谷丙转氨酶',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(U/L)'
                          }
                        },
                        {
                          prop: 'SGOT',
                          label: '血清谷草转氨酶',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(U/L)'
                          }
                        },
                        {
                          prop: 'albumin',
                          label: '白蛋白',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(g/L)'
                          }
                        },
                        {
                          prop: 'total_bilirubin',
                          label: '总胆红素',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(μmol/L)'
                          }
                        }
                      ],
                      [
                        {
                          prop: 'conjugated_bilirubin',
                          label: '结合胆红素',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(μmol/L)'
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '肾功能',
                    prop: 'shenggongnneg',
                    children: [
                      [
                        {
                          prop: 'serum_creatinine',
                          label: '血清肌酐',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(μmol/L)'
                          }
                        },
                        {
                          prop: 'blood_urea',
                          label: '血尿素',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        },
                        {
                          prop: 'serum_potassium',
                          label: '血钾浓度',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        },
                        {
                          prop: 'serum_sodium',
                          label: '血钠浓度',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    prop: 'ydfmw',
                    label: '阴道分泌物'
                  }
                ],
                [
                  {
                    prop: 'hbsag',
                    label: '乙型肝炎'
                  }
                ],
                [
                  {
                    prop: 'meidu',
                    label: '梅毒血清学试验'
                  }
                ],
                [
                  {
                    prop: 'hiv',
                    label: 'HIV抗体检测'
                  }
                ],
                [
                  {
                    prop: 'b_ultrasound',
                    label: 'B超'
                  }
                ],
                [
                  {
                    prop: 'others',
                    label: '其他'
                  }
                ]
              ]
            }
          ],
          [
            {
              label: '总体评估',
              prop: 'general_assessment'
            }
          ],
          [
            {
              label: '指导',
              prop: 'advice',
              formatter: value => {
                return this._.isNil(value) ? '' : value.join()
              }
            }
          ],
          [
            {
              label: '下次随访时间',
              prop: 'next_visit_date',
              formatter: value => {
                return this._.isNil(value) ? '' : formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              prop: 'visit_doctor',
              label: '随访医生签名'
            }
          ]
        ],
        formData: undefined
      }
    }
  },
  methods: {
    initView() {
      if (this.gestationalInfo && this.queryDataAction && this._.isFunction(this.queryDataAction)) {
        this.loading = true
        let params = {
          profileNumber: this.gestationalInfo.profile_number,
          gestationalTimes: this.gestationalInfo.gestational_times,
          area: this.gestationalInfo.area
        }
        this.queryDataAction(params, (datas) => {
          if (datas.length === 1) {
            let data = { ...datas[0] }
            let d = parseSplitFields(needJson, data)
            this.firstCheckFormContent.formData = { ...data, ...d }
          }
          this.loading = false
        })
      }
    }
  },
  computed: {
    ...mapGetters(['dictFormatter'])
  },
  mounted() {
    this.initView()
  }
}
</script>

<style>
</style>
