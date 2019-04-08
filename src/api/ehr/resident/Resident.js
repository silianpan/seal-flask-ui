import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 居民基本信息表（依据《国家基本公卫规范》 附件3：个人基本信息表） 接口}
 * @author hsc
 * @date 2018-09-20
 * @class ResidentService
 * @extends {BaseService}
 */
class ResidentService extends BaseService {
  /**
   * 分页查询不是户主的居民
   * @author hsc
   * @date 2018-10-12
   * @static
   * @param {*} query
   * @returns
   * @memberof ResidentService
   */
  static async pageResidentHasNotHouse(query) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/not/house/owner`, query)
    }
  }
  /**
   *
   * 根据家庭户号查询家庭成员详细信息
   * @author hsc
   * @date 2018-10-12
   * @static
   * @param {*} familyAccount
   * @returns
   * @memberof ResidentService
   */
  static async listFamilyMembers(familyAccount) {
    if (_.isNil(familyAccount) || _.isEmpty(familyAccount)) {
      console.log('请传入家庭户号')
    } else {
      return api.get(
        `${this.baseUrlPrefix}/list/family/${familyAccount}/members`
      )
    }
  }

  /**
   *
   * 建立非户主家庭成员关系
   * @author hsc
   * @date 2018-10-12
   * @static
   * @param {*} params
   * @returns
   * @memberof FamilymembersService
   */
  static async establishFamilyRelationships(params) {
    if (_.isNil(this.baseUrlPrefix) || _.isEmpty(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/establish/relationships`, params)
    }
  }

  /**
   * 解除非户主家庭关系
   * @author hsc
   * @date 2018-12-25
   * @static
   * @param {*} params
   * @returns
   * @memberof ResidentService
   */
  static async removeFamilyRelationships(params) {
    if (_.isNil(this.baseUrlPrefix) || _.isEmpty(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/remove/relationships`, params)
    }
  }

  /**
   *
   *验证身份证号
   * @author hsc
   * @date 2018-10-22
   * @static
   * @param {*} params
   * @returns
   * @memberof ResidentService
   */
  static async validIdNumber(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/valid/id/number`, params)
    }
  }

  /**
   *
   *导入居民档案信息
   * @author hsc
   * @date 2018-12-26
   * @static
   * @param {*} params
   * @returns
   * @memberof ResidentService
   */
  static async importResidentInfo(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/import/data`, params)
    }
  }
}
ResidentService.baseUrlPrefix = '/api/ehr/resident/resident'
export { ResidentService }
