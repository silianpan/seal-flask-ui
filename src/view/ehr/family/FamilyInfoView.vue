<!--
  家庭信息卡片
-->
<template>
<div class="family-info-view">
  <!-- 家庭信息 -->
  <Card >
    <Divider >
      <h3>家庭基本信息</h3>
    </Divider>
    <Row>
      <i-col :xs="24" :sm="24" :lg="12" :md="12">
         <span style="font-weight: bold;font-size:16px">户主:</span><span style="margin-left:10px">{{value.houseOwnerName || '暂无'}}</span>
      </i-col>
       <i-col :xs="24" :sm="24" :lg="12" :md="12">
         <span style="font-weight: bold;font-size:16px">户号:</span><span style="margin-left:10px">{{value.familyAccount}}</span>
      </i-col>
    </Row>
    <Row>
      <i-col :xs="24" :sm="24" :lg="12" :md="12">
        <span style="font-weight: bold;font-size:16px">户属性:</span> <span style="margin-left:10px">{{dictFormatter("householdProp",value.householdProp)}}</span>
      </i-col>
       <i-col :xs="24" :sm="24" :lg="12" :md="12">
        <span style="font-weight: bold;font-size:16px">参合属性:</span> <span style="margin-left:10px">{{dictFormatter("partAttr",value.partAttr)}}</span>
      </i-col>
    </Row>
  </Card>
  <Card>
  <Divider >
    <h3>地址信息</h3>
  </Divider>
  <Row>
    <i-col :xs="24" :sm="24" :lg="12" :md="12">
      <span style="font-weight: bold;font-size:16px">所属区域:</span> <span style="margin-left:10px">{{formatArea(value)}}</span>
    </i-col>
    <i-col :xs="24" :sm="24" :lg="12" :md="12">
      <span style="font-weight: bold;font-size:16px">地址:</span> <span style="margin-left:10px">{{value.address}}</span>
    </i-col>
  </Row>
  </Card>
  <Card>
  <Divider >
    <h3>居住及卫生设施条件</h3>
  </Divider>
  <Row>
   <i-col :xs="24" :sm="24" :lg="12" :md="12">
     <span style="font-weight: bold;font-size:16px">常住人口数:</span> <span style="font-size:1.2em;margin-left:10px">{{value.population || 0}} 人</span>
    </i-col>
    <i-col :xs="24" :sm="24" :lg="12" :md="12">
      <span style="font-weight: bold;font-size:16px">年收入:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('yearlyIncome',value.yearlyIncome) }}</span>
    </i-col>
    <i-col :xs="24" :sm="24" :lg="12" :md="12">
      <span style="font-weight: bold;font-size:16px">住房类型:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('housingType',value.housingType) }}</span>
    </i-col>
     <i-col :xs="24" :sm="24" :lg="12" :md="12">
      <span style="font-weight: bold;font-size:16px">住房面积:</span> <span style="font-size:1.2em;margin-left:10px">{{value.dwellingArea|| 0 }} 平方米</span>
    </i-col>
     <i-col :xs="24" :sm="24" :lg="12" :md="12">
     <span style="font-weight: bold;font-size:16px">燃料类型:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('fuelType',value.fuelType) }}</span>
    </i-col>
    <i-col :xs="24" :sm="24" :lg="12" :md="12">
     <span style="font-weight: bold;font-size:16px">饮用水来源:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('drinkingWater',value.drinkingWater) }}</span>
    </i-col>
     <i-col :xs="24" :sm="24" :lg="12" :md="12">
     <span style="font-weight: bold;font-size:16px">厕所类型:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('toiletType',value.toiletType) }}</span>
    </i-col>
     <i-col :xs="24" :sm="24" :lg="12" :md="12">
     <span style="font-weight: bold;font-size:16px">禽畜栏:</span> <span style="font-size:1.2em;margin-left:10px">{{dictFormatter('corral',value.corral) }}</span>
    </i-col>
  </Row>
  </Card>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  props: {
    value: Object
  },
  components: {},
  data() {
    return {
    }
  },
  methods: {
    formatArea: (data) => {
      const _d = JSON.parse(JSON.stringify(data || {}))
      let {
        province,
        city,
        county,
        village
      } = _d
      province = JSON.parse(province || '{}')
      city = JSON.parse(city || '{}')
      county = JSON.parse(county || '{}')
      village = JSON.parse(village || '{}')
      return `${(province.name || '')} - ${(city.name || '')} - ${(county.name || '')} - ${(village.name || '')}`
    }
  },
  watch: {
    // value: {
    //   handler: function () {
    //     this.init()
    //   },
    //   deep: true
    // }
  },
  mounted: function () {
  },
  computed: {
    ...mapGetters([
      'dictDatasWithGroupKey',
      'dictFormatter'
    ])
  }
}
</script>

<style  scoped>
.family-info-view .ivu-card {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
