import api from '@/libs/api'
import _ from 'lodash'
import Qs from 'qs'

/**
 * 提供ic卡接口
 * @author hsc
 * @date 2018-10-24
 * @class HfirdService
 */
class HfirdService {
  /**
   * 连接设备
   * @author hsc
   * @date 2018-10-24
   * @static
   * @param {*} params
   * @returns
   * @memberof HfirdService
   */
  static async connect() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/connect`)
    }
  }

  /**
   * 获取ic 卡序列号
   *
   * @author hsc
   * @date 2018-10-24
   * @static
   * @param {*} params
   * @returns
   * @memberof HfirdService
   */
  static async getCardSerialNumber() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/get/serial/number`)
    }
  }

  /**
   *读取ic 卡绝对块号 (0～63)
   *
   * @author hsc
   * @date 2018-10-24
   * @static
   * @param {*} params
   * @returns
   * @memberof HfirdService
   */
  static async readBlockData(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/read/block/data`, params)
    }
  }

  /**
   *
   *写入ic卡某块
   * @author hsc
   * @date 2018-10-24
   * @static
   * @param {*} params
   * @returns
   * @memberof HfirdService
   */
  static async writeBlockData(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(
        `${this.baseUrlPrefix}/write/block/data`,
        Qs.stringify(params)
      )
    }
  }

  /**
   *直接读取ic 卡内的数据
   *
   * @author hsc
   * @date 2018-10-25
   * @static
   * @returns
   * @memberof HfirdService
   */
  static async checkCardData() {
    let res = await this.getCardSerialNumber()
    if (res.status === 0) {
      res = await this.readBlockData()
    } else {
      return {
        status: -1,
        msg: '请检查读卡器连接状态，并请将卡片放在读卡器上'
      }
    }
    return res
  }

  /**
   *重置ic card 数据
   *
   * @author hsc
   * @date 2018-10-25
   * @static
   * @returns
   * @memberof HfirdService
   */
  static async resetCardData() {
    let res = await this.writeBlockData({
      data: ''
    })
    return res
  }
}

HfirdService.baseUrlPrefix = '/hfrid'

export { HfirdService }
