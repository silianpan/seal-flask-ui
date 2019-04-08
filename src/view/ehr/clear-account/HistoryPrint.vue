<!-- 清算打印 -->
<template>
  <div>
    <div id="clear-account-history-print">
      <Table ref="tableClearAccountPrintHistory" :columns="options.columns" :data="seqDataCompute" size="small"></Table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SeqExpenseService } from '@/api/ehr/account'
import printJS from 'print-js'
import domtoimage from 'dom-to-image'
export default {
  props: {
    area: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      seqData: []
    }
  },
  computed: {
    ...mapGetters(['getAreaData']),
    seqDataCompute() {
      if (!this._.isEmpty(this.seqData) && !this._.isEmpty(this.getAreaData)) {
        this.seqData.forEach(item => {
          item.area = this.getAreaData.map[item.area]
        })
      }
      return this.seqData
    },
    options() {
      return {
        columns: [
          {
            title: `清算流水清单-${this._moment().format('YYYY-MM-DD')}`,
            align: 'center',
            children: [
              {
                key: 'seqId',
                title: '流水单号',
                width: 188
              },
              {
                key: 'crtTime',
                title: '流水时间',
                width: 150
              },
              {
                key: 'seqType',
                title: '流水类型',
                width: 60
              },
              {
                key: 'profileNumber',
                title: '档案编号',
                width: 100
              },
              {
                key: 'name',
                title: '姓名'
              },
              {
                key: 'idNumber',
                title: '身份证号',
                width: 60
              },

              {
                key: 'phyCardSerial',
                title: '医疗卡号',
                width: 120
              },
              {
                key: 'familyAccount',
                title: '户号'
              },
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
                title: '单位'
              },
              {
                key: 'discount',
                title: '折扣'
              },
              {
                key: 'itemMoney',
                title: '金额(元)'
              },
              {
                key: 'discountItemMoney',
                title: '折扣金额(元)'
              },
              {
                key: 'doctor',
                title: '接诊医生'
              },
              {
                key: 'clearStatus',
                title: '清算状态',
                render: (h, params) => {
                  const tmp = params.row.clearStatus === '已清算' ? '#00C853' : '#D50000'
                  return h('span', {
                    style: {
                      color: tmp
                    }
                  }, params.row.clearStatus)
                }
              },
              {
                key: 'clearTime',
                title: '清算时间'
              },
              {
                key: 'area',
                title: '卫生院',
                width: 60
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.findSeqExpenseHistory()
  },
  watch: {
    area(newVal) {
      this.findSeqExpenseHistory()
    }
  },
  methods: {
    printClick() {
      this.$nextTick(() => {
        // printJS({
        //   printable: 'clear-account-history-print',
        //   type: 'html',
        //   style: legaTablePrintCss,
        //   scanStyles: false
        // })
        domtoimage.toPng(this.$el.querySelector('#clear-account-history-print')).then(blob => {
          printJS({
            printable: [blob],
            type: 'image'
          })
        })
      })
    },
    exportData() {
      let hospitalName = this.getAreaData.map[this.area]
      this.$nextTick(() => {
        this.$refs.tableClearAccountPrintHistory.exportCsv({
          filename: `${hospitalName}清算历史清单-${this._moment().format('YYYY-MM-DD')}`
        })
      })
    },
    findSeqExpenseHistory(params = {}) {
      if (this._.isEmpty(params.conditions)) {
        params.conditions = []
      }
      params.conditions.push({ field: 'clearStatus', value: 1 }, { field: 'area', value: this.area })
      SeqExpenseService.listClearAccountSeqExpense(params).then(res => {
        if (res.status === 0 && !this._.isEmpty(res.data)) {
          this.seqData = res.data
        }
      })
    }
  }
}
</script>
