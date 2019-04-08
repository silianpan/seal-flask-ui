<!--  -->
<template>
<div class="physical-exam-log-container">
  <div class="bs-callout-small bs-callout-primary">
    <h4>体检详细 </h4>
  </div>
  <LegaWordView id="examination-wordview" :formItemData="examFormContent.formItemData" :formData="examFormContent.formData"></LegaWordView>
</div>
</template>

<script>
import LegaWordView from '@/components/LegaWordView'
import {
  mapGetters
} from 'vuex'
import {
  PhysicalExamLogService
} from '@/api/ehr/inspection'
const needJson = {
  'physical_exercise': ['exercise_rate', 'exercise_time', 'exercise_year', 'exercise_way'], // 锻炼信息
  'smoking_status': ['smoke_state', 'smoke_num', 'start_smoke', 'stop_smoke'], // 吸烟状况
  'drinking_status': ['wines_rate', 'wines_num', 'isDrunkenness', 'wines_type', 'is_stop_wines', 'start_wines', 'stop_wines'], // 饮酒状况
  'contact_history': ['is_contact', 'work', 'work_time', 'contact_type', 'has_safe'], // 接触史
  'oral_cavity': ['mouse', 'teeth', 'fauces'], // 口腔
  'vision': ['left_eye', 'right_eye', 'vision_type'], // 视力
  'lung': ['barrel_chested', 'breath_sound', 'rale'], // 肺情况
  'heart': ['heart_rate', 'heart_rhythm', 'heart_souffle'], // 心脏情况
  'stomach': ['tenderness', 'mass', 'hepatomegaly', 'splenomegaly', 'shifting_dullness'], // 腹部情况
  'symptom': ['symptom'], // 症状
  'eating_habits': ['eating_habits'], // 饮食习惯
  'skin': ['skin'], // 皮肤
  'sclera': ['sclera'], // 巩膜
  'lymph_gland': ['lymph_gland'], // 淋巴结
  'digital_rectal_examination': ['digital_rectal_examination'], // 肛门指诊
  'breast': ['breast'], // 胸腺
  'blood_routine': ['hemoglobin', 'leukocyte', 'platelet', 'blood_other'], // 血常规
  'urine_routine': ['urine_protein', 'urine_sugar', 'urine_acetone_bodies', 'bld', 'urine_other'], // 尿常规
  'fasting_glucose': ['fasting_glucose_num', 'fasting_glucose_unit'], // 空腹血糖
  'liver_function': ['ALT', 'SGOT', 'albumin', 'total_bilirubin', 'conjugated_bilirubin'], // 肝功能
  'renal_function': ['serum_creatinine', 'blood_urea', 'serum_potassium', 'serum_sodium'], // 肾功能
  'blood_fat': ['total_cholesterol', 'triglyceride', 'SLDLC', 'SHDLC'] // 血脂
}
export default {
  props: {
    physicalExamLogInfo: Object
  },
  components: {
    LegaWordView
  },
  data() {
    return {
      examFormContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '体检信息表'
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
              formatter: this.dateFormatter
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
              label: '体检日期',
              prop: 'pe_date',
              formatter: this.dateFormatter
            },
            {
              label: '体检医生',
              prop: 'pe_doctor'
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
                    str += this.dateFormatter(value) + ':' + this.dictFormatter('pastMedicalHistoryDisease', item.type) + ','
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
              label: '症状',
              prop: 'symptom',
              formatter: value => {
                return this._.isNil(value) ? '' : value.join()
              }
            }
          ],
          [
            {
              label: '一般状况',
              prop: 'yiban',
              lineHeight: '154px',
              children: [
                [
                  {
                    label: '体温',
                    prop: 'temperature',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(℃)'
                    }
                  },
                  {
                    label: '脉率',
                    prop: 'pulse_rate',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(次/分钟)'
                    }
                  }
                ],
                [
                  {
                    label: '呼吸频率',
                    prop: 'breathing_rate',
                    lineHeight: '49px',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(次/分钟)'
                    }
                  },
                  {
                    label: '血压',
                    prop: 'xueya',
                    lineHeight: '49px',
                    children: [
                      [
                        {
                          label: '左侧',
                          prop: 'systolic_pressure',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmHg)'
                          }
                        }
                      ],
                      [
                        {
                          label: '右侧',
                          prop: 'diastolic_pressure',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmHg)'
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '身高',
                    prop: 'height',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(cm)'
                    }
                  },
                  {
                    label: '体重',
                    prop: 'weight',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(kg)'
                    }
                  }
                ],
                [
                  {
                    label: '体质指数',
                    prop: 'bmi',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(kg/m²)'
                    }
                  }
                ]
              ]
            }
          ],
          [
            {
              label: '生活方式',
              prop: 'shenghuo',
              lineHeight: '476px',
              children: [
                [
                  {
                    label: '体育锻炼',
                    prop: 'tiyu',
                    children: [
                      [
                        {
                          label: '锻炼频率',
                          prop: 'exercise_rate'
                        }
                      ],
                      [
                        {
                          label: '每次锻炼时间',
                          prop: 'exercise_time',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(分钟)'
                          }
                        },
                        {
                          label: '坚持锻炼时间',
                          prop: 'exercise_year',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(年)'
                          }
                        }
                      ],
                      [
                        {
                          label: '锻炼方式',
                          prop: 'exercise_way'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '饮食习惯',
                    prop: 'eating_habits',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
                  }
                ],
                [
                  {
                    label: '吸烟情况',
                    prop: 'xiyan',
                    children: [
                      [
                        {
                          label: '吸烟状况',
                          prop: 'smoke_state'
                        }
                      ],
                      [
                        {
                          label: '日吸烟量',
                          prop: 'smoke_num',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(支)'
                          }
                        }
                      ],
                      [
                        {
                          label: '开始吸烟年龄',
                          prop: 'start_smoke',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(岁)'
                          }
                        },
                        {
                          label: '戒烟年龄',
                          prop: 'stop_smoke',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(岁)'
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '饮酒情况',
                    prop: 'yinjiu',
                    lineHeight: '133px',
                    children: [
                      [
                        {
                          label: '饮酒频率',
                          prop: 'wines_rate'
                        }
                      ],
                      [
                        {
                          label: '日饮酒量',
                          prop: 'wines_num',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(两)'
                          }
                        }
                      ],
                      [
                        {
                          label: '开始饮酒年龄',
                          prop: 'start_wines',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(岁)'
                          }
                        },
                        {
                          label: '戒酒年龄',
                          prop: 'stop_wines',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(岁)'
                          }
                        }
                      ],
                      [
                        {
                          label: '最近一年是否曾醉酒',
                          prop: 'isDrunkenness'
                        },
                        {
                          label: '饮酒种类',
                          prop: 'wines_type',
                          lineHeight: '28px'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '接触史',
                    prop: 'zhiye',
                    lineHeight: '77px',
                    children: [
                      [
                        {
                          label: '有无接触史',
                          prop: 'is_contact'
                        },
                        {
                          label: '工种',
                          prop: 'work'
                        },
                        {
                          label: '工作时间',
                          prop: 'work_time',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(年)'
                          }
                        }
                      ],
                      [
                        {
                          label: '毒物类型（有无防护措施）',
                          prop: 'contact_type',
                          lineHeight: '21px',
                          formatter: (value, formData) => {
                            let str = ''
                            if (!this._.isNil(value) && this._.isNil(formData.has_safe)) {
                              for (let item of value) {
                                str += item + '(无),'
                              }
                            } else if (!this._.isNil(value) && !this._.isNil(formData.has_safe)) {
                              for (let item of value) {
                                let flag = '(无),'
                                if (formData.has_safe.indexOf(item) > -1) {
                                  flag = '(有)，'
                                }
                                str = str + item + flag
                              }
                            }
                            str = str.substring(0, str.length - 1)
                            return str
                          }
                        }
                      ]
                    ]
                  }
                ]
              ]
            }
          ],
          [
            {
              label: '脏器功能',
              prop: 'zangqi',
              lineHeight: '80px',
              children: [
                [
                  {
                    label: '口腔',
                    prop: 'kouqiang',
                    children: [
                      [
                        {
                          label: '口唇',
                          prop: 'mouse'
                        }
                      ],
                      [
                        {
                          label: '齿列',
                          prop: 'teeth'
                        }
                      ],
                      [
                        {
                          label: '咽部',
                          prop: 'fauces'
                        }
                      ]
                    ]
                  }
                ]
              ]
            }
          ],
          [
            {
              pageNext: true
            }
          ],
          [
            {
              label: '脏器功能',
              prop: 'zangqi',
              lineHeight: '98px',
              children: [
                [
                  {
                    label: '视力',
                    prop: 'shili',
                    children: [
                      [
                        {
                          label: '视力类型',
                          prop: 'vision_type',
                          lineHeight: '28px'
                        },
                        {
                          label: '左眼视力',
                          prop: 'left_eye',
                          lineHeight: '28px'
                        },
                        {
                          label: '右眼视力',
                          prop: 'right_eye',
                          lineHeight: '28px'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '听力',
                    prop: 'hearing'
                  }
                ],
                [
                  {
                    label: '运动能力',
                    prop: 'motor_function'
                  }
                ]
              ]
            }
          ],
          [
            {
              label: '查体',
              prop: 'chati',
              lineHeight: '833px',
              children: [
                [
                  {
                    label: '眼底',
                    prop: 'eyeground'
                  }
                ],
                [
                  {
                    label: '皮肤',
                    prop: 'skin',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
                  }
                ],
                [
                  {
                    label: '巩膜',
                    prop: 'sclera',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
                  }
                ],
                [
                  {
                    label: '淋巴结',
                    prop: 'lymph_gland',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
                  }
                ],
                [
                  {
                    label: '肺',
                    prop: 'fei',
                    children: [
                      [
                        {
                          label: '桶装胸',
                          prop: 'barrel_chested'
                        }
                      ],
                      [
                        {
                          label: '呼吸音异常',
                          prop: 'breath_sound'
                        }
                      ],
                      [
                        {
                          label: '罗音',
                          prop: 'rale',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value.join()
                          }
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '心脏',
                    prop: 'xinzang',
                    children: [
                      [
                        {
                          label: '心率',
                          prop: 'heart_rate',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(次/分钟)'
                          }
                        }
                      ],
                      [
                        {
                          label: '心律',
                          prop: 'heart_rhythm',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value.join()
                          }
                        }
                      ],
                      [
                        {
                          label: '杂音',
                          prop: 'heart_souffle'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '腹部',
                    prop: 'sclelymph_glandra',
                    lineHeight: '168px',
                    children: [
                      [
                        {
                          label: '有无压痛',
                          prop: 'tenderness'
                        }
                      ],
                      [
                        {
                          label: '有无包块',
                          prop: 'mass'
                        }
                      ],
                      [
                        {
                          label: '有无肝大',
                          prop: 'hepatomegaly'
                        }
                      ],
                      [
                        {
                          label: '有无脾大',
                          prop: 'splenomegaly'
                        }
                      ],
                      [
                        {
                          label: '有无移动性浊音',
                          prop: 'shifting_dullness'
                        }
                      ]
                    ]
                  }
                ],
                [
                  {
                    label: '下肢水肿',
                    prop: 'edema_of_lower_extremity'
                  }
                ],
                [
                  {
                    label: '足背动脉搏动',
                    prop: 'pulsation_of_the_dorsum_of_the_foot'
                  }
                ],
                [
                  {
                    label: '肛门指诊',
                    prop: 'digital_rectal_examination',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
                  }
                ],
                [
                  {
                    label: '乳腺',
                    prop: 'breast',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value.join()
                    }
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
                          prop: 'vulva',
                          formatter: value => {
                            return this.gender === '1' ? 'X' : value
                          }
                        }
                      ],
                      [
                        {
                          label: '阴道',
                          prop: 'vagina',
                          formatter: value => {
                            return this.gender === '1' ? 'X' : value
                          }
                        }
                      ],
                      [
                        {
                          label: '宫颈',
                          prop: 'cervix',
                          formatter: value => {
                            return this.gender === '1' ? 'X' : value
                          }
                        }
                      ],
                      [
                        {
                          label: '宫体',
                          prop: 'corpus_uteri',
                          formatter: value => {
                            return this.gender === '1' ? 'X' : value
                          }
                        }
                      ],
                      [
                        {
                          label: '附件',
                          prop: 'adnexa',
                          formatter: value => {
                            return this.gender === '1' ? 'X' : value
                          }
                        }
                      ]
                    ]
                  }
                ]
              ]
            }
          ],
          [
            {
              pageNext: true
            }
          ],
          [
            {
              label: '辅助检查',
              prop: 'fuzhu',
              lineHeight: '800px',
              children: [
                [
                  {
                    label: '血常规',
                    prop: 'xuechanggui',
                    lineHeight: '78px',
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
                        }
                      ],
                      [
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
                    lineHeight: '92px',
                    children: [
                      [
                        {
                          label: '尿蛋白',
                          prop: 'urine_protein'
                        },
                        {
                          label: '尿糖',
                          prop: 'urine_sugar'
                        }
                      ],
                      [
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
                    label: '心电图',
                    prop: 'electrocardiogram'
                  }
                ],
                [
                  {
                    label: '微量蛋白尿',
                    prop: 'microalbuminuria',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '(mg/dL)'
                    }
                  }
                ],
                [
                  {
                    label: '大便潜血',
                    prop: 'fecal_occult_blood'
                  }
                ],
                [
                  {
                    label: '糖化血红蛋白',
                    prop: 'glycosylated_hemoglobin',
                    formatter: value => {
                      return this._.isNil(value) ? '' : value + '%'
                    }
                  }
                ],
                [
                  {
                    label: '肝功能',
                    prop: 'gangongneng',
                    lineHeight: '112px',
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
                        }
                      ],
                      [
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
                    lineHeight: '76px',
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
                        }
                      ],
                      [
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
                    label: '血脂',
                    prop: 'xuezhi',
                    lineHeight: '78px',
                    children: [
                      [
                        {
                          prop: 'total_cholesterol',
                          label: '总胆固醇',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        },
                        {
                          prop: 'triglyceride',
                          label: '甘油三酯',
                          lineHeight: '28px',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        }
                      ],
                      [
                        {
                          prop: 'SLDLC',
                          label: '血清低密度脂蛋白胆固醇',
                          formatter: value => {
                            return this._.isNil(value) ? '' : value + '(mmol/L)'
                          }
                        },
                        {
                          prop: 'SHDLC',
                          label: '血清高密度脂蛋白胆固醇',
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
                    prop: 'cxr',
                    label: '胸部X线片'
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
          ]
        ],
        formData: {}
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
    init() {
      if (this.physicalExamLogInfo && this.physicalExamLogInfo.id) {
        PhysicalExamLogService.findDetailInfoById(this.physicalExamLogInfo.id).then(res => {
          if (res.ok()) {
            let data = res.data
            for (let key in needJson) {
              if (!this._.isNil(data[key]) && !this._.isEmpty(data[key])) {
                let json = JSON.parse(data[key])
                needJson[key].forEach(item => {
                  data[item] = json[item]
                })
              }
            }
            this.examFormContent.formData = data
          }
        })
      }
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
