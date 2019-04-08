<template>
  <div>
    <Card>
      <Row :gutter="5">
        <i-col>
          <LegaTable ref="table" :options="options" @importData="handleImportDataAction" @exportData="handleExportDataAction" @addClick="openCreateModule" @handleDropDownItemClick="handleDropDownItemClick">
          </LegaTable>
        </i-col>
      </Row>
    </Card>
  </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { ResidentService } from '@/api/ehr/resident'
import { TreeUtil } from '@/utils/TreeUtil'
import { mapGetters } from 'vuex'
export default {
  name: 'ResidentList',
  components: {
    LegaTable
  },
  data() {
    return {
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
        permissionPerfix: this.$route.name,
        buttons: [
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            clickName: 'addClick',
            permissionSuffix: 'btn:resident:add'
          },
          {
            type: 'primary',
            name: '导入',
            customIcon: 'iconfont icon-daoru',
            iconSize: 12,
            clickName: 'importData'
            // permissionSuffix: 'view'
          },
          {
            type: 'primary',
            name: '导出',
            customIcon: 'iconfont icon-export',
            iconSize: 12,
            clickName: 'exportData',
            permissionSuffix: 'view'
          }
        ],
        url: `${ResidentService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'profileNumber',
            title: '个人档案编号'
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
            key: 'idNumber',
            title: '身份证号码'
          },
          {
            key: 'telephone',
            title: '联系电话'
          },
          {
            key: 'currentAddress',
            title: '现住址'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'modify', permissionSuffix: 'btn:resident:modify' },
              { key: 'delete', permissionSuffix: 'btn:resident:logic:delete' },
              { key: 'view', permissionSuffix: 'btn:resident:view' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [
            {
              type: 'select',
              label: '性别',
              prop: 'gender',
              tip: '请选择性别',
              r: rowItem => {
                return this.dictDatasWithGroupKey('gender')
              }
            },
            {
              type: 'input',
              label: '联系电话',
              prop: 'telephone',
              tip: '请输入联系电话'
            }
          ],
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
              label: '身份证号码',
              prop: 'idNumber',
              tip: '请输入身份证号码'
            },
            {
              type: 'input',
              label: '姓名',
              prop: 'name',
              tip: '请输入姓名'
            }
          ]
        }
      }
    }
  },
  methods: {
    handleImportDataAction() {
      this.$router.push({
        name: 'residentImportPage'
      })
    },
    handleExportDataAction() {
    },
    handleDropDownItemClick: function(actionName) {
      const vm = this
      if (vm._.isFunction(vm[actionName])) {
        vm[actionName]()
      }
    },
    modifyClick(row) {
      this.$router.push({
        name: 'residentListForm',
        params: {
          sourceRoute: this.$route,
          resident: row
        }
      })
    },
    viewClick(row) {
      this.$router.push({
        name: 'residentProfileView',
        params: {
          sourceRoute: this.$route,
          residentId: row.id
        }
      })
    },
    openCreateModule() {
      this.$router.push({
        name: 'residentListForm',
        params: {
          sourceRoute: this.$route
        }
      })
    },
    /** 点击删除按钮 */
    deleteClick(row) {
      ResidentService.logicDelete(row.id).then((resp) => {
        if (resp.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>
<style  scoped>
</style>
