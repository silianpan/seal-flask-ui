<template>
  <div>
    <div class="bs-callout-small bs-callout-primary">
        <h4>{{title}}</h4>
    </div>
    <Spin fix size="large" v-if="loading"></Spin>
    <div v-if="this.afterFormContent.formData">
    <LegaWordView :formItemData="afterFormContent.formItemData" :formData="afterFormContent.formData"></LegaWordView>
   </div>
     <div v-else style="text-align:center">
        暂无访视记录
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LegaWordView from '@/components/LegaWordView'
import { formatUTC, parseSplitFields } from '@/libs/tools'
const needJson = {
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
      afterFormContent: {
        formItemData: [
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
              prop: 'visit_date',
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              label: '分娩日期',
              prop: 'delivery_date',
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            }
          ],
          [
            {
              label: '出院日期',
              prop: 'discharge_date',
              span: 8,
              formatter: value => {
                return formatUTC(value, 'YYYY-MM-DD')
              }
            },
            {
              prop: 'temperature',
              label: '体温',
              span: 16,
              formatter: value => {
                return this._.isNil(value) ? '' : value + '(℃)'
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
              prop: 'health',
              label: '一般健康情况'
            }
          ],
          [
            {
              prop: 'psychologic_situation',
              label: '一般心理情况'
            }
          ],
          [
            {
              prop: 'breast',
              label: '乳房'
            }
          ],
          [
            {
              prop: 'lyma',
              label: '恶露'
            }
          ],
          [
            {
              prop: 'uterus',
              label: '子宫'
            }
          ],
          [
            {
              prop: 'wound',
              label: '伤口'
            }
          ],
          [
            {
              prop: 'others',
              label: '其他'
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
            if (datas.length === 1) {
              let data = { ...datas[0] }
              let d = parseSplitFields(needJson, data)
              this.afterFormContent.formData = { ...data, ...d }
            }
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
