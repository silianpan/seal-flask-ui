<!--
物资 界面
@author panliu
@date 2018-11-02
created by scaffold
-->
<template>
    <div>
        <Card>
            <Row :gutter="5">
                <i-Col>
                    <LegaTable ref="table" :options="options" @addClick="add">
                    </LegaTable>
                </i-Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { MaterialService } from '@/api/ehr/material'
import { mapGetters } from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      options: {
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
        buttons: [
          {
            type: 'primary',
            name: '新增物资',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:material:add'
          }
        ],
        url: `${MaterialService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'materialName',
            title: '物资名称',
            render: (h, params) => {
              let str = params.row.materialName
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
            key: 'materialSpec',
            title: '物资规格'
          },
          {
            key: 'materialUnit',
            title: '物资单位',
            render: (h, params) => {
              return h('span', this.dictFormatter('drugPackUnit', params.row.materialUnit))
            }
          },
          {
            key: 'materialSale',
            title: '销售价格'
          },
          {
            key: 'materialFactory',
            title: '生产厂家'
          },
          {
            key: 'materialNameSpell',
            title: '生产厂家'
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
            key: 'status',
            title: '是否启用'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'modify', permissionSuffix: 'btn:material:modify' },
              { key: 'delete', permissionSuffix: 'btn:material:delete' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'input',
              label: '物资名称',
              prop: 'materialName',
              tip: '物资名称'
            },
            {
              type: 'select',
              label: '是否启用',
              prop: 'status',
              tip: '请选择',
              options: [
                {
                  id: '1',
                  name: '启用'
                },
                {
                  id: '0',
                  name: '停用'
                }
              ]
            }
          ]
        }
      }
    }
  },
  methods: {
    add() {
      this.$router.push({
        sourceRoute: this.$route,
        name: 'addMaterial'
      })
    },
    /** 修改按钮 点击 */
    modifyClick(row) {
      this.$router.push({
        name: 'addMaterial',
        params: {
          sourceRoute: this.$route,
          materialId: row.id
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      MaterialService.delete(row.id).then(() => {
        this.$Message.success('删除成功！')
        this.$refs['table'].reLoad()
      })
    }
  },
  mounted: function() {},
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
