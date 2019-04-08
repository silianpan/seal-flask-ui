<!--  -->
<template>
<div class="patient-case-item-detail">
  <div class="bs-callout-small bs-callout-primary">
    <h4>诊断情况 </h4>
  </div>
  <Row type="flex" justify="center">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Card>
        <div class="case-item-detail" v-for="(item, index) in caseFields" :key="index">
          <span class="case-item-label"><label>{{item.title}}:</label></span>
          <span class="case-item-value" v-if="item.format" >{{item.format(caseData[item.key])}}</span>
          <span class="case-item-value" v-else >{{caseData[item.key] || '-'}}</span>
          <Divider style="margin: 5px;"></Divider>
        </div>
        <div class="case-zhang" v-if="caseData.medicalOrgName">
          <Icon custom="iconfont icon-zhang" size="50" color="red"></Icon>
          <div class="case-zhang-title">
            {{caseData.medicalOrgName}}
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
  <div v-if="showWestPrescription">
    <div class="bs-callout-small bs-callout-primary">
      <h4>西/成药处方</h4>
    </div>
    <div>
      <LegaTable ref='westPrescriptionTable' :options="westOptions"></LegaTable>
    </div>
  </div>
  <div v-else style="margin-top:10px">
    <Divider style="margin-top:10px;"></Divider>
    <h4>无（西/成药处方）</h4>
    <Divider style="margin-top:10px;"></Divider>
  </div>

  <div v-if="chinesePresDatas && chinesePresDatas.length> 0">
    <div class="bs-callout-small bs-callout-primary">
      <h4>民族药处方 </h4>
    </div>
    <div v-for="(chinesePresData, index) in chinesePresDatas" :key="index">
      <div style="margin-top:10px;">
        <h3>处方({{index+1}}) </h3>
      </div>
      <Divider style="margin-top:5px;margin-bottom:10px;"></Divider>
      <div style="margin-left:20px">
        <h4>1.服用方法</h4>
      </div>
      <Divider style="margin-top:5px;margin-bottom:10px;"></Divider>
      <Card>
        <div class="case-item-detail" v-for="(item, index) in chinesePresFields" :key="index">
          <span class="case-item-label"><label>{{item.title}}:</label></span>
          <span class="case-item-value" v-if="item.format" >{{item.format(chinesePresData[item.key])}}</span>
          <span class="case-item-value" v-else >{{chinesePresData[item.key] || '-'}}</span>
          <Divider style="margin: 5px;"></Divider>
        </div>
      </Card>
      <Divider style="margin-top:10px;"></Divider>
      <div>
         <div style="margin-left:20px">
          <h4>2.药品详细</h4>
        </div>
        <Divider style="margin-top:5px;margin-bottom:10px;"></Divider>
        <Table ref="chinesePresDrugTable" :data="chinesePresData.drugs||[]" :columns="chinesePresDrugOptions.columns"></Table>
      </div>
    </div>
  </div>
  <div v-else style="margin-top:10px">
    <Divider style="margin-top:10px;"></Divider>
    <h4>无（民族药处方）</h4>
    <Divider style="margin-top:10px;"></Divider>
  </div>
</div>
</template>

<script>
import {
  WesternPrescriptionService,
  ChinesePrescriptionDrugService
} from '@/api/ehr/diagnose'
import {
  mapGetters
} from 'vuex'
export default {
  props: {
    patientCaseInfo: Object
  },
  components: {},
  data() {
    return {
      showWestPrescription: false,
      caseData: {
      },
      caseFields: [
        {
          key: 'doctor',
          title: '接诊医生'
        },
        {
          key: 'oncomeDate',
          title: '发病日期'
        },
        {
          key: 'chief',
          title: '主诉'
        },
        {
          key: 'presentHistory',
          title: '现病史'
        },
        {
          key: 'phyExam',
          title: '体格检查'
        },
        {
          key: 'primaryDiagnose',
          title: '初步诊断'
        },
        {
          key: 'cureOpinion',
          title: '治疗意见'
        },
        {
          key: 'remark',
          title: '备注'
        }
      ],
      westOptions: {
        type: 'tree',
        columns: [{
          key: 'drugName',
          title: '药品名'
        },
        {
          key: 'singleDose',
          title: '单次剂量',
          render: (h, params) => {
            const row = params.row || {}
            let d = {}
            try {
              d = JSON.parse(row.singleDose || undefined)
            } catch (e) {}
            let unit = d.unit.find(i => i.code === d.defaultUnit) || {}
            console.log(d)
            return (
              <div>
                <span >{d.value || ''}</span>
                <span > {unit.name} </span>
              </div >
            )
          }
        },
        {
          key: 'usage',
          title: '用法',
          dictGroup: 'drugUsage',
          render: 'dictFormatter'
        },
        {
          key: 'useDrugFreq',
          title: '用药频次',
          dictGroup: 'drugUseFreq',
          render: 'dictFormatter'
        },
        {
          key: 'dayNum',
          title: '天数'
        },
        {
          key: 'total',
          title: '总量'
        },
        {
          key: 'explain',
          title: '说明'
        }
        ]
      },
      chinesePresDatas: [],
      chinesePresFields: [{
        key: 'everydayDose',
        title: '每日剂量',
        format: (value) => {
          return this.dictFormatter('drugUseFreq', value)
        }
      },
      {
        key: 'usage',
        title: '用法',
        format: (value) => {
          return this.dictFormatter('drugUsage', value)
        }
      },
      {
        key: 'useDrugFreq',
        title: '用药频次',
        format: (value) => {
          return this.dictFormatter('drugUseFreq', value)
        }
      },
      {
        key: 'dayNum',
        title: '天数'
      },
      {
        key: 'totalDose',
        title: '总剂数'
      }
      ],
      chinesePresDrugOptions: {
        columns: [{
          key: 'drugName',
          title: '药品名'
        },
        {
          key: 'dose',
          title: '剂量',
          render: (h, params) => {
            const row = params.row || {}
            let d = {}
            try {
              d = JSON.parse(row.dose || undefined)
            } catch (e) {}
            let unit = d.unit.find(i => i.code === d.defaultUnit) || {}
            console.log(d)
            return (
              <div>
                <span >{d.value || ''}</span>
                <span > {unit.name} </span>
              </div >
            )
          }
        },
        {
          key: 'request',
          title: '特殊要求'
        },
        {
          key: 'total',
          title: '总量'
        }
        ]
      }
    }
  },
  methods: {
    queryWesternPrescriptionData(params) {
      WesternPrescriptionService.findInfoByCondition(params).then(res => {
        if (res.ok()) {
          if (res.data.length > 0) {
            this.showWestPrescription = true
            this.$nextTick(() => {
              this.$refs['westPrescriptionTable'].dealResponseData(res)
            })
          } else {
            // 隐藏 西药
            this.showWestPrescription = false
          }
        }
      })
    },
    queryChinesePrescriptionDrugData(params) {
      ChinesePrescriptionDrugService.findInfoByCondition(params).then(resp => {
        if (resp.ok()) {
          const data = resp.data
          // 整理
          let presIds = {}
          data.map(i => {
            if (!presIds[i.prescriptionId]) {
              let { everydayDose, usage, useDrugFreq, dayNum, totalDose } = i
              presIds[i.prescriptionId] = {
                everydayDose,
                usage,
                useDrugFreq,
                dayNum,
                totalDose,
                drugs: []
              }
            }
            presIds[i.prescriptionId].drugs.push({ ...i })
          })
          let presDatas = []

          for (let key in presIds) {
            presDatas.push(presIds[key])
          }
          this.chinesePresDatas = presDatas
        }
      })
    },
    init() {
      if (this.patientCaseInfo && this.patientCaseInfo.id) {
        // 设置病例信息
        const caseInfoData = { ...this.patientCaseInfo }
        this.caseData = caseInfoData
        // 查询病例西方用药
        let params = {
          conditions: [{
            field: 'caseId',
            value: caseInfoData.id
          }]
        }
        this.queryWesternPrescriptionData(params)
        // 查询病例民族药用药
        this.queryChinesePrescriptionDrugData(params)
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

<style lang="less" scoped>
.patient-case-item-detail {
  text-align: left;

  .case-item-label {
    line-height: 1;
    width: 80px;
    font-weight: bold;
  }

  .case-item-value {
    margin-left: 20px;
  }

  .case-zhang {
    position: absolute;
    left: 200px;
    bottom: 80px;
    right: 10px;
    transform: rotate(8deg);
    -ms-transform: rotate(8deg);
    /* IE 9 */
    -moz-transform: rotate(8deg);
    /* Firefox */
    -webkit-transform: rotate(8deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(8deg);

    .case-zhang-title {
      font-size: 16px;
      color: red;
      position: fixed;
      top: 12px;
      left: 12px;
    }
  }
}
</style>
