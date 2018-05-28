<template>
  <div>
    <div class="avatar-uploader">
      <div v-if="imageUrl" class="el-upload" @click="toggleShow">
        <img :src="imageUrl" class="avatar">
      </div>
      <div v-if="!imageUrl" class="el-upload" @click="toggleShow">
        <i class="el-icon-plus "></i>
      </div>
    </div>
    <my-upload v-model="show"
               field="uploadfile"
               :url="uploadImageUrl"
               :width="width"
               :height="height"
               img-format="png"
               @crop-success="handleCropSuccess"
               @crop-upload-success="handleCropUploadSuccess"
               @crop-upload-fail="handleCropUploadFail">

    </my-upload>
  </div>
</template>

<script>
import axios from 'axios'
/*  axios.defaults.withCredentials = true; */
import MyUpload from 'vue-image-crop-upload/upload-2.vue'
import config from '../../api/config'
export default {
  components: {
    'my-upload': MyUpload
  },
  props: {
    value: {
      type: String
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      show: false,
      imageUrl: '',
      uploadImageUrl: config.uploadImage
    }
  },
  created () {
    if (this.value) {
      this.imageUrl = this.value
    }
  },
  methods: {
    toggleShow () {
      this.show = true
    },
    handleCropSuccess (imageDataUrl, field) {
      this.imageUrl = imageDataUrl
    },
    handleCropUploadSuccess (jsonData, field) {
      console.log('success')
      /*
                if(jsonData){
                  this.$emit('input',jsonData.url)
                } */
    },
    handleCropUploadFail (status, field) {
      console.log('fail')
    }
  },
  watch: {
    value (n, o) {
      this.imageUrl = n
    }
  }
}
</script>

<style>
  /*上传图片样式*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .el-icon-plus {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
