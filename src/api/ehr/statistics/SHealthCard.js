import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供健康证统计分析接口
 * @author 49773
 * @date 2019-01-10
 * @class HealthCardService
 * @extends {BaseService}
 */
class HealthCardService extends BaseService {
  /**
   * 获取健康证开卡情况
   * @param {条件} params
   */
  static async getHealthCardInfo(params = {}) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请传入条件')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/health/card/info`, params)
    }
  }
}
HealthCardService.baseUrlPrefix = '/api/ehr/statistics/healthcard'
export { HealthCardService }
