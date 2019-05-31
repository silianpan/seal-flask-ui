export default {
  /**
   * 数据源dsNo
   */
  dsNo: 'ehr',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * ueditor后台上传文件api服务
   */
  ueditorServer: '/api/ueditor/ueditorUpload.do',

  /**
   * 生产环境
   * 调用ic卡接口地址
   */
  hfridBaseURL: 'http://127.0.0.1:13141',

  /**
   * 文件系统地址
   */
  fileSystemServer: 'http://127.0.0.1:9090'
}
