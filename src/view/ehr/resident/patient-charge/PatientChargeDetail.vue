<!--  -->
<template>
<div class="patient-charge-item-detail">
  <div class="bs-callout-small bs-callout-primary">
    <h4>缴费清单 </h4>
  </div>
  <div style="margin-top:10px">
    <h4>收费项目（已完成）</h4>
    <Divider style="margin-top:10px;"></Divider>
  </div>
  <Row>
    <i-col>
       <Table :loading="loading" :columns="chargeTableColumns" :data="chargeTableData"></Table>
    </i-col>
  </Row>
  <div style="margin-top:10px">
     <Divider style="margin-top:10px;"></Divider>
    <h4>收费详情</h4>
    <Divider style="margin-top:10px;"></Divider>
  </div>
  <Row type="flex" justify="center" v-if="Object.keys(reorganizeData).length> 0">
    <i-col :xs="24" :sm="24" :md="24" :lg="24">
      <Card>
        <div class="charge-item-detail" v-for="(item, index) in chargeItems" :key="index" v-if="reorganizeData[item.type] || item.required">
          <div :style="item.style">
             <span class="charge-item-label" ><label>{{item.title}}:</label></span>
              <span class="charge-item-value" >
                <span v-if="item.render">
                  <LegaCell :render="item.render"></LegaCell>
                </span>
                <span v-else>{{reorganizeData[item.type].totalCost || '-'}} 元</span>
              </span>
          </div>
          <Divider style="margin: 5px;"></Divider>
        </div>
        <div class="charge-zhang" v-if="chargeInfo.medicalOrgName">
          <Icon custom="iconfont icon-zhang" size="50" color="red"></Icon>
          <div class="case-zhang-title">
            {{chargeInfo.medicalOrgName}}
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
  <div v-else-if="!this.loading" style="margin-top:10px">
    <Divider style="margin-top:10px;"></Divider>
    <h4>无 收费信息</h4>
    <Divider style="margin-top:10px;"></Divider>
  </div>
</div>
</template>

<script>
import LegaCell from '@/components/base/LegaCell.js'
import { mapGetters } from 'vuex'
import {
  PatientCaseService
} from '@/api/ehr/diagnose'
import NP from 'number-precision'
export default {
  props: {
    patientCaseInfo: Object
  },
  components: {
    LegaCell
  },
  data() {
    return {
      loading: false,
      // 收费项目对应金额
      reorganizeData: {},
      //  缴费信息
      chargeInfo: {},
      //  收费项目
      chargeItems: [
        { title: '西/成药费',
          render: () => {
            return this.createRenderFunctionByField('western_prescription_cost')
          },
          type: 'western_prescription_cost' },
        { title: '民族药费',
          render: () => {
            return this.createRenderFunctionByField('chinese_prescription_cost')
          },
          type: 'chinese_prescription_cost' },
        { title: '材料费',
          render: () => {
            return this.createRenderFunctionByField('material_cost')
          },
          type: 'material_cost' },
        { title: '其他收费',
          render: () => {
            return this.createRenderFunctionByField('other_cost')
          },
          type: 'other_cost' },
        { title: '费用合计',
          type: 'totalMoney',
          required: true,
          render: () => {
            let total = 0
            for (const type in (this.reorganizeData || {})) {
              let d = this.reorganizeData[type]
              total = NP.plus(total, d.totalCost)
            }
            return (
              <span>{total} 元</span>
            )
          },
          style: { fontSize: '15px', color: 'red', textAlign: 'right' } },
        { title: '折扣合计',
          required: true,
          type: 'discountMoney',
          render: () => {
            let discountMoney = 0
            for (const type in (this.reorganizeData || {})) {
              let d = this.reorganizeData[type]
              discountMoney = NP.plus(discountMoney, d.discountMoney)
            }
            return (
              <span>{discountMoney} 元</span>
            )
          },
          style: { fontSize: '15px', color: 'red', textAlign: 'right' } },
        { title: '缴费合计',
          required: true,
          type: 'finishMoney',
          render: () => {
            let finish = 0
            for (const type in (this.reorganizeData || {})) {
              let d = this.reorganizeData[type]
              finish = NP.plus(finish, d.totalCost)
              finish = NP.minus(finish, d.discountMoney)
            }
            return (
              <span>{finish} 元</span>
            )
          },
          style: { fontSize: '15px', color: 'red', textAlign: 'right' } }
      ],
      chargeTableData: [],
      chargeTableColumns: [
        {
          key: 'itemName',
          title: '收费名称'
        },
        {
          key: 'itemPerPrice',
          title: '单价(元)'
        },
        {
          key: 'total',
          title: '数量'
        },
        {
          key: 'itemUnit',
          title: '单位',
          render: (h, params) => {
            let unitName = this.dictFormatter('drugPackUnit', params.row.itemUnit)
            if (!unitName) {
              unitName = params.row.itemUnit
            }
            return (<span>{unitName}</span>)
          }
        },
        {
          key: 'discount',
          title: '折扣',
          render: (h, params) => {
            let text = ''
            if (params.row.discount === 0) {
              text = '无折扣'
            } else if (params.row.discount === 1) {
              text = '免费'
            } else {
              text = (params.row.discount * 10) + '折'
            }
            return (<span>{text}</span>)
          }
        },
        {
          key: 'itemMoney',
          title: '金额(元)'
        },
        {
          key: 'discountItemMoney',
          title: '折扣金额(元)',
          render: (h, params) => {
            let tmpDiscount = params.row.discount === 0 ? 1 : params.row.discount ? NP.minus(1, params.row.discount) : 0
            let tmp = NP.times(tmpDiscount, params.row.itemMoney)
            return h('span', tmp)
          }
        },
        {
          key: 'doctor',
          title: '接诊医生'
        }
      ]
    }
  },
  methods: {
    createRenderFunctionByField(field) {
      if (this.reorganizeData && this.reorganizeData[field]) {
        let wCost = this.reorganizeData[field]
        return (
          <span>{wCost.totalCost} 元 （折扣: {wCost.discountMoney || ''} 元 ）</span>
        )
      }
    },
    dealData(data) {
      if (data && data.length > 0) {
        let reorganizeData = {}
        data.forEach(d => {
          if (d.costType) {
            if (!reorganizeData[d.costType]) {
              reorganizeData[d.costType] = {
                // 此类花销的总花销（比如:材料费的总花销）
                totalCost: 0,
                // 此类花销的总折扣金额 （比如：材料费的总金额）
                discountMoney: 0,
                items: []
              }
            }
            let { totalCost, discountMoney } = reorganizeData[d.costType]
            let tmpDiscount = d.discount === 0 ? 1 : d.discount ? NP.minus(1, d.discount) : 0
            discountMoney = NP.plus(discountMoney, NP.times(tmpDiscount, d.itemMoney))
            totalCost = NP.plus(totalCost, d.itemMoney)
            reorganizeData[d.costType].totalCost = totalCost
            reorganizeData[d.costType].discountMoney = discountMoney
            reorganizeData[d.costType].items.push({ ...d })
          }
        })
        this.reorganizeData = reorganizeData
        console.log(reorganizeData)
      }
    },
    init() {
      if (this.patientCaseInfo && this.patientCaseInfo.id) {
        this.loading = true
        // 根据收费项目查找 收费详情
        PatientCaseService.findHistoryChargeByCaseId('a539ab764ba267ad2e9ceb2913ec13e7').then(resp => {
          if (resp.ok()) {
            this.chargeTableData = resp.data
            // 获取 西/成药费 民族药费
            this.dealData(resp.data)
          }
          this.loading = false
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

<style lang="less" scoped>
.patient-charge-item-detail {
  text-align: left;
  .charge-item {
    &-label {
      line-height: 1;
      width: 80px;
      font-weight: bold;
    }
    &-value {
      margin-left: 20px;
    }
  }
  .charge-zhang {
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
