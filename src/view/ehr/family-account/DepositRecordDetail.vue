<!--  -->
<template>
<div>
  <LegaTable ref="table" :options="options"  @query-data-action="findDepositDetails">
  </LegaTable>
</div>
</template>

<script>
import { ChargeRecordsDetailService } from '@/api/ehr/account'
export default {
  props: {
    seqId: String
  },
  components: {},
  data() {
    return {
      options: {
        pageination: false,
        columns: [
          {
            key: 'seqId',
            title: '流水号'
          },
          {
            key: 'money',
            title: '充值金额',
            render: (h, params) => {
              const row = params.row
              return h('span', `${row.money} 元`)
            }
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
            key: 'crtTime',
            title: '充值时间'
          }
        ]
      }
    }
  },
  methods: {
    async findDepositDetails(params) {
      const res = await ChargeRecordsDetailService.findChargeDetailInfoBySeq(this.seqId)
      if (res.status === 0) {
        this.$refs.table.dealResponseData(res)
      }
    }
  },
  mounted: function () {},
  computed: {},
  watch: {
  }
}
</script>

<style  scoped>
</style>
