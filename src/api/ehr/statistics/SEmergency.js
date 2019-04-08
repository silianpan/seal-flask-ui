import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供突发事件统计分析接口
 * @author 49773
 * @date 2019-01-21
 * @class SEmergencyService
 * @extends {BaseService}
 */
class SEmergencyService extends BaseService {
  /**
   * 获取传染病情况
   * @param {条件} params
   */
  static async getEmergencyInfo(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/emergency/info`, params)
    }
  }

  /**
   * 获取突发事件类型情况
   * @param {条件} params
   */
  static async getEmergencyType(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      console.log(params)
      return api.post(`${this.baseUrlPrefix}/get/emergency/type`, params)
    }
  }
}
SEmergencyService.baseUrlPrefix = '/api/ehr/statistics/emergency'
export { SEmergencyService }
