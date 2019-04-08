<!--
 界面
@author 49773
@date 2018-10-23
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
    <Modal width="80%" :title="modal.title" v-model="modal.visible" :mask-closable="false" @on-visible-change="setFormEmpty" :closable="noSaving">
      <LegaForm ref="typeForm" :labelWidth="caseFormContent.labelWidth" :formItemData="caseFormContent.formItemData" :formRules="caseFormContent.formRules"></LegaForm>
      <div slot='footer'>
        <i-button type='text' size='large' @click.native='hiddenModal' v-if="noSaving">取消</i-button>
        <span style="color: red" v-else>{{description}}&emsp;</span>
        <i-button type='primary' size='large' :loading='modal.buttonLoading' @click.native='okClick'>确定</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
import LegaTable from '@/components/table/LegaTable'
import { DrugTypeService, DrugService } from '@/api/ehr/drug'
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {},
  components: {
    LegaTable
  },
  data() {
    return {
      description: '', // 保存时的进度描述
      noSaving: true, // 判断是否没有处于保存状态
      typeId: null, // 存放当前选择的类型id
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
            permissionSuffix: 'btn:drugType:add'
          }
        ],
        url: `${DrugTypeService.baseUrlPrefix}/page`,
        columns: [
          {
            key: 'drugTypeName',
            title: '药品类型名'
          },
          {
            title: '操作',
            key: 'action',
            render: [
              { key: 'modify', permissionSuffix: 'btn:drugType:modify' },
              { key: 'delete', permissionSuffix: 'btn:drugType:delete' }
            ]
          }
        ],
        searchOptions: {
          hiddenItems: [],
          showItems: [
            {
              type: 'input',
              label: '药品类型名',
              prop: 'drugTypeName',
              tip: '药品类型名'
            }
          ]
        }
      },
      caseFormContent: {
        labelWidth: 80,
        formItemData: [
          [
            {
              type: 'input',
              label: '药品类型名',
              prop: 'drugTypeName',
              tip: '类型名'
            }
          ],
          [
            {
              type: 'cascader',
              label: '上一级类型',
              prop: 'pid',
              tip: '不选为最上层类型',
              r: rowItem => {
                return this.cascaderData
              }
            }
          ]
        ],
        formRules: {
          drugTypeName: [{ required: true, message: '不能为空', trigger: 'blur' }]
        }
      }
    }
  },
  methods: {
    ...mapActions(['getAllType']),
    // 修改按钮 点击
    modifyClick(row) {
      this.typeId = row.id
      DrugTypeService.findById(row.id).then(resp => {
        let list = this.findParents(this.$store.state.drug.typeData, resp.data.pid)
        resp.data.pid = list
        if (resp.status === 0) {
          this.$refs.typeForm.setFormFieldsData(resp.data)
          this.openModifyModule()
        } else {
        }
      })
    },
    // 打开修改弹窗
    openModifyModule() {
      this.modal.visible = true
      this.modal.code = 'update'
      this.modal.title = '修改'
    },
    // 打开新增弹窗
    openCreateModule() {
      this.modal.visible = true
      this.modal.code = 'create'
      this.modal.title = '新增'
    },
    // 点击删除按钮
    deleteClick(row) {
      DrugTypeService.logicDelete(row.id).then((res) => {
        if (resp.ok()) {
          this.$Message.success('删除成功！')
        }
        this.$refs['table'].reLoad()
      })
    },
    // 表单弹窗点击确定按钮
    okClick() {
      this.modal.buttonLoading = true
      this.noSaving = false
      this.description = '正在保存，请稍后'
      this.$refs.typeForm.validate({
        success: async params => {
          let pids = JSON.parse(JSON.stringify(params.pid)) // 存放当前类型链
          if (pids.indexOf(this.typeId) !== -1) {
            this.$Message.error('上一级类型不能是自身或其子类型')
            this.modal.buttonLoading = false
            this.noSaving = true
            this.description = ''
            return
          }
          if (!this._.isNil(params.pid)) {
            params.pid = pids[pids.length - 1]
          }
          if (this.modal.code === 'update') { // 判断修改
            params.id = this.typeId
          }
          let res = await DrugTypeService.save(params)
          if (res.msg === '操作成功') {
            this.getAllType() // 调用查询，刷新类型树缓存
            this.description = '正在修改该类型关联的药品，请稍后'
            let options = { drugType: params.id, drugTypes: JSON.stringify(pids) }
            let flag = await DrugService.updateDrug(options)
            this.modal.buttonLoading = false
            this.noSaving = true
            this.description = ''
            this.modal.visible = false
            if (flag.data === true) {
              this.$Message.success('保存成功')
            } else {
              this.$Message.warning({
                content: '药品修改失败，请重试或手动修改',
                duration: 3.5
              })
            }
            this.$refs.typeForm.setFormFieldsData({ drugTypeName: undefined, pid: undefined }) // 清空表单值
            this.$refs.table.reLoad()
          }
        },
        fail: () => {
          this.modal.buttonLoading = false
          this.modal.visible = false
          this.$Message.error('保存失败')
          this.noSaving = true
        }
      })
    },
    // 隐藏弹窗
    hiddenModal() {
      const vm = this
      this.$refs.typeForm.setFormFieldsData({ drugTypeName: undefined, pid: undefined })
      vm.modal.buttonLoading = false
      this.noSaving = true
      vm.modal.visible = false
    },
    covertDataToTree(arr) {
      let rt = []
      arr.forEach(child => {
        child.label = child.drugTypeName
        child.value = child.id
        let findParent = false
        if (!this._.isNil(child.pid)) {
          arr.forEach(parent => {
            if (parent.id === child.pid) {
              findParent = true
              if (this._.isNil(parent.children)) {
                parent.children = []
              }
              parent.children.push(child)
            }
          })
        }
        if (!findParent) {
          rt.push(child)
        }
      })
      return rt
    },
    findParents(arr, id, rt = []) {
      if (this._.isNil(id)) {
        return []
      }
      for (let obj of arr) {
        if (obj.id === id) {
          if (this._.isNil(obj.pid)) {
            rt.push(obj.id)
            return rt
          } else {
            this.findParents(arr, obj.pid, rt)
          }
          rt.push(obj.id)
        }
      }
      return rt
    },
    setFormEmpty() {
      if (this.modal.visible === false) {
        this.$refs.typeForm.setFormFieldsData({ drugTypeName: undefined, pid: undefined })
      }
    }
  },
  mounted: function() {
    this.getAllType()
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    // 显示药品类型级联菜单
    cascaderData() {
      let arr = JSON.parse(JSON.stringify(this.$store.state.drug.typeData))
      let options = this.covertDataToTree(arr)
      return options
    }
  }
}
</script>
<style  scoped>
</style>
