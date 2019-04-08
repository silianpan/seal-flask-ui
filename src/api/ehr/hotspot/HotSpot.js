import api from '@/libs/api'
import _ from 'lodash'
class HotSpotService {
  /**
   *
   * @author hsc
   * @date 2018-12-10
   * @static
   * @returns
   * @memberof HotSpotService
   */
  static async findAreaPopuProportionInfo() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/statistics/population/family/proportion`
      )
    }
  }
  /**
   *健康卡发放统计
   *
   * @author hsc
   * @date 2018-12-10
   * @static
   * @returns
   * @memberof HotSpotService
   */
  static async queryStatisticsOfHealthCardIssuance() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/statistics/health/card/issuance`)
    }
  }

  /**
   *发卡统计
   *
   * @author hsc
   * @date 2018-12-10
   * @static
   * @param {*} params
   * @returns
   * @memberof HotSpotService
   */
  static async queryStatisticsOfCardNums(params = []) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/statistics/card/nums`, params)
    }
  }

  /**
   *
   *本月居民登记统计
   * @author hsc
   * @date 2018-12-10
   * @static
   * @param {*} params
   * @returns
   * @memberof HotSpotService
   */
  static async queryStatisticsOfResidentNums(params = []) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/statistics/resident/nums`, params)
    }
  }

  /**
   *
   *本月家庭登记统计
   * @author hsc
   * @date 2018-12-10
   * @static
   * @param {*} params
   * @returns
   * @memberof HotSpotService
   */
  static async queryStatisticsOfFamilyNums(params = []) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/statistics/family/nums`, params)
    }
  }

  /**
   *
   * 诊疗客户端连通情况
   * @author hsc
   * @date 2018-12-10
   * @static
   * @returns
   * @memberof HotSpotService
   */
  static async checkClientConnectivity() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/check/client/connectivity`)
    }
  }

  /**
   *检测某个ip 是否联通
   *
   * @author hsc
   * @date 2018-12-10
   * @static
   * @param {*} ipAddress
   * @returns
   * @memberof HotSpotService
   */
  static async checkConnectByIpAddress(ipAddress) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}//check/client/by/${ipAddress}`)
    }
  }
}

HotSpotService.baseUrlPrefix = '/api/ehr/hotspot'

export { HotSpotService }
