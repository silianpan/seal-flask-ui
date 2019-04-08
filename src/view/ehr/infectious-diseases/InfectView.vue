<template>
  <div>
    <Card>
      <Row>
        <i-button @click.native='back'><Icon type="ios-arrow-back" />返回</i-button>
      </Row>
      <lega-form ref="form" :labelWidth="caseFormContent.labelWidth" :form-item-data="caseFormContent.formItemData" :form-rules="caseFormContent.formRules" ></lega-form>
    </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { InfectService } from '@/api/ehr/infect'
// 需要格式化为json得数据格式
const needJson = {
  'name': ['self_name', 'parents_name'], // 姓名
  'age': ['birthday', 'chronologicalAge', 'unit'], // 年龄
  'caseClassification': ['classify', 'acute_chronic'], // 病例分类
  'reportDate': ['accident_date', 'diagnosis_date', 'death_date'] // 各项时间
}
export default {
  props: {
    id: String
  },
  data() {
    return {
      caseFormContent: {
        // 表单验证规则
        formRules: {},
        // 表单项配置
        labelWidth: 80,
        formItemData: [
          {
            name: '传染病报告卡'
          },
          [
            {
              type: 'input',
              prop: 'reporter',
              label: '报告人',
              tip: '报告人'
            },
            {
              type: 'input',
              prop: 'reportType',
              label: '报告类型',
              tip: '报告类型'
            },
            {
              type: 'input',
              prop: 'diseasesType',
              labelWidth: 90,
              label: '传染病类型',
              tip: '传染病类型'
            },
            {
              type: 'radioGroup',
              prop: 'cardType',
              label: '报卡类别',
              tip: '报卡类别',
              options: [
                {
                  id: '初次报告',
                  name: '初次报告'
                },
                {
                  id: '订正报告',
                  name: '订正报告'
                }
              ]
            }
          ],
          [
            {
              type: 'input',
              prop: 'self_name',
              label: '姓名',
              tip: '患者姓名'
            },
            {
              type: 'input',
              labelWidth: 90,
              prop: 'parents_name',
              label: '患儿家长姓名',
              tip: '患儿家长姓名 '
            },
            {
              type: 'input',
              prop: 'idNumber',
              label: '身份证号',
              tip: '身份证号'
            },
            {
              type: 'select',
              prop: 'gender',
              label: '性别',
              tip: '性别 ',
              r: rowItem => {
                return this.dictDatasWithGroupKey('gender')
              }
            }
          ],
          [
            {
              type: 'date',
              prop: 'birthday',
              labelWidth: 90,
              label: '包含出生年月',
              tip: '包含出生年月'
            },
            {
              type: 'input',
              labelWidth: 160,
              prop: 'chronological_age',
              label: '出生年月不详填写实足年龄',
              tip: '实足年龄'
            },
            {
              type: 'input',
              prop: 'unit',
              label: '年龄单位',
              tip: '年龄单位'
            }
          ],
          [
            {
              type: 'input',
              prop: 'workUnit',
              label: '工作单位',
              tip: '工作单位'
            },
            {
              type: 'input',
              prop: 'telephone',
              label: '电话',
              tip: '电话'
            },
            {
              type: 'radioGroup',
              prop: 'patientFrom',
              label: '病人属于',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('patientFrom')
              }
            }
          ],
          [
            {
              type: 'input',
              prop: 'currentAddress',
              label: '现住址',
              tip: '现住址'
            },
            {
              type: 'input',
              prop: 'reportUnit',
              label: '报告单位',
              tip: '报告单位'
            }
          ],
          [
            {
              type: 'radioGroup',
              prop: 'patientOccupation',
              label: '患者职业',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('career')
              }
            }
          ],
          [
            {
              type: 'radioGroup',
              prop: 'classify',
              label: '病例分类',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('caseClassification')
              }
            },
            {
              type: 'radioGroup',
              labelWidth: 220,
              prop: 'acuteChronic',
              label: '急/慢性（乙型肝炎，血吸虫病填写）',
              options: [
                {
                  id: '急性',
                  name: '急性'
                },
                {
                  id: '慢性',
                  name: '慢性'
                }
              ]
            }
          ],
          [
            {
              type: 'date',
              prop: 'accident_date',
              label: '发病日期',
              tip: '发病日期 '
            },
            {
              type: 'date',
              prop: 'diagnosis_date',
              label: '诊断日期',
              tip: '诊断日期 '
            },
            {
              type: 'date',
              prop: 'death_date',
              label: '死亡日期',
              tip: '死亡日期 '
            }
          ],
          {
            name: '甲类传染病',
            orientation: 'left'
          },
          [
            {
              type: 'radioGroup',
              prop: 'infectiousDiseases',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('aTypeInfect')
              }
            }
          ],
          {
            name: '乙类传染病',
            orientation: 'left'
          },
          [
            {
              type: 'radioGroup',
              prop: 'infectiousDiseases',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('bTypeInfect')
              }
            }
          ],
          {
            name: '丙类传染病',
            orientation: 'left'
          },
          [
            {
              type: 'radioGroup',
              prop: 'infectiousDiseases',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('cTypeInfect')
              }
            }
          ]
        ]
      }
    }
  },
  methods: {
    initForm() {
      InfectService.findById(this.id).then(res => {
        let data = res.data
        // 解析json
        for (let key in needJson) {
          if (!this._.isNil(data[key]) && !this._.isEmpty(data[key])) {
            let json = JSON.parse(data[key])
            needJson[key].forEach(item => {
              data[item] = json[item]
            })
          }
          if (needJson[key].length === 1 && this._.isNil(data[key])) {
            data[key] = []
          }
        }
        this.$refs.form.setFormFieldsData(data)
      })
    },
    /** 回退 */
    back: function() {
      this.$router.push({
        name: 'infectInfo'
      })
    }
  },
  mounted: function() {
    if (!this._.isNil(this.id)) {
      this.initForm()
    } else {
      this.$router.push({ name: 'infectInfo' })
    }
  },
  computed: {
    ...mapGetters(['dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style scoped>
</style>
