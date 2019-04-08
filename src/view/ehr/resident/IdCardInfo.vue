<!--  -->
<template>
<div>
  <Card>
    <div class="id-card-info">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="photo">
        <img v-if="!_.isNil(photoSrc)" :src="photoSrc" style="width:100px;height:120px"  />
        <Icon v-else custom="iconfont icon-user__easyico" size="50"></Icon>
      </div>
      <Row type="flex">
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <span class="info-label">姓名</span>
          <span>{{name || '未知'}}</span>
        </i-col>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <span class="info-label">性别</span>
          <span>{{gender || '未知'}}</span>
          <span class="info-label" style="margin-left:10px">民族</span>
          <span>{{nationality || '未知'}}</span>
        </i-col>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <span class="info-label">出生</span>
          <span v-if="_moment(birthday).isValid()">{{ _moment(birthday).format("YYYY年MM月DD日")}}</span>
          <span v-else>未知</span>
        </i-col>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <span class="info-label">住址</span>
          <span>{{address || ''}}</span>
        </i-col>
        <i-col :xs="24" :sm="24" :md="24" :lg="24">
          <span class="info-label">公民身份号码</span>
          <span>{{idNumber || ''}}</span>
        </i-col>
      </Row>
    </div>
  </Card>
</div>
</template>

<script>
export default {
  name: 'IdCardInfo',
  props: {
    photoSrc: String,
    name: String,
    idNumber: String,
    gender: String,
    nationality: String,
    birthday: [String, Date],
    address: String
  },
  components: {},
  data() {
    return {
      spinShow: false
    }
  },
  methods: {},
  mounted: function () {},
  computed: {}
}
</script>

<style  scoped>
.id-card-info .info-label {
  margin: 10px;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  color: steelblue;
}

.id-card-info .photo {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: bottom;
  text-align: center;
  position: relative;
  float: right;
  top: 10px;
  width: 100px;
  height: 120px;
}

.id-card-info .ivu-col {
  margin-bottom: 10px;
}
</style>
