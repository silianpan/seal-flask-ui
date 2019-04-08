<!-- 消费记录 -->
<template>
<div class="family-account-consuming-records">
  <Row>
     <LegaTable ref="familyAccountTable" :options="options" >
          <Row slot="table-title">
            <Alert show-icon>
              {{tableTitle || '所有的充值记录'}}
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
            </Alert>
          </Row>
        </LegaTable>
  </Row>

</div>
</template>
<script>
import { ChargeRecordsService, ChargeRecordsDetailService } from '@/api/ehr/account'
import ExpandRow from './DepositRecordDetail'

export default {
  props: {
    familyAccount: String
  },
  components: {
    ExpandRow
  },
  data() {
    return {
      tableTitle: null,
      options: {
        type: 'tree',
        loadData: this.loadDetailData,
        queryDataAction: this.findDepositRecords,
        actionsHandle: {
        },
        permissionPerfix: 'chargeRecordsList',
        buttons: [
          {
            type: 'primary',
            name: '导出',
            customIcon: 'iconfont icon-export',
            iconSize: 12,
            clickName: 'export',
            permissionSuffix: 'btn_deposit'
          }
        ],
        columns: [
          {
            key: 'seqId',
            type: 'tree',
            title: '流水号',
            width: 300,
            showTaggle: (row) => {
              return !row.name
            }
          },
          {
            key: 'phyCardSerial',
            title: '医疗卡号'
          },
          {
            key: 'name',
            title: '姓名'
          },
          {
            key: 'gender',
            title: '性别',
            dictGroup: 'gender',
            width: 60,
            render: 'dictFormatter'
          },
          {
            key: 'totalMoney',
            title: '金额',
            render: (h, params) => {
              const row = params.row
              if (row.name) {
                return (
                  <span>
                    <span>单笔</span>
                    <span style='margin:0 5px; font-weight: bold;font-size: 16px'>{row.money || 0}</span>
                    <span>元</span>
                  </span>
                )
              }
              return (
                <span>
                  <span>总金额</span>
                  <span style='margin:0 5px; font-weight: bold;font-size: 16px'>{row.totalMoney || 0}</span>
                  <span>元</span>
                </span>
              )
            }
          },
          {
            key: 'crtTime',
            title: '充值时间'
          },
          {
            key: 'crtName',
            title: '操作人'
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'dateRange',
              label: '时间段',
              placement: 'bottom-start',
              prop: 'crtTime',
              queryType: 'between',
              style: 'width:100%',
              tip: '开始时间～结束时间'
            }
          ]
        }
      }
    }
  },
  methods: {
    loadDetailData: function(p, callback) {
      if (p) {
        ChargeRecordsDetailService.findChargeDetailInfoBySeq(p.seqId).then(res => {
          if (res.ok()) {
            callback(res.data)
          }
        })
      }
    },
    async findDepositRecords(params, callback) {
      if (!this._.isNil(this.familyAccount) && !this._.isEmpty(this.familyAccount)) {
        let _c = []
        let conditions = params.conditions || []
        conditions.forEach(i => {
          if (i.field === 'crtTime') {
            if (i.value && i.value.length === 2) {
              let startTime, endTime
              if (this._moment(i.value[0]).isValid()) {
                startTime = this._moment(i.value[0]).format('YYYY-MM-DD')
                _c.push({
                  field: 'startTime',
                  value: startTime
                })
              }
              if (this._moment(i.value[1]).isValid()) {
                endTime = this._moment(i.value[1]).add(1, 'day').format('YYYY-MM-DD')
                _c.push({
                  field: 'endTime',
                  value: endTime
                })
              }
              if (startTime && endTime) {
                this.tableTitle = `从${startTime} ~ ${this._moment(i.value[1]).format('YYYY-MM-DD')} 充值记录`
                const val = `${startTime},${endTime}`
                i.value = val
              } else {
                this.tableTitle = null
              }
            }
          }
        })
        if (_c.length === 0) {
          this.tableTitle = null
        }
        _c.push({
          field: 'familyAccount',
          value: this.familyAccount
        })
        params.conditions = _c
        const res = await ChargeRecordsService.pageInfo(params)
        callback(res)
      }
    }
  },
  mounted: function () {},
  computed: {}
}
</script>

<style scoped lang="less">
.family-account-consuming-records .ivu-row .ivu-col {
  margin-bottom: 10px;
  .ivu-card {
    margin-bottom: 10px;
  }
  .custuming-card-tag {
    position: absolute;
    top: 20px;
    right: 10px;
  }
}
</style>
