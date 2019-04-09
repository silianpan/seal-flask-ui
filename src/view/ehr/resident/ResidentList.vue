<template>
  <div>
    <LegaUpload @uploadSuccessHandle="uploadSuccessHandle" :item="item"></LegaUpload>
    <Button @click="clickHandle">测试分库分表&多租户存储</Button>
  </div>
</template>

<script>
import { UserService } from '@/api/pms/UserService'
import LegaUpload from '@/components/LegaUpload'
import { TOKEN_KEY } from '@/libs/util'
export default {
  components: {
    LegaUpload
  },
  data() {
    return {
      item: {
        actionUrl: '/filesystem/upload',
        uploadText: '上传附件',
        headers: {
          dsNo: this.$config.dsNo,
          Authorization: sessionStorage.getItem(TOKEN_KEY)
        }
      }
    }
  },
  methods: {
    uploadSuccessHandle(response, file, fileList) {
      console.log(response, file, fileList)
    },
    clickHandle() {
      // UserService.findAll().then(res => {
      //   console.log('pms', res)
      // })
      UserService.save({
        name: 'admin'
      }).then(res => {
        console.log('pms', res)
      })
    }
  }
}
</script>
