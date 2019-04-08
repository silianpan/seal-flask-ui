<template :lang="local">
<Layout style="height: 100%" class="main">
  <Sider :style="{ height: '100vh'}" breakpoint="md" hide-trigger collapsible :width="256" :collapsed-width="80" v-model="collapsed">
    <side-menu accordion :active-name="activeMenu" :collapsed="collapsed" @on-select="handleSideMenuSelectAction" :menu-list="menuList">
      <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
      <div class="logo-con">
        <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
        <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
    </side-menu>
  </Sider>
  <Layout>
    <Header class="header-con" >
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <user :user-avator="userAvator" />
        <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" />
        <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
      </header-bar>
    </Header>
    <Content  class="main-content-con">
      <Layout  class="main-layout-con">
        <div class="tag-nav-wrapper">
          <tags-nav :value="activeTagNav" @input="turnToPage" :list="tagNavList" @on-close="handleCloseTag" />
        </div>
        <Content class="content-wrapper" >
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="$route.meta && $route.meta.notCache === true" />
            <keep-alive v-else>
              <router-view />
            </keep-alive>
          </transition>
        </Content>
        <Footer style="height:20px;text-align:center;padding:0">
           成都青云石智能科技有限公司 技术支持
        </Footer>
      </Layout>
    </Content>
  </Layout>

</Layout>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import {
  mapMutations
} from 'vuex'
import {
  getNewTagList, getLatestTag
} from './components/tags-nav/utils.js'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    menusInfo() {
      return this.$store.state.user.menusInfo
    },
    activeMenu() {
      return `${this.activeTagNav.id}`
    },
    homeTag() {
      return this.$store.state.app.homeTag
    },
    activeTagNav() {
      return this.$store.state.app.activeTagNav
    },
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    tagRouter() {
      return this.$store.state.app.tagRouter
    },
    userAvator() {
      return this.$store.state.user.photo
    },
    menuList() {
      return this.$store.getters.menuList
    },
    local() {
      return this.$store.state.app.local
    }
    // dictRefreshTag() {
    //   return this.$store.state.dict.refreshTag
    // }
  },
  methods: {
    ...mapMutations(['setTagNavList', 'getMenuById', 'setActiveTagNav', 'resetTagNavList', 'addTagNav', 'setLocal']),

    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleSideMenuSelectAction(name) {
      let menuItem = this.menusInfo[name]
      this.turnToPage(menuItem)
    },
    /** 跳转到指定页面 */
    turnToPage(menuItem) {
      // let menuItem = this.getMenuById(name)
      let { route, config } = menuItem || {}
      // console.log(route, path, config)
      // 如果route 和 path 都为null 则 跳转到 此功能正在开发页面
      var matchRoute = this.$router.match({
        name: route || ''
      }, this.$route)
      if (matchRoute.matched.length === 0 && matchRoute.fullPath === '/') {
        // 跳转到 功能正在开发页面
        this.$router.push({
          name: 'nopage',
          params: menuItem
        }, (_route) => {
          this.setActiveTagNav(menuItem)
          this.setTagNavList(getNewTagList(this.tagNavList, menuItem))
        })
        return
      }
      let p = {}
      if (config && this._.isString(config)) {
        try {
          let configObj = JSON.parse(config)
          p = configObj.params || {}
        } catch (e) {
        }
      }
      this.$router.push({
        name: route || '',
        params: p
      }, (_route) => {
        this.setActiveTagNav(menuItem)
        this.setTagNavList(getNewTagList(this.tagNavList, menuItem))
      })
    },
    handleCloseTag(res, type, tagId) {
      let nextTag = getLatestTag(this.tagNavList, tagId)
      this.setTagNavList(res)
      if (type === 'all') {
        // 关闭所有，除了home
        this.turnToPage(this.homeTag)
      } else {
        if (this.tagNavList.length < 2) {
          nextTag = { ...this.homeTag }
        }
        if (tagId === this.activeTagNav.id) {
          this.turnToPage(nextTag)
        }
      }
    }
  },
  watch: {
    $route(newRoute) {
      // 判断是否拥有此route 的权限 ，没有则跳转到 无权限页面
      // console.log(newRoute)
    }
  },
  created () {
  },
  mounted() {
    // console.log(this.dictRefreshTag)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 获取卫生院数据
    this.$store.dispatch('findAreaData')
  }
}
</script>

<style lang="less">
.layout-container {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
</style>
