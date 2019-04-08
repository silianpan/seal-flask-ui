import api from '@/libs/api'
import _ from 'lodash'
import { BaseService } from '@/api/base-service'
/**
 *
 * 提供 体检记录表 接口}
 * @author hsc
 * @date 2018-11-02
 * @class PhysicalExamLogService
 * @extends {BaseService}
 */
class PhysicalExamLogService extends BaseService {
  /**
   *
   * 查找居民的体检记录
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} residentId
   * @returns
   * @memberof PhysicalExamLogService
   */
  static async findInfoByResidentId(residentId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(
        `${this.baseUrlPrefix}//find/info/by/residentId/${residentId}`
      )
    }
  }

  /**
   *
   *查找此次体检记录的详情
   * @author hsc
   * @date 2019-01-20
   * @static
   * @param {*} id
   * @returns
   * @memberof PhysicalExamLogService
   */
  static async findDetailInfoById(id) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/info/detail/${id}`)
    }
  }
}
PhysicalExamLogService.baseUrlPrefix = '/api/ehr/inspection/physicalExamLog'
export { PhysicalExamLogService }
