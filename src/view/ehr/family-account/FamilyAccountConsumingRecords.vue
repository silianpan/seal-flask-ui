<!-- 消费记录 -->
<template>
<div class="family-account-consuming-records">
  <Row>
     <LegaTable ref="table" :options="options" @query-data-action="pageConsumingRecords" >
          <Row slot="table-title">
            <Alert show-icon>
                {{tableTitle || '所有的消费记录'}}
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
            </Alert>
          </Row>
        </LegaTable>
  </Row>

</div>
</template>
<script>
import { SeqExpenseService } from '@/api/ehr/account'
export default {
  props: {
    phyCardId: String
  },
  components: {
  },
  data() {
    return {
      tableTitle: null,
      options: {
        actionsHandle: {
        },
        permissionPerfix: 'familyAccountList',
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
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h('span', '消费明细')
            }
          },
          {
            key: 'profileNumber',
            title: '流水号'
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
            render: 'dictFormatter',
            width: 80
          },
          {
            key: 'costFinish',
            title: '应收费用',
            render: (h, params) => h('span', `${params.row.costFinish || 0} 元`)
          },
          {
            key: 'costCard',
            title: '卡扣金额',
            render: (h, params) => h('span', `${params.row.costCard || 0} 元`)
          },
          {
            key: 'costSelf',
            title: '自费金额',
            render: (h, params) => h('span', `${params.row.costSelf || 0} 元`)
          },

          {
            key: 'crtTime',
            title: '消费时间'
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
    pageConsumingRecords: async function (params) {
      if (!this._.isNil(this.phyCardId) && !this._.isEmpty(this.phyCardId)) {
        let _c = []
        let _tmp = (params.conditions || []).map(i => {
          if (i.field === 'crtTime') {
            if (i.value && i.value.length === 2) {
              let startTime = this._moment(i.value[0]).format('YYYY-MM-DD')
              let endTime = this._moment(i.value[1]).add(1, 'day').format('YYYY-MM-DD')
              if (startTime !== 'Invalid date' && endTime !== 'Invalid date') {
                this.tableTitle = `从${startTime} ~ ${this._moment(i.value[1]).format('YYYY-MM-DD')} 充值记录`
                _c.push({
                  field: 'startTime',
                  value: startTime
                })
                _c.push({
                  field: 'endTime',
                  value: endTime
                })
              } else {
                this.tableTitle = null
              }
            }
            return null
          }
          return i
        }).filter(Boolean)
        if (_c.length === 0) {
          this.tableTitle = null
        }
        _c.concat(_tmp)
        _c.push({
          field: 'phyCardId',
          value: this.phyCardId
        })
        params.conditions = _c
        const res = await SeqExpenseService.pageInfo(params)
        if (res.status === 0) {
          this.$refs.table.dealResponseData(res)
        }
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
