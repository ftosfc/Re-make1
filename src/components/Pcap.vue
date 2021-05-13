<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Pcap文件分析</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div slot="header">
        <span>Pcap文件上传</span>
      </div>
      <body>
      <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="fileList"
          ref="upload"
          multiple
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :auto-upload="false"
      >

        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">
          <el-alert title="只能上传pcap文件"
                    type="error">
          </el-alert>
        </div>


        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      </body>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Pcap",
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
      console.log(this.fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitUpload() {
      this.$refs.upload.submit();
      this.$message.success("上传成功")
    },
  }
}
</script>

<style scoped>

</style>