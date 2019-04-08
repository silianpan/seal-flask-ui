<template>
  <div>
    <div class="bs-callout-small bs-callout-primary">
        <h4>{{title}}</h4>
    </div>
     <Spin fix size="large" v-if="loading"></Spin>
    <Tabs value="second">
      <TabPane label="第二次" name="second">
        <div v-if="secondContent.formData">
          <LegaWordView :formItemData="secondContent.formItemData" :formData="secondContent.formData"></LegaWordView>
        </div>
        <div v-else style="text-align:center">
          暂无产前第二次随访服务记录
        </div>
      </TabPane>
      <TabPane label="第三次" name="third">
        <div v-if="thirdContent.formData">
        <LegaWordView :formItemData="thirdContent.formItemData" :formData="thirdContent.formData"></LegaWordView>
       </div>
        <div v-else style="text-align:center">
          暂无产前第三次随访服务记录
        </div>
      </TabPane>
      <TabPane label="第四次" name="fourth">
        <div v-if="fourthContent.formData">
        <LegaWordView :formItemData="fourthContent.formItemData" :formData="fourthContent.formData"></LegaWordView>
         </div>
         <div v-else style="text-align:center">
          暂无产前第四次随访服务记录
        </div>
      </TabPane>
      <TabPane label="第五次" name="fifth">
        <div v-if="fifthContent.formData">
        <LegaWordView :formItemData="fifthContent.formItemData" :formData="fifthContent.formData"></LegaWordView>
        </div>
         <div v-else style="text-align:center">
          暂无产前第五次随访服务记录
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { formatUTC, parseSplitFields } from '@/libs/tools'
import LegaWordView from '@/components/LegaWordView'
import { mapGetters } from 'vuex'
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
      secondContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '第2次产前随访服务记录表'
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
              span: 8,
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('marriage', value)
              }
            },
            {
              label: '检查日期',
              prop: 'exam_date',
              span: 16,
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              label: '孕周',
              prop: 'gestational_week',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(周)'
              }
            }
          ],
          [
            {
              prop: 'complaint',
              label: '主诉'
            }
          ],
          [
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
              prop: 'fundus_height',
              label: '宫底高度',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'abdominal_circumference',
              label: '腹围',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'fetal_position',
              label: '胎位'
            }
          ],
          [
            {
              prop: 'fetal_heart_rate',
              label: '胎心率',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(次/分钟)'
              }
            }
          ],
          [
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
      },
      thirdContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '第3次产前随访服务记录表'
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
              span: 8,
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('marriage', value)
              }
            },
            {
              label: '检查日期',
              prop: 'exam_date',
              span: 16,
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              label: '孕周',
              prop: 'gestational_week',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(周)'
              }
            }
          ],
          [
            {
              prop: 'complaint',
              label: '主诉'
            }
          ],
          [
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
              prop: 'fundus_height',
              label: '宫底高度',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'abdominal_circumference',
              label: '腹围',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'fetal_position',
              label: '胎位'
            }
          ],
          [
            {
              prop: 'fetal_heart_rate',
              label: '胎心率',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(次/分钟)'
              }
            }
          ],
          [
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
      },
      fourthContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '第4次产前随访服务记录表'
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
              span: 8,
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('marriage', value)
              }
            },
            {
              label: '检查日期',
              prop: 'exam_date',
              span: 16,
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              label: '孕周',
              prop: 'gestational_week',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(周)'
              }
            }
          ],
          [
            {
              prop: 'complaint',
              label: '主诉'
            }
          ],
          [
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
              prop: 'fundus_height',
              label: '宫底高度',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'abdominal_circumference',
              label: '腹围',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'fetal_position',
              label: '胎位'
            }
          ],
          [
            {
              prop: 'fetal_heart_rate',
              label: '胎心率',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(次/分钟)'
              }
            }
          ],
          [
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
      },
      fifthContent: {
        formItemData: [
          [
            {
              type: 'title',
              label: '第5次产前随访服务记录表'
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
              span: 8,
              formatter: value => {
                return this._.isNil(value) ? '' : this.dictFormatter('marriage', value)
              }
            },
            {
              label: '检查日期',
              prop: 'exam_date',
              span: 16,
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              label: '孕周',
              prop: 'gestational_week',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(周)'
              }
            }
          ],
          [
            {
              prop: 'complaint',
              label: '主诉'
            }
          ],
          [
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
              prop: 'fundus_height',
              label: '宫底高度',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'abdominal_circumference',
              label: '腹围',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(cm)'
              }
            }
          ],
          [
            {
              prop: 'fetal_position',
              label: '胎位'
            }
          ],
          [
            {
              prop: 'fetal_heart_rate',
              label: '胎心率',
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(次/分钟)'
              }
            }
          ],
          [
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
          if (datas && this._.isArray(datas)) {
            let cloneDatas = datas.map(d => {
              let _d = { ...d }
              let parseData = parseSplitFields(needJson, _d)
              return { ..._d, ...parseData }
            }) || []
            this.secondContent.formData = cloneDatas[0]
            this.thirdContent.formData = cloneDatas[1]
            this.fourthContent.formData = cloneDatas[2]
            this.fifthContent.formData = cloneDatas[3]
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
