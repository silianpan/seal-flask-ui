<!--
医疗机构信息表 界面
@author hsc
@date 2018-11-28
created by scaffold
-->
<template>
<div>
  <Card>
    <Row :gutter="5">
      <i-Col>
        <LegaTable ref="table" :options="options" @addClick="handleAddClickAction">
        </LegaTable>
      </i-Col>
    </Row>
  </Card>
</div>
</template>

<script>
import LegaTable from '@/components/table/LegaTable'
import {
  MedicalOrgService
} from '@/api/ehr/org'
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
        ],
        url: `${MedicalOrgService.baseUrlPrefix}/page/info`,
        columns: [{
          key: 'name',
          title: '名称'
        },
        {
          key: 'code',
          title: '编码'
        },
        {
          key: 'type',
          title: '类型',
          dictGroup: 'medicalOrgType',
          render: 'dictFormatter'
        },
        {
          key: 'levelName',
          title: '级别'
        },
        {
          key: 'orgCategoryName',
          title: '类别'
        },
        {
          key: 'ipAddress',
          title: '客户端ip地址'
        },
        {
          title: '户数（户）',
          key: 'familyNums',
          render: (h, params, column) => {
            return h('span', params.row.familyNums || '未知')
          }
        },
        {
          title: '人口（人）',
          key: 'residentNums',
          render: (h, params, column) => {
            return h('span', params.row.residentNums || '未知')
          }
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   render: [{
        //     key: 'modify',
        //     permissionSuffix: 'btn_update'
        //   }, {
        //     key: 'delete',
        //     permissionSuffix: 'btn_delete'
        //   }]
        // }
        ],
        searchOptions: {
          hiddenItems: [

            {
              type: 'input',
              label: '级别',
              prop: 'level',
              tip: '医疗机构级别'
            }

          ],
          showItems: [{
            type: 'input',
            label: '名称',
            prop: 'name',
            tip: '医疗机构名称'
          },
          {
            type: 'input',
            label: '编码',
            prop: 'code',
            tip: '医疗机构编码'
          },
          {
            type: 'input',
            label: '类别',
            prop: 'orgCategoryId',
            tip: '医疗机构类别'
          },
          {
            type: 'input',
            label: '类型',
            prop: 'type',
            tip: '医疗机构类型'
          }
          ]
        }

      }
    }
  },
  methods: {
    /** 修改按钮 点击 */
    modifyClick(row) {
      MedicalOrgService.findById(row.id).then(resp => {
        // response.data
        if (resp.status === 0) {
          this.handleModifyAction(resp.data)
        } else {

        }
      })
    },
    /** 查看详情按钮点击 */
    viewClick(row) {

    },
    /** 新增 */
    handleAddClickAction() {

    },
    handleModifyAction(data) {

    },
    /** 点击删除按钮 */
    deleteClick(row) {
      MedicalOrgService.delete(row.id).then(() => {
        this.$Message.success('删除成功！')
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
