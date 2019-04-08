<!--
传染病上报表 界面
@author 49773
@date 2018-12-19
created by scaffold
-->
<template>
  <div>
    <Card>
      <h1>突发公共卫生事件上报</h1>
      <Row :gutter="5">
        <i-Col>
          <LegaTable ref="table" :options="options"></LegaTable>
        </i-Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { formatUTC } from '@/libs/tools'
import { EmergencyService } from '@/api/ehr/emergency'
export default {
  props: {},
  data() {
    return {
      options: {
        beforeQueryDataAction: this.beforeQueryDataAction,
        actionsHandle: {
          view: (params, column) => {
            this.viewClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        url: `${EmergencyService.baseUrlPrefix}/page`,
        columns: [
          {
            title: '事件名称',
            key: 'reportTitle'
          },
          {
            key: 'infoType',
            title: '信息类别'
          },
          {
            key: 'emergencyLv',
            title: '突发事件等级'
          },
          {
            key: 'isDead',
            title: '是否有死亡病历'
          },
          {
            key: 'crtTime',
            title: '填报日期',
            render: (h, params) => {
              return h('span', formatUTC(params.row.crtTime, 'YYYY-MM-DD'))
            }
          },
          {
            key: 'updTime',
            title: '订正日期',
            render: (h, params) => {
              let str = this._.isNil(params.row.updTime) ? '' : formatUTC(params.row.updTime, 'YYYY-MM-DD')
              return h('span', str)
            }
          },
          {
            key: 'reporter',
            title: '报告人'
          },
          {
            key: 'telephone',
            title: '联系电话'
          },
          {
            key: 'reportUnit',
            title: '报告地区'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'view', permissionSuffix: 'btn:emergency:view' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [
            {
              type: 'select',
              label: '是否有死亡病历',
              queryType: 'like',
              style: 'width:100%',
              prop: 'isDead',
              tip: '是否有死亡病历',
              options: [
                {
                  key: '有',
                  value: '有'
                },
                {
                  key: '无',
                  value: '无'
                }
              ]
            }
          ],
          showItems: [
            {
              type: 'select',
              label: '信息类别',
              prop: 'infoType',
              tip: '信息类别',
              valueField: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('emergencyType')
              }
            },
            {
              type: 'dateRange',
              label: '登记日期',
              queryType: 'between',
              style: 'width:100%',
              prop: 'crtTime',
              tip: '登记日期'
            },
            {
              type: 'select',
              label: '事件等级',
              prop: 'emergencyLv',
              tip: '事件等级',
              valueField: 'key',
              r: rowItem => {
                return this.dictDatasWithGroupKey('emergencyLv')
              }
            },
            {
              type: 'input',
              label: '事件名称',
              queryType: 'like',
              style: 'width:100%',
              prop: 'reportTitle',
              tip: '事件名称'
            }
          ]
        }
      }
    }
  },
  methods: {
    beforeQueryDataAction (params, callback) {
      if (params.conditions && this._.isArray(params.conditions)) {
        let _c = params.conditions.map(item => {
          let _i = { ...item }
          if (item.field === 'crtTime' && item.value) {
            if (!this._moment(item.value[0]).isValid() || !this._moment(item.value[1]).isValid()) {
              return null
            }
            let from = this._moment(item.value[0]).format('YYYY-MM-DD')
            let to = this._moment(item.value[1]).add(1, 'days').format('YYYY-MM-DD')
            _i.value = `${from},${to}`
          }
          return _i
        }).filter(Boolean)
        params.conditions = _c
      }
      callback(params)
    },
    /** 查看按钮 点击 */
    viewClick(row) {
      this.$router.push({
        name: 'emergencyView',
        params: { id: row.id }
      })
    }
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>
<style  scoped>
</style>
