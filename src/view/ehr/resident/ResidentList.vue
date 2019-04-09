<template>
  <LegaUpload @uploadSuccessHandle="uploadSuccessHandle" :item="item"></LegaUpload>
</template>

<script>
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
    }
  }
}
</script>
