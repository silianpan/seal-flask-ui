<!--
  家庭充值界面
-->
<template>
<div>
  <Card>
    <!-- 家庭充值界面 -->
    <!-- 家庭成员信息 -->
    <FamilyInfoView :value="familyInfo"></FamilyInfoView>
    <Row style="margin-top:10px;">
      <!-- <Divider orientation="left">家庭成员</Divider> -->
      <LegaTable ref="table" :options="familyMembersOptions" @goBack="goBack" @save="handleSaveAction" >
        <Row slot="table-title">
          <Alert show-icon>
            家庭成员信息
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
          </Alert>
        </Row>
      </LegaTable>
    </Row>
    <Spin size="large" fix v-if="spinShow">正在充值...</Spin>
  </Card>
</div>
</template>

<script>
import {
  ResidentService
} from '@/api/ehr/resident'
import { ChargeRecordsService } from '@/api/ehr/account'
import {
  mapGetters
} from 'vuex'
import { backMixin } from '@/mixin/back-mixin'
import FamilyInfoView from '@/view/ehr/family/FamilyInfoView'
import { RegexUtil } from '@/utils/RegexUtil'
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  mixins: [backMixin],
  components: {
    FamilyInfoView
  },
  data() {
    return {
      spinShow: false,
      /** 默认返回的route 页面 */
      targetRoute: {
        name: 'familyAccountList'
      },
      familyAccount: this.options.familyAccount,
      familyInfo: this._.defaultsDeep({}, this.options),
      // 充值数据
      depositData: {},
      validateErrors: {},
      familyMembersOptions: {
        queryDataAction: this.listFamilyMembers,
        actionsHandle: {
          familyDeposit: (params, column) => {
            // 家庭账户充值
            this.handleFamilyDepositClick(params.row || {})
          }
        },
        permissionPerfix: 'familyAccountList',
        buttons: [
          {
            // type: 'primary',
            name: '返回',
            icon: 'ios-arrow-back',
            iconSize: 12,
            clickName: 'goBack'
          },
          {
            type: 'primary',
            name: '保存',
            customIcon: 'iconfont icon-baocun',
            iconSize: 12,
            clickName: 'save',
            permissionSuffix: 'btn:account:deposit'
          },
          {
            type: 'primary',
            name: '导出',
            customIcon: 'iconfont icon-export',
            iconSize: 12,
            clickName: 'export',
            permissionSuffix: 'btn:account:export'
          }
        ],
        columns: [{
          key: 'householdersRelationship',
          title: '与户主关系'
        },
        {
          key: 'name',
          title: '姓名'
        },
        {
          key: 'gender',
          title: '性别',
          dictGroup: 'gender',
          render: 'dictFormatter'
        },
        {
          key: 'birthday',
          title: '出生日期'
        },
        {
          title: '金额',
          key: 'action',
          render: (h, params) => {
            const row = params.row
            return h('i-input', {
              class: this.validateErrors[row.profileNumber],
              props: {
                value: this.depositData[row.profileNumber],
                placeholder: '请输入充值金额',
                clearable: true
              },
              on: {
                input: (value) => {
                  this.depositData[row.profileNumber] = value
                },
                'on-change': (event) => {
                  // 验证 数据是否正确
                  this.checkDepositDataByKey(row.profileNumber)
                }
              }
            })
          }
        }
        ]
      }
    }
  },
  methods: {
    /** 根据key 检查数据的合理性 */
    checkDepositDataByKey(key = '') {
      if (this.depositData[key] && !this._.isEmpty(this.depositData[key])) {
        if (!RegexUtil.testPositiveFloatingNumber(this.depositData[key])) {
          this.$set(this.validateErrors, key, 'ivu-form-item-error')
          return false
        } else {
          this.$set(this.validateErrors, key, '')
          return true
        }
      }
      return false
    },
    /** 检查所有数据的合理性 */
    checkAllDepositData() {
      const _depositData = this.depositData || {}
      let isAllRight = true
      Object.keys(_depositData).every(key => {
        if (!this.checkDepositDataByKey(key)) {
          isAllRight = false
        }
      })
      return isAllRight && Object.keys(_depositData).length !== 0
    },
    // 再次校验 输入数据的合理性，弹出 再次确认 弹窗，点击 保存 后插入数据
    handleSaveAction: function() {
      const tableData = this.$refs.table.tableData
      if (!this.checkAllDepositData()) {
        this.$Message.info('请填写正确的充值金额')
        return
      }
      let totalDepositeData = 0
      const data = tableData.map((item) => {
        if (item.profileNumber && this.depositData[item.profileNumber]) {
          item.money = Number(this.depositData[item.profileNumber])
          totalDepositeData = Number(totalDepositeData) + Number(this.depositData[item.profileNumber])
          return item
        }
        return null
      }).filter(Boolean)
      this._dynamicModal.newInstance({
        title: '确认充值信息',
        width: '60%',
        // loading: true,
        // footerHide: true,
        onOk: () => {
          // 封装数据
          let params = {
            phyCardId: this.options.phyCardId,
            familyAccount: this.options.familyAccount,
            detail: Object.assign({}, this.depositData)
          }
          // 打开浮层
          this.spinShow = true
          ChargeRecordsService.saveInfo(params).then(res => {
            if (res.ok()) {
              this.$Message.success('充值成功')
              this.goBack()
              // 成功 返回
            }
            this.spinShow = false
            // 打开浮层
          })
          console.log(this.depositData, params)
        },
        renderBody: (h) => {
          return h('lega-table', {
            props: {
              options: {
                pageination: false,
                border: true,
                columns: [
                  {
                    key: 'householdersRelationship',
                    title: '与户主关系'
                  },
                  {
                    key: 'name',
                    title: '姓名'
                  },
                  {
                    title: '充值金额',
                    key: 'money',
                    render: (h, params) => {
                      const row = params.row
                      return h('span', `${row.money.toFixed(2)} 元`)
                    }
                  }
                ],
                data: data
              }
            }
          }, [
            h('Row', {
              slot: 'table-title'
            }, [
              h('Alert', {
                props: {
                  'show-icon': true
                }
              }, [
                h('span', `充值总金额: ${totalDepositeData.toFixed(2)} 元`),
                h('Icon', {
                  slot: 'icon',
                  props: {
                    type: 'ios-bulb-outline'
                  }
                })
              ])
            ])
          ])
        }
      }).show()
    },
    // 查询家庭成员信息
    listFamilyMembers: function (params, callback) {
      if (this._.isNil(this.familyAccount) || this._.isEmpty(this.familyAccount)) {
        return
      }
      ResidentService.listFamilyMembers(this.familyAccount).then(res => {
        callback(res)
      })
    },
    /** 充值按钮具句柄 */
    handleFamilyDepositClick: function (row) {
      this._dynamicModal.newInstance({
        title: '家庭充值记录',
        width: '60%',
        footerHide: true,
        renderBody: (h) => {
          return h(FamilyAccountDepositeRecords, {})
        }
      }).show()
    },
    init: function () {
      if (this._.isNil(this.familyAccount) || this._.isNil(this.options.familyAccount)) {
        this.goBack()
      }
    }
  },
  mounted: function () {
    let {
      sourceRoute
    } = this.$route.params
    this.sourceRoute = sourceRoute
    this.init()
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
