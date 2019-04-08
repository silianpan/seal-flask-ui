<!--
传染病上报表 界面
@author 49773
@date 2018-12-19
created by scaffold
-->
<template>
  <div>
    <Card>
      <h1>传染病上报</h1>
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
import { InfectService } from '@/api/ehr/infect'
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
        url: `${InfectService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'name',
            title: '姓名',
            render: (h, params) => {
              let json = JSON.parse(params.row.name)
              return h('span', json.self_name)
            }
          },
          {
            key: 'gender',
            title: '性别',
            render: (h, params) => {
              return h('span', this.dictFormatter('gender', params.row.gender))
            }
          },
          {
            key: 'age',
            title: '年龄',
            render: (h, params) => {
              let json = JSON.parse(params.row.age)
              let str = ''
              if (!this._.isNil(json.birthday) && json.birthday !== '') {
                str = this._moment(params.row.crtTime).diff(this._moment(json.birthday).format('YYYY-MM-DD'), 'year') + '岁'
              } else {
                str = json.chronological_age + json.unit
                str = isNaN(str) ? '' : str
              }
              return h('span', str)
            }
          },
          {
            key: 'infectiousDiseases',
            title: '诊断病名'
          },
          {
            key: 'reporter',
            title: '报告人'
          },
          {
            key: 'crtTime',
            title: '报告日期',
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
            key: 'cardType',
            title: '报卡类别'
          },
          {
            key: 'reportUnit',
            title: '报告地区'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'view', permissionSuffix: 'btn:infect:view' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'input',
              label: '姓名',
              prop: 'name',
              tip: '姓名'
            },
            {
              type: 'dateRange',
              label: '登记日期',
              queryType: 'between',
              style: 'width:100%',
              prop: 'crtTime',
              tip: '随访日期'
            },
            {
              type: 'input',
              label: '乡镇名',
              prop: 'reportUnit',
              tip: '乡镇名'
            },
            {
              type: 'select',
              label: '传染病类型',
              prop: 'diseasesType',
              tip: '传染病类型',
              options: [
                {
                  key: '甲类',
                  value: '甲类'
                },
                {
                  key: '乙类',
                  value: '乙类'
                },
                {
                  key: '丙类',
                  value: '丙类'
                }
              ]
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
        name: 'infectView',
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
