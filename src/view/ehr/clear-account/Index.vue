<!-- 清算 -->
<template>
<div>
  <LegaTable ref="tableClearAccount" :options="options" @query-data-action="pageNoClearSeqExpense" @exportData="exportData" @printData="printData">
  </LegaTable>
  <ClearAccountPrint :area="area" ref="ClearAccountPrint" class="print-hidden"></ClearAccountPrint>
  <Modal v-model="clearAccountModal" title="选择卫生院" @on-ok="selectAreaOkClick">
    <LegaForm ref="clearAccountForm" :formItemData="clearAccountFormContent.formItemData"></LegaForm>
  </Modal>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SeqExpenseService } from '@/api/ehr/account'
import ClearAccountPrint from './Print.vue'
import { TreeUtil } from '@/utils/TreeUtil'
export default {
  components: {
    ClearAccountPrint
  },
  computed: {
    ...mapGetters(['getAreaData'])
  },
  data() {
    return {
      isPrint: false,
      area: '',
      clearAccountModal: false,
      options: {
        actionsHandle: {
          clearAccount: (params, column) => {
            this.clearAccountClick(params.row)
          }
        },
        permissionPerfix: 'clearAccount',
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
            key: 'area',
            title: '卫生院',
            width: 60,
            render: (h, params) => {
              return h('span', this._.isEmpty(this.getAreaData) ? params.row.area : this.getAreaData.map[params.row.area])
            }
          },
          {
            title: '操作',
            key: 'action',
            render: ['clearAccount']
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
    pageNoClearSeqExpense(params = {}) {
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
      params.conditions.push({ field: 'clearStatus', value: '0' })
      SeqExpenseService.pageClearAccountSeqExpense(params).then(res => {
        if (res.status === 0) {
          this.$refs.tableClearAccount.dealResponseData(res)
        }
      })
    },
    exportData() {
      this.isPrint = false
      this.clearAccountModal = true
    },
    printData() {
      this.isPrint = true
      this.clearAccountModal = true
    },
    selectAreaOkClick() {
      if (!this._.isNil(this.$refs.clearAccountForm.getFormDatas()) && !this._.isEmpty(this.$refs.clearAccountForm.getFormDatas().area)) {
        this.area = this.$refs.clearAccountForm.getFormDatas().area
      }
      setTimeout(() => {
        if (this.isPrint) {
          this.$refs.ClearAccountPrint.printClick()
        } else {
          this.$refs.ClearAccountPrint.exportData()
        }
      }, 2000)
    },
    clearAccountClick(row) {
      let tmp = { ...row }
      tmp.clearStatus = 1
      tmp.clearTime = new Date()
      if (!this._.isEmpty(tmp.id)) {
        this.$Modal.confirm({
          title: '清算',
          content: '是否确认清算该流水单',
          onOk: () => {
            SeqExpenseService.save(tmp).then(res => {
              this.$Message.success('清算成功！')
            })
          }
        })
      }
    }
  }
}
</script>
