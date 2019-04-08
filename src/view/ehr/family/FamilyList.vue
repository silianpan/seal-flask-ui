<!--
家庭信息表 界面
@author hsc
@date 2018-09-20
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" @addClick="handleAddFamilyClick">
          <Row slot="table-title" v-if="householdPropInfo && householdPropInfo.length > 0">
            <Alert show-icon>
              <span v-for="(item, index) in householdPropInfo" :key="index" style="margin-right:10px">
                <span>{{item.name}} </span> <span style="font-weight: bold;font-size: 14px;">{{item.cnt}}(户)</span>
              </span>
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
import { TreeUtil } from '@/utils/TreeUtil'
import {
  FamilyService
} from '@/api/ehr/family'
import {
  mapGetters
} from 'vuex'
// import {DynamicModal} from '@/utils/modalUtil'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      // 被选中的家庭
      selectedFamily: {},
      householdPropInfo: [],

      familyCnt: 0,
      options: {
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          view: (params, column) => {
            this.viewClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          },
          changeFamilymembers: (params, column) => {
            this.$router.push({
              name: 'familyMembersList',
              params: {
                sourceRoute: this.$route,
                familyInfo: params.row
              }
            })
          },
          loadDataSuccess: (data) => {
            this.familyCnt = data.length
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [{
          type: 'primary',
          name: '新增',
          icon: 'md-add',
          clickName: 'addClick',
          permissionSuffix: 'btn:family:add'
        },
        {
          type: 'primary',
          name: '导出',
          customIcon: 'iconfont icon-export',
          iconSize: 12,
          clickName: 'export',
          permissionSuffix: 'view'
        }
        ],
        url: `${FamilyService.baseUrlPrefix}/page`,
        columns: [
          {
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
            title: '乡镇编号',
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
            key: 'yearlyIncome',
            title: '家庭年收入情况',
            dictGroup: 'yearlyIncome',
            render: 'dictFormatter'
          },
          {
            key: 'population',
            title: '常住人口数',
            render: (h, params) => {
              return h('span', `${params.row.population || '0'}人`)
            }
          },
          {
            key: 'housingType',
            title: '家庭住房类型',
            dictGroup: 'housingType',
            render: 'dictFormatter'
          },
          {
            title: '操作',
            key: 'action',
            render: [{
              key: 'modify',
              permissionSuffix: 'btn:family:modify'
            }, {
              key: 'delete',
              permissionSuffix: 'btn:family:logic:delete'
            },
            {
              key: 'changeFamilymembers',
              permissionSuffix: 'btn:family:changeFamilymembers'
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
    /** 修改按钮 点击 */
    modifyClick(row) {
      this.selectedFamily = row || {}
      this.$router.push({
        name: 'familyListForm',
        params: { ...this.selectedFamily,
          ...{
            _: Math.random()
          }
        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {},

    /** 打开新增 */
    handleAddFamilyClick() {
      this.$router.push({
        name: 'familyListForm',
        params: {
          _: Math.random()
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      // 逻辑删除
      FamilyService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          if (res.data !== true) {
            this.$Message.error('删除失败')
          } else {
            this.$Message.success('删除成功！')
          }
        }
        this.$refs['table'].reLoad()
      })
    }
  },

  mounted: function () {
    FamilyService.countHouseholdProp().then(resp => {
      if (resp.ok()) {
        this.householdPropInfo = resp.data || []
      }
    })
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
