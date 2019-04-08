import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 家庭信息表 接口}
 * @author hsc
 * @date 2018-09-18
 * @class FamilyService
 * @extends {BaseService}
 */
class FamilyService extends BaseService {
  /**
   * 保存家庭信息结构
   * @author hsc
   * @date 2018-10-09
   * @static
   * @returns
   * @memberof FamilyService
   */
  static async saveFamilyInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/save/familyInfo`, params)
    }
  }

  /**
   *
   *
   * @author hsc
   * @date 2019-01-14
   * @static
   * @param {*} params
   * @returns
   * @memberof FamilyService
   */
  static async countHouseholdProp() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/count/household/prop`)
    }
  }
}

FamilyService.baseUrlPrefix = '/api/ehr/family/family'
FamilyService.permissionPerfix = 'familyList'

export { FamilyService }
