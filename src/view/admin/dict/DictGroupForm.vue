<!-- 新增字典类型 -->
<template>
<div>
  <Card>
    <p slot="title">{{_.isNil(dictId)?'新增字典类型':'修改字典类型'}}</p>
    <Row>
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' :loading='buttonLoading' @click.native='handleSaveClick'>
          <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
      </ButtonGroup>
    </Row>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="18" :md="16" :lg="16">
        <lega-form :labelWidth="100" ref="form" :form-item-data="formItemData" :form-rules="formRules"></lega-form>
      </i-col>
    </Row>
  </Card>
</div>
</template>

<script>
import {
  DictGroupService
} from '@/api/admin/dict'
export default {
  components: {},
  mounted() {
    this.init()
  },
  data() {
    const vm = this
    return {
      buttonLoading: false,
      dictId: undefined,
      formItemData: [
        [{
          type: 'input',
          label: '字典类型编码',
          prop: 'code'
        }],
        [{
          type: 'input',
          label: '字典类型名称',
          prop: 'name'
        }],
        [{
          type: 'switch',
          label: '是否启用',
          prop: 'enable'
        }],
        [{
          type: 'textArea',
          label: '描述',
          prop: 'description'
        }]
      ],
      formRules: {
        code: [{
          required: true,
          trigger: 'blur',
          validator: function (rule, value, validCallback = function () {}) {
            if (vm._.isNil(value) || vm._.isEmpty(value)) {
              validCallback([new Error('请填写字典类型编码')])
            } else {
              let _params = []
              if (!vm._.isNil(vm.dictId) && !vm._.isEmpty(vm.dictId)) {
                _params.push({
                  field: 'id',
                  queryType: 'neq',
                  value: vm.dictId
                })
              }
              _params.push({
                field: 'code',
                queryType: 'eq',
                value: value
              })
              // 验证 字典类型编码 重复
              DictGroupService.countByCondition(_params).then(res => {
                if (res.status === 0) {
                  if (res.data !== 0) {
                    validCallback([new Error('字典类型编码已经存在')])
                  } else {
                    validCallback(rule.message)
                  }
                } else {
                  validCallback([new Error(res.msg)])
                }
              })
            }
          }
        }],
        name: [{
          required: true,
          message: '请填写字典类型名称',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {

    init() {
      if (this.$route.params) {
        this.dictId = this.$route.params.id
        this.$refs['form'].setFormFieldsData(this.$route.params)
      }
    },
    handleSaveClick() {
      const vm = this
      var opt = {
        fail: function () {
          vm.$Message.error('数据格式不正确')
        }
      }
      let msg = '信息更改成功'
      opt.success = function (params) {
        if (vm._.isNil(params.id) || vm._.isEmpty(params.id)) {
          msg = '新增成功'
        }
        console.log(params)
        DictGroupService.save(params).then((res) => {
          if (res.status === 0) {
            vm.$Message.success(msg)
            vm.goBack()
          } else {
            vm.$Message.error('失败')
          }
        })
      }
      vm.$refs['form'].validate(opt)
    },
    goBack() {
      this.$router.push('dictManager')
    }
  }
}
</script>

<style scoped>
.ivu-row {
  margin-bottom: 15px;
}
</style>
