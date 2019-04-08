import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 老年人自理能力评估表操作接口
 * @author hsc
 * @date 2018-09-27
 * @class AccessoryExamService
 * @extends {BaseService}
 */
class AgedSelfCareAbilityService extends BaseService {
  /**
   *
   * 根据档案编号查找老年人自理能力评估记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} profileNumber
   * @returns
   * @memberof AgedSelfCareAbilityService
   */
  static async findInfoByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/find/info/by/profileNumber/${profileNumber}`
      )
    }
  }
}
AgedSelfCareAbilityService.baseUrlPrefix = '/api/ehr/aged/agedSelfCareAbility'
export { AgedSelfCareAbilityService }
