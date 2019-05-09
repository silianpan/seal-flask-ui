<!--
字典数据项 界面
@author hsc
@date 2018-10-29
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" @goBack="goBack" @addClick="openCreateModule" >
        </LegaTable>
      </i-Col>
    </Row>
  </Card>
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import {
  DictItemService
} from '@/api/admin/dict'
import {
  mapGetters
} from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      dictGroup: {},
      options: {
        queryDataAction: this.queryDictItemsAction,
        actionsHandle: {
          modify: (params, column) => {
            this.modifyClick(params.row || {})
          },
          delete: (params, column) => {
            this.deleteClick(params.row || {})
          }
        },
        permissionPerfix: 'dictManager',
        buttons: [
          {
            name: '返回',
            icon: 'ios-arrow-back',
            clickName: 'goBack'
          },
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:dictItem:add'
          }],
        columns: [{
          key: 'dict_key',
          title: '名称'
        },
        {
          key: 'dict_value',
          title: '值'
        },

        {
          key: 'groupCode',
          title: '字典类型编码'
        },
        {
          key: 'description',
          title: '字典项描述'
        },
        {
          key: 'enable',
          title: '是否启用'
        },
        {
          title: '操作',
          key: 'action',
          render: [{
            key: 'modify',
            permissionSuffix: 'btn:dictItem:modify'
          }, {
            key: 'delete',
            permissionSuffix: 'btn:dictItem:logic:delete'
          }]
        }
        ],
        searchOptions: {
          hiddenItems: [{
            type: 'input',
            label: '字典项描述',
            prop: 'description',
            tip: '字典项描述'
          }],
          showItems: [{
            type: 'input',
            label: '名称',
            prop: 'dict_key',
            tip: '名称'
          },
          {
            type: 'input',
            label: '值',
            prop: 'dict_value',
            tip: '值'
          },
          {
            type: 'input',
            label: '是否启用',
            prop: 'active',
            tip: '是否启用'
          }
          ]

        }

      }
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'dictManager'
      })
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      DictItemService.findById(row.id).then(resp => {
        if (resp.status === 0) {
          this.$router.push({
            name: 'dictItemForm',
            params: resp.data
          })
        } else {

        }
      })
    },
    /** 打开新增弹窗 */
    openCreateModule() {
      if (!this._.isNil(this.dictGroup.code)) {
        this.$router.push({
          name: 'dictItemForm',
          params: {
            groupCode: this.dictGroup.code
          }
        })
      } else {
        this.$Message.warning('请返回选择字典类型')
      }
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      DictItemService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    },
    queryDictItemsAction: async function (params = {
      conditions: []
    }, callback) {
      if (!this._.isNil(this.dictGroup.code) && !this._.isEmpty(this.dictGroup.code)) {
        // let _c = params.conditions || []
        // _c.push({
        //   field: 'groupCode',
        //   queryType: 'eq',
        //   value: this.dictGroup.code
        // })
        // params.conditions = _c
        params.group_code = this.dictGroup.code
        let res = await DictItemService.findAll(params)
        callback(res)
      }
    },
    init() {
      let params = this.$route.params || {}
      this.dictGroup = params
      if (!this._.isNil(params.code) && !this._.isEmpty(params.code)) {
        this.$nextTick(() => {
          this.$refs.table.reLoad()
        })
      }
    }
  },

  mounted() {
    this.init()
  },
  computed: {
    ...mapGetters(['elements', 'hasElementsPerimByKey', 'dictDatasWithGroupKey', 'dictFormatter'])
  }
}
</script>

<style  scoped>
</style>
