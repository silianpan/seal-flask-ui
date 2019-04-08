<!--
家庭账户展示 界面
@author hsc
@date 2018-09-20
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" >
          <Row slot="table-title">
            <Alert show-icon>
               一个家庭一个账户,家庭绑定医疗卡后自动创建家庭账户
              <Icon type="ios-bulb-outline" slot="icon"></Icon>
            </Alert>
          </Row>
        </LegaTable>
      </i-Col>
    </Row>
  </Card>
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import FamilyAccountConsumingRecords from './FamilyAccountConsumingRecords'
import FamilyAccountDepositeRecords from './FamilyAccountDepositeRecords'
import DepositRecordDetail from './DepositRecordDetail'
import {
  FamilyService
} from '@/api/ehr/family'
import { TreeUtil } from '@/utils/TreeUtil'
import {
  mapGetters
} from 'vuex'
export default {
  props: {},
  components: {
    LegaTable,
    FamilyAccountConsumingRecords,
    FamilyAccountDepositeRecords,
    DepositRecordDetail
  },
  data() {
    return {
      // 被选中的家庭
      selectedFamily: {},
      familyCnt: 0,
      options: {
        actionsHandle: {
          familyDeposit: (params, column) => {
            this.$router.push(
              {
                name: 'familyAccountDeposit',
                params: {
                  options: params.row,
                  sourceRoute: this.$route
                }
              }
            )
          },
          familyAssetView: (params, column) => {
            this.$router.push(
              {
                name: 'familyAccountAsset',
                params: params.row
              }
            )
          },
          loadDataSuccess: (data) => {
            this.familyCnt = data.length
          },
          // 消费记录
          detailConsumingRecordsAction: (params, column) => {
            this.handleDetailConsumingRecordsAction(params.row)
          },
          // 充值记录
          detailDepositRecordsAction: (params, column) => {
            this.handleDetailDepositRecordsAction(params.row)
          }
        },
        permissionPerfix: this.$route.name,
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
        url: `${FamilyService.baseUrlPrefix}/account/info/page`,
        columns: [{
          key: 'familyAccount',
          title: '户号'
        },
        {
          key: 'village',
          title: '乡镇',
          render: (h, params) => {
            let row = params.row || {}
            let _village = {}
            try {
              _village = JSON.parse(row['village'] || '{}')
            } catch (e) {

            }
            return h('span', _village.name || '')
          }
        },
        {
          key: 'valliageId',
          title: '乡编号',
          render: (h, params) => {
            let row = params.row || {}
            let _village = {}
            try {
              _village = JSON.parse(row['village'] || '{}')
            } catch (e) {

            }
            return h('span', _village.code || '')
          }
        },
        {
          key: 'houseOwnerName',
          title: '户主',
          render: (h, params) => {
            let row = params.row || {}
            if (this._.isNil(row.houseOwnerName)) {
              return h('div', '暂无')
            }
            return h('span', row.houseOwnerName)
          }
        },
        {
          key: 'address',
          title: '住址'
        },
        {
          title: '操作',
          key: 'action',
          render: [{
            key: 'familyDeposit',
            permissionSuffix: 'btn:account:deposit'
          },
          {
            key: 'detailConsumingRecordsAction',
            permissionSuffix: 'btn:account:view:consuming'
          },
          {
            key: 'detailDepositRecordsAction',
            permissionSuffix: 'btn:account:view:deposit'
          }
          ]
        }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'select',
              label: '乡镇',
              queryType: 'like',
              prop: 'village',
              tip: '请选择乡镇',
              valueField: 'value',
              keyField: 'title',
              r: rowItem => {
                return TreeUtil.loadAreaTreeDatas('540330', 'village')
              }
            },
            {
              type: 'input',
              label: '户主',
              prop: 'houseOwnerName',
              tip: '请输入户主姓名'
            },
            {
              type: 'input',
              label: '户号',
              prop: 'familyAccount',
              tip: '请输入户号'
            }
          ]
        }
      }
    }
  },
  methods: {
    handleDetailConsumingRecordsAction(familyInfo) {
      this._dynamicModal.newInstance({
        title: '家庭就诊消费记录',
        width: '80%',
        footerHide: true,
        renderBody: (h) => {
          return h(FamilyAccountConsumingRecords, {
            props: {
              phyCardId: familyInfo.phyCardId
            }
          })
        }
      }).show()
    },
    handleDetailDepositRecordsAction(familyInfo) {
      this._dynamicModal.newInstance({
        title: '家庭充值记录',
        width: '70%',
        footerHide: true,
        renderBody: (h) => {
          return h(FamilyAccountDepositeRecords, {
            props: {
              familyAccount: familyInfo.familyAccount
            }
          })
        }
      }).show()
    }
  },

  mounted: function () {},
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
