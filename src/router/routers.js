import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

//  系统管理
const System = {
  path: '/adminSys',
  name: 'adminSys',
  component: Main,
  meta: {
    title: '系统管理'
  },
  children: [
    // 基础配置
    {
      path: 'baseManager',
      name: 'baseManager',
      component: parentView,
      meta: {
        title: '基础配置'
      },
      children: [
        {
          path: 'userManager',
          name: 'userManager',
          meta: {
            title: '用户管理'
          },
          component: () => import('@/view/admin/user/UserList.vue')
        },
        {
          path: 'persionalSettings',
          name: 'persionalSettings',
          meta: {
            title: '个人设置',
            notCache: true
          },
          props: true,
          component: () =>
            import('@/view/admin/user/persional-settings/PersionalSettings.vue')
        },
        {
          path: 'editPasswordForm',
          name: 'editPasswordForm',
          meta: {
            title: '修改用户密码'
          },
          props: true,
          component: () => import('@/view/admin/user/EditPasswordFormCard.vue')
        },
        {
          path: 'userManagerForm',
          name: 'userManagerForm',
          meta: {
            title: '用户表单'
          },
          props: true,
          component: () => import('@/view/admin/user/UserFormCard.vue')
        },
        {
          path: 'moduleManager',
          name: 'moduleManager',
          meta: {
            title: '模块管理'
          },
          component: () => import('@/view/admin/module/ModuleList.vue')
        },
        {
          path: 'moduleManagerForm',
          name: 'moduleManagerForm',
          meta: {
            title: '模块管理表单'
          },
          props: true,
          component: () => import('@/view/admin/module/ModuleFormCard.vue')
        },
        {
          path: 'moduleElementList',
          name: 'moduleElementList',
          meta: {
            title: '模块元素管理'
          },
          props: true,
          component: () =>
            import('@/view/admin/module-element/ModuleElementList.vue')
        },
        {
          path: 'moduleElementFormCard',
          name: 'moduleElementFormCard',
          meta: {
            title: '模块元素表单管理'
          },
          props: true,
          component: () =>
            import('@/view/admin/module-element/ModuleElementFormCard.vue')
        },
        {
          path: 'roleManager',
          name: 'roleManager',
          meta: {
            title: '角色权限管理'
          },
          component: () => import('@/view/admin/role/RoleList.vue')
        },

        {
          path: 'roleManagerForm',
          name: 'roleManagerForm',
          meta: {
            title: '角色表单'
          },
          props: true,
          component: () => import('@/view/admin/role/RoleFormCard.vue')
        },
        {
          path: 'signUserToRole',
          name: 'signUserToRole',
          meta: {
            title: '给角色分配用户'
          },
          props: true,
          component: () => import('@/view/admin/role/ReRoleUserList.vue')
        },
        {
          path: 'signResourceAuthorityToRole',
          name: 'signResourceAuthorityToRole',
          meta: {
            title: '给角色分配资源权限'
          },
          props: true,
          component: () => import('@/view/admin/role/ResourceAuthorityList.vue')
        },
        {
          path: 'dictManager',
          name: 'dictManager',
          meta: {
            title: '字典管理'
          },
          component: () => import('@/view/ehr/dict/DictGroupList.vue')
        },
        {
          path: 'dictItemList',
          name: 'dictItemList',
          meta: {
            title: '字典项数据',
            hideInMenu: true
          },
          component: () => import('@/view/ehr/dict/DictItemList.vue')
        },
        {
          path: 'dictItemForm',
          name: 'dictItemForm',
          meta: {
            title: '字典项数据表单',
            hideInMenu: true
          },
          component: () => import('@/view/ehr/dict/DictItemForm.vue')
        },
        {
          path: 'dictGroupForm',
          name: 'dictGroupForm',
          meta: {
            title: '字典类型表单',
            hideInMenu: true
          },
          component: () => import('@/view/ehr/dict/DictGroupForm.vue')
        }
      ]
    },
    // 服务权限管理
    {
      path: 'authManager',
      name: 'authManager',
      component: parentView,
      meta: {
        title: '服务权限管理'
      },
      children: [
        {
          path: 'serviceManager',
          name: 'serviceManager',
          meta: {
            title: '服务管理'
          },
          component: () => import('@/view/service/Index.vue')
        }
      ]
    },
    // 监控模块管理
    {
      path: 'monitorManager',
      name: 'monitorManager',
      component: parentView,
      meta: {
        title: '监控模块管理'
      },
      children: [
        {
          path: 'serviceEurekaManager',
          name: 'serviceEurekaManager',
          meta: {
            title: '服务注册中心'
          },
          component: () => import('@/view/monitor/Eureka.vue')
        },
        {
          path: 'serviceMonitorManager',
          name: 'serviceMonitorManager',
          meta: {
            title: '服务状态管理'
          },
          component: () => import('@/view/monitor/Service.vue')
        },
        {
          path: 'serviceZipkinManager',
          name: 'serviceZipkinManager',
          meta: {
            title: '服务链路管理'
          },
          component: () => import('@/view/monitor/ZipKin.vue')
        }
      ]
    }
  ]
}

// 档案管理
const archives = {
  path: '/archives',
  name: 'archives',
  component: Main,
  meta: {
    title: '档案管理'
  },
  children: [
    {
      path: 'residentList',
      name: 'residentList',
      meta: {
        title: '个人档案',
        notCache: false
      },
      component: () => import('@/view/ehr/resident/ResidentList.vue')
    },
    {
      path: 'residentProfileView',
      name: 'residentProfileView',
      meta: {
        title: '查看个人档案',
        notCache: true
      },
      props: true,
      component: () => import('@/view/ehr/resident/ResidentProfileView.vue')
    },
    {
      path: 'resident/import',
      name: 'residentImportPage',
      meta: {
        title: '批量导入个人档案'
      },
      component: () =>
        import('@/view/ehr/resident/import/ResidentImportPage.vue')
    },
    {
      path: 'familyList',
      name: 'familyList',
      meta: {
        title: '家庭档案管理'
      },
      component: () => import('@/view/ehr/family/FamilyList.vue')
    },
    {
      path: 'familyMembersList',
      name: 'familyMembersList',
      meta: {
        title: '家庭成员管理',
        notCache: true
      },
      props: true,
      component: () => import('@/view/ehr/family-members/List.vue')
    },
    {
      path: '/familyListForm',
      name: 'familyListForm',
      meta: {
        title: '家庭',
        notCache: true
      },
      component: () => import('@/view/ehr/family/FamilyFormCard.vue')
    },
    {
      path: '/residentListForm',
      name: 'residentListForm',
      meta: {
        title: '个人档案',
        notCache: true
      },
      props: true,
      component: () => import('@/view/ehr/resident/ResidentFormCard.vue')
    },
    {
      path: '/residentList/word/view',
      name: 'residentList_word_view',
      meta: {
        title: '个人档案预览',
        notCache: true
      },
      props: true,
      component: () => import('@/view/ehr/resident/ResidentWordView.vue')
    }
  ]
}
// 证卡管理
const healthCard = {
  path: '/healthCard',
  name: 'healthCard',
  component: Main,
  meta: {
    title: '证卡'
  },
  children: [
    {
      path: '/healthCardList',
      name: 'healthCardList',
      meta: {
        title: '证卡管理',
        notCache: true
      },
      component: () => import('@/view/ehr/card/CardList.vue')
    },
    {
      path: '/healthCardFormCard',
      name: 'healthCardFormCard',
      meta: {
        title: '证卡',
        notCache: true
      },
      component: () => import('@/view/ehr/card/CardFormCard.vue')
    }
  ]
}
// 账户管理
const accountManager = {
  path: '/accountManager',
  name: 'accountManager',
  component: Main,
  meta: {
    title: '账户管理'
  },
  children: [
    {
      path: '/familyAccountList',
      name: 'familyAccountList',
      meta: {
        title: '家庭账户',
        notCache: true
      },
      component: () => import('@/view/ehr/family-account/FamilyAccountList.vue')
    },
    {
      path: '/familyAccountDeposit',
      name: 'familyAccountDeposit',
      meta: {
        title: '家庭账户充值',
        notCache: true
      },
      props: true,
      component: () =>
        import('@/view/ehr/family-account/FamilyAccountDeposit.vue')
    },
    {
      path: '/familyAccountAsset',
      name: 'familyAccountAsset',
      meta: {
        title: '家庭账户资产',
        notCache: true
      },
      component: () =>
        import('@/view/ehr/family-account/FamilyAccountAsset.vue')
    }
  ]
}
// 清算管理
const ClearAccountManager = {
  path: '/clearAccountManager',
  name: 'clearAccountManager',
  meta: {
    title: '清算管理'
  },
  component: Main,
  children: [
    {
      path: '/clearAccount',
      name: 'clearAccount',
      meta: {
        title: '清算',
        notCache: true
      },
      component: () => import('@/view/ehr/clear-account/Index.vue')
    },
    {
      path: '/clearAccountHistory',
      name: 'clearAccountHistory',
      meta: {
        title: '清算历史',
        notCache: true
      },
      component: () => import('@/view/ehr/clear-account/History.vue')
    }
  ]
}

// 医疗机构
const medicalOrg = {
  path: '/medicalOrgManager',
  name: 'medicalOrgManager',
  component: Main,
  meta: {
    title: '医疗机构管理'
  },
  children: [
    {
      path: '/medicalOrgList',
      name: 'medicalOrgList',
      meta: {
        title: '机构',
        notCache: true
      },
      component: () => import('@/view/ehr/org/MedicalOrgList.vue')
    }
  ]
}

// 事件上报管理
const ReportManager = {
  path: '/reportManager',
  name: 'reportManager',
  component: Main,
  meta: {
    title: '事件上报'
  },
  children: [
    {
      path: '/emergencyInfo',
      name: 'emergencyInfo',
      meta: {
        title: '突发事件上报'
      },
      component: () => import('@/view/ehr/emergency/EmergencyList.vue')
    },
    {
      path: '/emergencyView',
      name: 'emergencyView',
      meta: {
        title: '突发事件详情',
        notCache: true
      },
      component: () => import('@/view/ehr/emergency/EmergencyView.vue'),
      props: true
    },
    {
      path: '/infectInfo',
      name: 'infectInfo',
      meta: {
        title: '传染病上报'
      },
      component: () => import('@/view/ehr/infectious-diseases/InfectList.vue')
    },
    {
      path: '/infectView',
      name: 'infectView',
      meta: {
        title: '传染病详情',
        notCache: true
      },
      component: () => import('@/view/ehr/infectious-diseases/InfectView.vue'),
      props: true
    }
  ]
}

// 药品管理

const DrugManager = {
  path: '/drugManager',
  name: 'drugManager',
  component: Main,
  meta: {
    title: '药品管理'
  },
  children: [
    {
      path: '/drugType',
      name: 'drugType',
      meta: {
        title: '药品类型'
      },
      component: () => import('@/view/ehr/drug/DrugTypeList.vue')
    },
    {
      path: '/drugInfo',
      name: 'drugInfo',
      meta: {
        title: '药品信息'
      },
      component: () => import('@/view/ehr/drug/DrugList.vue')
    },
    {
      path: '/addDrug',
      name: 'addDrug',
      meta: {
        title: '新增/修改药品',
        notCache: true
      },
      component: () => import('@/view/ehr/drug/AddDrug.vue'),
      props: true
    }
  ]
}

const MaterialManager = {
  path: '/materialManager',
  name: 'materialManager',
  component: Main,
  meta: {
    title: '物资管理'
  },
  children: [
    {
      path: '/materialInfo',
      name: 'materialInfo',
      meta: {
        title: '物资信息'
      },
      component: () => import('@/view/ehr/material/MaterialList.vue')
    },
    {
      path: '/addMaterial',
      name: 'addMaterial',
      meta: {
        title: '新增/修改物资',
        notCache: true
      },
      component: () => import('@/view/ehr/material/AddMaterial.vue'),
      props: true
    }
  ]
}

const StatisticsManager = {
  path: '/statistics',
  name: 'statistics',
  component: Main,
  meta: {
    title: '统计分析'
  },
  children: [
    {
      path: '/sHealthCard',
      name: 'sHealthCard',
      meta: {
        title: '健康卡发放统计',
        notCache: true
      },
      component: () => import('@/view/ehr/statistics/HealthCard.vue')
    },
    {
      path: '/sResident',
      name: 'sResident',
      meta: {
        title: '居民登记统计',
        notCache: true
      },
      component: () => import('@/view/ehr/statistics/ResidentInfo.vue')
    },
    {
      path: '/sFocusGroup',
      name: 'sFocusGroup',
      meta: {
        title: '重点人群统计',
        notCache: true
      },
      component: () => import('@/view/ehr/statistics/FocusGroup.vue')
    },
    {
      path: '/sInfect',
      name: 'sInfect',
      meta: {
        title: '传染病统计',
        notCache: true
      },
      component: () => import('@/view/ehr/statistics/InfectInfo.vue')
    },
    {
      path: '/sEmergency',
      name: 'sEmergency',
      meta: {
        title: '突发事件统计',
        notCache: true
      },
      component: () => import('@/view/ehr/statistics/EmergencyInfo.vue')
    }
  ]
}

// 错误页面
const Errors = {
  path: '/error',
  name: 'errors',
  component: Main,
  children: [
    {
      path: '/401',
      name: 'error_401',
      meta: {
        hideInMenu: true,
        inTags: false
      },
      component: () => import('@/view/error-page/401.vue')
    },
    {
      path: '/500',
      name: 'error_500',
      meta: {},
      component: () => import('@/view/error-page/500.vue')
    },
    {
      path: '/403',
      name: 'error_403',
      meta: {},
      component: () => import('@/view/error-page/403.vue')
    },
    {
      path: '/no-page',
      name: 'nopage',
      component: () => import('@/view/error-page/no-page.vue')
    }
  ]
}

const Swagger = {
  path: '/swagger',
  name: 'swaggerManager',
  component: Main,
  meta: {
    title: '数据模块'
  },
  children: [
    {
      path: '/index',
      name: 'swagger',
      meta: {
        title: '数据模块'
      },
      component: () => import('@/view/swagger/SwaggerIndex.vue')
    }
  ]
}
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      inTags: false
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  System,
  archives,
  healthCard,
  accountManager,
  medicalOrg,
  ReportManager,
  DrugManager,
  MaterialManager,
  ClearAccountManager,
  StatisticsManager,
  Swagger,
  Errors,
  {
    path: '*',
    name: 'error_404',
    component: parentView,
    meta: {
      hideInMenu: true,
      inTags: false
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
