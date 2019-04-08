import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 儿童出生登记表 接口}
 * @author hsc
 * @date 2018-11-02
 * @class BirthRegistrationService
 * @extends {BaseService}
 */
class BirthRegistrationService extends BaseService {
  /**
   *
   * 根据档案编号查找新生儿家庭访视记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} residentId
   * @returns
   * @memberof BirthRegistrationService
   */
  static async findInfosByProfileNumber(profileNumber) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/find/infos/by/profileNumber/${profileNumber}`
      )
    }
  }
}
BirthRegistrationService.baseUrlPrefix = '/api/ehr/inspection/birthRegistration'
export { BirthRegistrationService }
