<!--
 界面
@author 49773
@date 2018-10-23
created by scaffold
-->
<template>
<div>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4>药品信息</h4>
    </div>
    <Layout :style="{padding: '10px'}">
      <Sider hide-trigger :style="{ background: '#fff'}" width="auto">
        <Tree :data="typeData" :load-data="loadType" @on-select-change="showDrug"></Tree>
      </Sider>
      <Layout :style="{paddingLeft: '10px'}">
        <Content :style="{padding: '10px', minHeight: '280px', background: '#fff'}">
          <LegaTable ref="table" :options="options" @addWest="addDrug('west')" @addChina="addDrug('china')"></LegaTable>
        </Content>
      </Layout>
    </Layout>
  </Card>
</div>
</template>

<script>
import './drug.less'
import {
  DrugService,
  DrugTypeService
} from '@/api/ehr/drug'
import {
  mapGetters
} from 'vuex'
export default {
  props: {},
  data() {
    return {
      options: {
        type: 'tree',
        stripe: true,
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [{
          type: 'primary',
          name: '新增西/中成药',
          icon: 'md-add',
          clickName: 'addWest',
          permissionSuffix: 'btn:add:west'
        },
        {
          type: 'primary',
          name: '新增民族药',
          icon: 'md-add',
          clickName: 'addChina',
          permissionSuffix: 'btn:add:china'
        }
        ],
        url: `${DrugService.baseUrlPrefix}/page`,
        columns: [{
          key: 'nmpn',
          title: '国药准字',
          render: (h, params) => {
            if (this._.isNil(params.row.nmpn)) {
              return h('span', '民族药无')
            } else {
              return h('span', params.row.nmpn)
            }
          }
        },
        {
          key: 'barcode',
          title: '条形码'
        },
        {
          key: 'drugName',
          title: '药品名',
          render: (h, params) => {
            let str = params.row.drugName
            let color = 'black'
            if (params.row.status === '0') {
              str += '(已停用)'
              color = 'red'
            }
            return h('span', {
              style: {
                color: color
              }
            }, str)
          }
        },
        {
          key: 'drugSpec',
          title: '规格',
          render: (h, params) => {
            let str = ''
            if (!this._.isNil(params.row.drugSpec)) {
              let json = JSON.parse(params.row.drugSpec)
              str = json.dosageQuantity + this.dictFormatter('drugPackUnit', json.dosage) + '*' + json.preparationQuantity + this.dictFormatter('drugPackUnit', json.preparation)
            }
            return h('span', str)
          }
        },
        {
          key: 'drugUnit',
          title: '单位',
          render: (h, params) => {
            return h('span', this.dictFormatter('drugPackUnit', params.row.drugUnit))
          }
        },
        {
          key: 'drugSale',
          title: '销售价（￥）'
        },
        {
          key: 'drugNameSpell',
          title: '拼音码'
        },
        {
          key: 'discount',
          title: '折扣'
        },
        {
          key: 'info',
          title: '备注'
        },
        {
          title: '操作',
          key: 'action',
          render: [{
            key: 'modify',
            permissionSuffix: 'btn:drug:modify'
          },
          {
            key: 'delete',
            permissionSuffix: 'btn:drug:delete'
          }
          ]
        }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [{
            type: 'input',
            label: '药品名',
            prop: 'drugName',
            tip: '药品名'
          },
          {
            type: 'input',
            label: '条形码',
            prop: 'barcode',
            tip: '条形码'
          },
          {
            type: 'select',
            label: '药品状态',
            prop: 'status',
            tip: '请选择',
            options: [{
              key: '正常',
              value: '1'
            },
            {
              key: '停用',
              value: '0'
            }
            ]
          }
          ]
        }
      },
      typeData: []
    }
  },
  methods: {
    // 初始化药品类型树的顶级菜单
    initType() {
      let params = {
        conditions: [{
          queryType: 'isnull',
          field: 'pid',
          value: 'isnull'
        }]
      }
      DrugTypeService.getNullNum().then(res => {
        let elem = {}
        elem.title = '未指定类型(' + res.data.num + ')'
        elem.id = 'isnull'
        this.typeData.push(elem)
        DrugTypeService.getType(params).then(res => {
          for (let elem of res.data) {
            elem.title = elem.drugTypeName + '(' + elem.drugNum + ')'
            elem.loading = false
            elem.children = []
            this.typeData.push(elem)
          }
        })
      })
    },
    loadType(item, callback) {
      let params = {
        conditions: [{
          queryType: 'eq',
          field: 'pid',
          value: item.id
        }]
      }
      DrugTypeService.getType(params).then(res => {
        for (let elem of res.data) {
          elem.title = elem.drugTypeName + '(' + elem.drugNum + ')'
          if (elem.childNum > 0) {
            elem.loading = false
            elem.children = []
          }
        }
        callback(res.data)
      })
    },
    // 根据点击的类型展示对应的药品
    showDrug(item) {
      let params = {
        conditions: [{
          queryType: item[0].id === 'isnull' ? 'isnull' : 'like',
          field: 'drugTypes',
          value: item[0].id
        }]
      }
      DrugService.page(params).then(res => {
        console.log(res)
        this.$refs.table.dealResponseData({ ...res
        })
      })
    },
    addDrug(flag) {
      this.$router.push({
        name: 'addDrug',
        params: {
          sourceRoute: this.$route,
          drugFlag: flag
        }
      })
    },
    // 修改按钮 点击
    modifyClick(row) {
      let flag
      if (this._.isNil(row.nmpn) || row.nmpn === '') {
        flag = 'china'
      } else {
        flag = 'west'
      }
      this.$router.push({
        name: 'addDrug',
        params: {
          sourceRoute: this.$route,
          drugFlag: flag,
          drugId: row.id
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      DrugService.logicDelete(row.id).then((resp) => {
        if (resp.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    }
  },
  mounted: function () {
    // 初始化药品类型树
    this.initType()
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>

<style lang="less">
</style>
