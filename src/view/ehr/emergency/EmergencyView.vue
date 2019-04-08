<template>
  <div>
    <Card>
      <Row>
          <i-button @click.native='back'>
            <Icon type="ios-arrow-back" />返回</i-button>
      </Row>
      <lega-form ref="form" :labelWidth="caseFormContent.labelWidth" :form-item-data="caseFormContent.formItemData" :form-rules="caseFormContent.formRules" ></lega-form>
    </Card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EmergencyService } from '@/api/ehr/emergency'
// 需要格式化为json得数据格式
const needJson = {
  'preliminaryDiagnosis': ['preliminary_date', 'preliminary_content'], // 初次诊断
  'revisedDiagnostic': ['revised_date', 'revised_content'], // 订正诊断
  'lvTime': ['preliminary_lv', 'revised_lv'] // 病例分类
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
            name: '突发公共卫生事件报告卡'
          },
          [
            {
              type: 'input',
              prop: 'reporter',
              label: '报告人',
              tip: '报告人',
              disabled: true
            },
            {
              type: 'input',
              prop: 'telephone',
              label: '联系电话',
              tip: '联系电话'
            },
            {
              type: 'input',
              prop: 'reportUnit',
              label: '填报单位',
              tip: '填报单位',
              disabled: true
            },
            {
              type: 'date',
              prop: 'crtTime',
              label: '填报时间',
              tip: '填报时间'
            }
          ],
          [
            {
              type: 'input',
              prop: 'reportTitle',
              label: '事件名称',
              tip: '事件名称'
            },
            {
              type: 'input',
              prop: 'cardType',
              label: '报卡类别',
              tip: '报卡类别'
            },
            {
              type: 'input',
              prop: 'times',
              label: '次数',
              tip: '次数'
            },
            {
              type: 'input',
              prop: 'status',
              label: '状态',
              tip: '状态 ',
              disabled: true
            }
          ],
          {
            name: '信息类别',
            orientation: 'left'
          },
          [
            {
              type: 'radioGroup',
              prop: 'infoType',
              radioName: 'key',
              radioLabel: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('emergencyType')
              }
            }
          ],
          {},
          [
            {
              type: 'input',
              labelWidth: 90,
              prop: 'emergencyLv',
              label: '突发事件等级',
              tip: '突发事件等级'
            },
            {
              type: 'input',
              labelWidth: 90,
              prop: 'isDead',
              label: '有无死亡病历',
              tip: '有无死亡病历'
            }
          ],
          [
            {
              type: 'date',
              labelWidth: 90,
              prop: 'preliminary_date',
              label: '初步诊断时间',
              tip: '初步诊断时间'
            },
            {
              type: 'date',
              labelWidth: 90,
              prop: 'revised_date',
              label: '订正诊断时间',
              tip: '订正诊断时间'
            }
          ],
          [
            {
              type: 'textArea',
              labelWidth: 90,
              rows: 4,
              prop: 'preliminary_content',
              label: '初步诊断内容',
              tip: '初步诊断内容'
            },
            {
              type: 'textArea',
              labelWidth: 90,
              rows: 4,
              prop: 'revised_content',
              label: '订正诊断内容',
              tip: '订正诊断内容'
            }
          ],
          [
            {
              type: 'date',
              labelWidth: 90,
              prop: 'preliminary_lv',
              label: '确认分级时间',
              tip: '确认分级时间'
            },
            {
              type: 'date',
              labelWidth: 90,
              prop: 'revised_lv',
              label: '订正分级时间',
              tip: '订正分级时间'
            }
          ],
          [
            {
              type: 'input',
              prop: 'happenArea',
              label: '发生地区',
              tip: '发生地区'
            }
          ]
        ]
      }
    }
  },
  methods: {
    initForm() {
      EmergencyService.findById(this.id).then(res => {
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
        name: 'emergencyInfo'
      })
    }
  },
  mounted: function() {
    if (!this._.isNil(this.id)) {
      this.initForm()
    } else {
      this.back()
    }
  },
  computed: {
    ...mapGetters(['dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style scoped>
</style>
