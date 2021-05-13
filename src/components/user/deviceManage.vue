<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工控网络威胁检测</el-breadcrumb-item>
      <el-breadcrumb-item>设备管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div slot="header">
        <span>设备管理</span>

        <el-button style="float:right;padding: 6px" type="primary" @click="clearIpfixList">清空</el-button>
        <el-button style="float:right;padding: 6px;margin-right:6px" type="primary" @click="stopIpfixList">停止
        </el-button>

        <el-button style="float:right;padding: 6px" type="primary" @click="getDeviceList">开始</el-button>

      </div>
      <body>
      <div>
        <!--        搜索与添加区域-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="searchInfo" clearable>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <!--            <el-button type="primary">添加用户</el-button>-->
          </el-col>

        </el-row>

        <el-table
            :data="devicelist"
            border
            stripe
            sortable
            max-height="500"
            slot="reference"
        >
          <el-table-column label="" type="index" align="center"></el-table-column>
          <el-table-column label="设备id" prop="deviceid" align="center"></el-table-column>

          <el-table-column label="ip地址" prop="deviceip" align="center"></el-table-column>
          <el-table-column label="白名单状态" align="center">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.whiteSwitch"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value='1'
                  inactive-value='0'
                  @change="switchHandle(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <!--          <el-table-column label="白名单操作"align="center">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button-->
          <!--                  size="mini"-->
          <!--                  type="primary"-->
          <!--                  @click="addWhite(scope.$index, scope.row)">添加</el-button>-->
          <!--              <el-button-->
          <!--                  size="mini"-->
          <!--                  type="danger"-->
          <!--                  @click="deleteWhite(scope.$index, scope.row)">移除</el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->


        </el-table>
      </div>
      </body>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      searchInfo: '',
      timeInterval: null,
      devicelist: [],
      isStart: false,

    }
  },
  created() {
    // this.getUserList()
  },
  methods: {
    getDeviceList() {
      if (!this.isStart) {
        window.clearInterval(this.timeInterval)
        this.isStart = true
        this.$message.success('正在分析')
        this.timeInterval = setInterval(async () => {
          console.log('a')
          const {data: res} = await this.$http.get('/api/getMacLists/')
          console.log(res)
          let resla = res.replace(/\n/g, "");
         resla = res.replace(/\s+/g, "");
          // this.pcaplist = JSON.parse(resla).reverse()
          let row = resla.split(';');
          let temp = [];
          for (let rowKey of row) {
            let col = rowKey.split(',');
            if (!col[0]) continue;
            temp.push({
              deviceid: col[0],
              deviceip: col[1],
              whiteSwitch: col[2]+'',
            })
          }
          // console.log(temp)
          this.devicelist = temp;
        }, 2000)
      }

    },
    clearIpfixList() {
      window.clearInterval(this.timeInterval)
      this.devicelist = []
      this.$message.success('已清空')
      this.isStart = false
    },
    stopIpfixList() {
      if (this.isStart) {
        window.clearInterval(this.timeInterval)
        this.$message.success('已停止')
        this.isStart = false
      } else this.$message.error('请先开始')
    },
    addWhite(index, row) {

    },
    deleteWhite(index, row) {

    },
    async switchHandle(row) {
      if (row.whiteSwitch === '1') {
        let formData = new FormData();
        formData.append('deviceid', row.deviceid);
        formData.append('deviceip', row.deviceip);
        console.log(formData.get('deviceip'))
        const res = await this.$http.post('/api/addWhiteLists/', formData);
        if (res.status === 200) this.$message.success('已加入白名单');

      } else {
        let formData = new FormData();
        formData.append('deviceid', row.deviceid);
        formData.append('deviceip', row.deviceip);
        const res = await this.$http.post('/api/deleteWhiteLists/', formData);
        if (res.status === 200) this.$message.success('已移出白名单');
      }
    }
  },
}
</script>

<style lang="less" scoped>

</style>