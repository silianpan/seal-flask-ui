<!--
免疫计划表 界面
@author hsc
@date 2018-09-27
created by scaffold
-->
<!--  -->
<template>
    <div>
       <Table size="small" :loading="loading" :columns='options.columns' :data='options.data' border stripe></Table>
    </div>
</template>

<script>
import {
  VaccinationFactService
} from '@/api/ehr/inspection'
import { mapGetters } from 'vuex'
export default {
  props: {
    residentInfo: Object
  },
  components: {},
  data () {
    return {
      loading: false,
      options: {
        columns: [
          {
            key: 'head',
            title: '免疫执行表',
            align: 'center',
            children: [
              {
                key: 'name',
                title: '疫苗',
                render: (h, params) => {
                  return h('span', this.dictFormatter('vaccination', params.row.code))
                }
              },
              {
                key: 'times',
                title: '剂次'
              },
              {
                key: 'factTime',
                title: '接种日期',
                render: (h, params) => {
                  return h('span', this.dateFormatter(params.row.factTime))
                }
              },
              {
                key: 'inoculationSite',
                title: '接种部位',
                render: (h, params) => {
                  return h('span', this.dictFormatter('inoculationSite', params.row.inoculationSite))
                }
              },
              {
                key: 'lotNum',
                title: '疫苗批号'
              },
              {
                key: 'drugFactory',
                title: '生产企业'
              },
              {
                key: 'hospitalName',
                title: '接种单位'
              },
              {
                key: 'doctor',
                title: '医生'
              }
            ]
          }
        ],
        data: [
        ]
      }
    }
  },
  methods: {
    dateFormatter: function(value) {
      if (this._moment(value).isValid()) {
        return this._moment(value).format('YYYY-MM-DD')
      }
      return '未知'
    },
    init() {
      // 根据 个人档案编号
      if (this.residentInfo && this.residentInfo.profileNumber) {
        this.loading = true
        let conditions = [
          {
            field: 'profileNumber',
            queryType: 'eq',
            value: this.residentInfo.profileNumber
          }
        ]
        VaccinationFactService.findAll({
          conditions
        }).then(res => {
          if (res.ok()) {
            this.options.data = res.data
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    }
  },
  mounted: function() {
    this.init()
  },
  computed: {
    ...mapGetters([
      'dictFormatter'
    ])
  }
}

</script>
<style  scoped>
</style>
