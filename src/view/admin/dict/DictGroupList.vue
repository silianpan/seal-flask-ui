<!--
字典分组 界面
@author hsc
@date 2018-10-29
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" @addClick="openCreateModule">
        </LegaTable>
      </i-Col>
    </Row>
  </Card>
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import {
  DictGroupService
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
      modal: {
        title: '新增',
        visible: false,
        code: 'create',
        buttonLoading: false
      },
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
          }
        },
        permissionPerfix: 'dictManager',
        queryParmas: {
          asec: ['create_time']
        },
        buttons: [
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:dictGroup:add'
          }],
        url: `${DictGroupService.baseUrlPrefix}/page`,
        columns: [{
          key: 'name',
          title: '类型名称'
        },
        {
          key: 'code',
          title: '类型编码',
          render: (h, params) => {
            return h(
              'span',
              {
                attrs: {
                  style: 'color:#2b85e4; cursor: pointer;'
                },
                on: {
                  click: event => {
                    this.$router.push({
                      name: 'dictItemList',
                      params: params.row
                    })
                  }
                }
              },
              params.row.code
            )
          }
        },
        {
          key: 'description',
          title: '类型描述'
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
            permissionSuffix: 'btn:dictGroup:modify'
          }, {
            key: 'delete',
            permissionSuffix: 'btn:dictGroup:logic:delete'
          }]
        }
        ],
        searchOptions: {
          hiddenItems: [

          ],
          showItems: [{
            type: 'input',
            label: '类型名称',
            prop: 'name',
            tip: '类型名称'
          },
          {
            type: 'input',
            label: '类型编码',
            prop: 'code',
            tip: '类型编码'
          },
          {
            type: 'input',
            label: '类型描述',
            prop: 'description',
            tip: '类型描述'
          }
          ]

        }

      }
    }
  },
  methods: {
    /** 修改按钮 点击 */
    modifyClick(row) {
      DictGroupService.findById(row.id).then(resp => {
        // response.data
        if (resp.ok()) {
          this.$router.push({
            name: 'dictGroupForm',
            params: resp.data
          })
        } else {

        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {

    },
    /** 新增 */
    openCreateModule() {
      this.$router.push('dictGroupForm')
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      DictGroupService.logicDelete(row.id).then((res) => {
        if (res.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
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
