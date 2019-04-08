<!-- 个人设置 -->
<template>
<div>
  <Card>
    <Layout>
      <Sider hide-trigger :style="{background: '#fff'}">
        <Menu width="auto" :theme="theme" :active-name="currentComponent">
          <MenuItem v-for="(item, index) in menuItems" :key="index" :name="item.name">{{item.label}}</MenuItem>
        </Menu>
      </Sider>
      <Layout :style="{padding: '10px'}">
        <Content :style="{padding: '10px', minHeight: '280px', background: '#fff'}">
          <component :is="currentComponent" :userId="userId"></component>
        </Content>
      </Layout>
    </Layout>
  </Card>
</div>
</template>

<script>
import PersionalBaseSetting from './PersionalBaseSetting'
export default {
  props: {
    userId: String
  },
  components: {
    PersionalBaseSetting
  },
  data() {
    return {
      theme: 'light',
      currentComponent: 'PersionalBaseSetting',
      menuItems: [
        {
          label: '基本设置',
          name: 'PersionalBaseSetting'
        }
      ]
    }
  },
  methods: {},
  mounted: function () {},
  computed: {}
}
</script>

<style  scoped>
</style>
