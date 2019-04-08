<!-- 新增字典项 -->
<template>
  <div>
    <Card>
    <p slot="title">{{_.isNil(dictItem.id)?'新增字典类型':'修改字典类型'}}</p>
    <Row style="margin-bottom:10px">
      <ButtonGroup>
        <i-button @click.native='goBack'>
          <Icon type="ios-arrow-back" />返回</i-button>
        <i-button type='primary' :loading='buttonLoading' @click.native='handleSaveClick' >
          <Icon custom="iconfont icon-baocun" size=12 /> 保存</i-button>
      </ButtonGroup>
    </Row>
    <Row type="flex" justify="center">
      <i-col :xs="24" :sm="18" :md="16" :lg="16">
         <lega-form  ref="form" :form-item-data="formItemData" :form-rules="formRules" ></lega-form>
      </i-col>
    </Row>
  </Card>
  </div>
</template>

<script>
import { DictItemService } from '@/api/ehr/dict'
export default {
  components: {
  },
  mounted() {
    this.init()
  },
  data() {
    const vm = this
    return {
      buttonLoading: false,
      dictItem: {},
      formItemData: [
        [
          {
            type: 'input',
            label: '名称',
            prop: 'dictKey'
          }
        ],
        [
          {
            type: 'input',
            label: '值',
            prop: 'dictValue'
          }
        ],
        [
          {
            type: 'switch',
            label: '是否启用',
            prop: 'enable'
          }
        ],
        [
          {
            type: 'textArea',
            label: '描述',
            prop: 'description'
          }
        ]
      ],
      formRules: {
        dictValue: [
          {
            required: true,
            trigger: 'blur',
            validator: function(rule, value, validCallback = function () {}) {
              if (vm._.isNil(value) || vm._.isEmpty(value)) {
                validCallback([new Error('请填写字典项值')])
              } else {
                let _params = []
                if (!vm._.isNil(vm.dictItem.id) && !vm._.isEmpty(vm.dictItem.id)) {
                  _params.push({
                    field: 'id',
                    queryType: 'neq',
                    value: vm.dictItem.id
                  })
                }
                _params.push({
                  field: 'dictValue',
                  queryType: 'eq',
                  value: value
                })
                _params.push({
                  field: 'groupCode',
                  queryType: 'eq',
                  value: vm.dictItem.groupCode
                })
                // 验证 字典类型编码 重复
                DictItemService.countByCondition(_params).then(res => {
                  if (res.status === 0) {
                    if (res.data !== 0) {
                      validCallback([new Error('字典项值已经存在')])
                    } else {
                      validCallback(rule.message)
                    }
                  } else {
                    validCallback([new Error(res.msg)])
                  }
                })
              }
            }
          }
        ],
        dictKey: [
          { required: true, message: '请填写字典项名称', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    init() {
      if (this.$route.params) {
        this.dictItem = this.$route.params
        this.$refs['form'].setFormFieldsData(this.$route.params)
      } else {
        this.$Message.warning(
          '没有指定字典类型，请从字典类型界面进入，新增字典'
        )
      }
    },
    handleSaveClick: function() {
      const vm = this
      vm.buttonLoading = true
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
        if (vm._.isNil(params.groupCode) || vm._.isEmpty(params.groupCode)) {
          this.$Message.warning(
            '没有指定字典类型，请从字典类型界面进入，新增字典'
          )
          return
        }
        DictItemService.save(params).then((res) => {
          if (res.status === 0) {
            vm.$Message.success(msg)
            vm.goBack()
          } else {
            vm.$Message.error('失败')
          }
          vm.buttonLoading = false
        })
      }
      vm.$refs['form'].validate(opt)
    },
    goBack: function() {
      this.$router.push({
        name: 'dictItemList',
        params: {
          code: this.dictItem.groupCode
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
