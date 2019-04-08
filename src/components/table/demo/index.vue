<template>
  <div>
    <LegaTable ref="table" :options="options">
    </LegaTable>
  </div>
</template>
<script>
import { ResidentService } from '@/api/ehr/resident'
export default {
  data() {
    return {
      options: {
        actionsHandle: {
          modify: (params, column) => {},
          view: (params, column) => {},
          delete: (params, column) => {
            console.log('删除', params, column)
          }
        },
        permissionPerfix: this.$route.name,
        buttons: [
          {
            type: 'primary',
            name: '新增',
            icon: 'md-add',
            size: 'small',
            clickName: 'addClick',
            permissionSuffix: 'btn_add'
          },
          {
            type: 'primary',
            name: '导出',
            size: 'small',
            clickName: 'addClick',
            permissionSuffix: 'view2'
          }
        ],
        url: `${ResidentService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'id',
            title: '个人档案编号'
          },
          {
            key: 'name',
            title: '姓名'
          },
          {
            key: 'gender',
            title: '性别',
            render: (h, params) => {
              let _row = params.row || {}
              let _col = params.column || {}
              let _formated = this.dictFormatter('gender', _row[_col.key])
              return h('div', _formated)
            }
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
            key: 'address',
            title: '详细地址'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              'delete',
              { key: 'delete', permissionSuffix: 'btn_delete2' }
            ]
          }
        ]
      }
    }
  }
}
</script>
