<!-- 清算 -->
<template>
<div>
  <LegaTable ref="tableClearAccountHistory" :options="options" @query-data-action="pageSeqExpenseHistory" @exportData="exportData" @printData="printData">
  </LegaTable>
  <ClearAccountPrintHistory :area="area" ref="ClearAccountPrintHistory" class="print-hidden"></ClearAccountPrintHistory>
  <Modal v-model="clearAccountHistoryModal" title="选择卫生院" @on-ok="selectAreaOkClick">
    <LegaForm ref="clearAccountHistoryForm" :formItemData="clearAccountFormContent.formItemData"></LegaForm>
  </Modal>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SeqExpenseService } from '@/api/ehr/account'
import ClearAccountPrintHistory from './HistoryPrint.vue'
import { TreeUtil } from '@/utils/TreeUtil'
export default {
  components: {
    ClearAccountPrintHistory
  },
  computed: {
    ...mapGetters(['getAreaData'])
  },
  data() {
    return {
      isPrint: false,
      clearAccountHistoryModal: false,
      area: '',
      options: {
        permissionPerfix: 'clearAccountHistory',
        buttons: [
          {
            type: 'primary',
            name: '导出',
            customIcon: 'iconfont icon-export',
            iconSize: 12,
            clickName: 'exportData',
            permissionSuffix: 'btn_add'
          },
          {
            type: 'primary',
            name: '打印',
            icon: 'ios-print',
            iconSize: 12,
            clickName: 'printData',
            permissionSuffix: 'btn_add'
          }
        ],
        columns: [
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
            width: 80,
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
            // render: (h, params) => {
            //   return h('span', this._moment(params.row.clearTime).format('YYYY-MM-DD HH:mm:ss'))
            // }
          },
          {
            key: 'area',
            title: '卫生院',
            width: 60,
            render: (h, params) => {
              return h('span', this._.isEmpty(this.getAreaData) ? params.row.area : this.getAreaData.map[params.row.area])
            }
          }
        ],
        searchOptions: {
          showItems: [
            {
              type: 'select',
              label: '卫生院',
              queryType: 'like',
              prop: 'area',
              tip: '请选择卫生院',
              valueField: 'value',
              keyField: 'title',
              r: rowItem => {
                return TreeUtil.loadAreaTreeDatas('540330', 'village')
              }
            },
            {
              type: 'date',
              label: '从',
              prop: 'startTime',
              queryType: '',
              tip: '____年__月__日'
            },
            {
              type: 'date',
              label: '至',
              prop: 'endTime',
              tip: '____年__月__日'
            }
          ]
        }
      },
      clearAccountFormContent: {
        formItemData: [
          [
            {
              type: 'select',
              label: '卫生院',
              queryType: 'like',
              prop: 'area',
              tip: '请选择卫生院',
              valueField: 'value',
              keyField: 'title',
              r: rowItem => {
                return TreeUtil.loadAreaTreeDatas('540330', 'village')
              }
            }
          ]
        ]
      }
    }
  },
  methods: {
    pageSeqExpenseHistory(params = {}) {
      // 组装查询
      if (params.conditions && params.conditions.length > 0) {
        params.conditions.forEach((item) => {
          if (item.field === 'startTime' || item.field === 'endTime') {
            item.value = this._moment(item.value).format('YYYY-MM-DD')
          }
        })
      }
      if (this._.isEmpty(params.conditions)) {
        params.conditions = []
      }
      params.conditions.push({ field: 'clearStatus', value: 1 })
      SeqExpenseService.pageClearAccountSeqExpense(params).then(res => {
        if (res.status === 0) {
          this.$refs.tableClearAccountHistory.dealResponseData(res)
        }
      })
    },
    exportData() {
      this.isPrint = false
      this.clearAccountHistoryModal = true
    },
    printData() {
      this.isPrint = true
      this.clearAccountHistoryModal = true
    },
    selectAreaOkClick() {
      if (!this._.isNil(this.$refs.clearAccountHistoryForm.getFormDatas()) && !this._.isEmpty(this.$refs.clearAccountHistoryForm.getFormDatas().area)) {
        this.area = this.$refs.clearAccountHistoryForm.getFormDatas().area
      }
      setTimeout(() => {
        if (this.isPrint) {
          this.$refs.ClearAccountPrintHistory.printClick()
        } else {
          this.$refs.ClearAccountPrintHistory.exportData()
        }
      }, 2000)
    }
  }
}
</script>
