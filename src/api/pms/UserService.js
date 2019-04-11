import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * pms用户接口
 * @author liupan
 * @date 2018-12-07
 * @class UserService
 * @extends {BaseService}
 */
class UserService extends BaseService {
  static async findUserByCon(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/by/con`, params)
    }
  }
}
UserService.baseUrlPrefix = '/api/pms/user/user'
export { UserService }
