<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工控网络威胁检测</el-breadcrumb-item>
      <el-breadcrumb-item>流量静态特征检测</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div slot="header">
        <span>流量静态特征检测</span>

        <el-button style="float:right;padding: 6px" type="primary" @click="clearIpfixList">清空</el-button>
        <el-button style="float:right;padding: 6px;margin-right:6px" type="primary" @click="stopIpfixList">停止
        </el-button>

        <el-button style="float:right;padding: 6px" type="primary" @click="getUserList">开始</el-button>

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
        <el-popover
            placement="right"
            width="600"
            trigger="click">
          <el-table
              border

              :data="detailData">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="TimeStamp" prop="timestamp"></el-table-column>

            <el-table-column label="源IP : 端口" prop="srcip_port"></el-table-column>

            <el-table-column label="目的IP : 端口" prop="dstip_port"></el-table-column>


            <el-table-column label="Predict Protocol" prop="protocol"></el-table-column>

            <el-table-column label="帧大小" prop="size"></el-table-column>
            <el-table-column label="Payload" prop="payload"></el-table-column>
          </el-table>

          <el-table
              :data="pcaplist"
              border
              stripe
              max-height="500"
              slot="reference"
              :sortable="true"
          >
            <!--          timeStamp: String,-->
            <!--          srcIp:String,-->
            <!--          desIp:String,-->
            <!--          srcPort:String,desPort:String-->
            <!--          protocol:String-->
            <!--          Size:Int-->
            <!--          Frame:long long-->
            <el-table-column label="" type="index"></el-table-column>
            <el-table-column label="TimeStamp" prop="timestamp"></el-table-column>

            <el-table-column label="Source IP" prop="srcip"></el-table-column>
            <el-table-column label="Destination IP" prop="destip"></el-table-column>

            <el-table-column label="Source Mac" prop="srcmac"></el-table-column>
            <el-table-column label="Destination Mac" prop="dstmac"></el-table-column>

            <el-table-column label="Source Port" prop="srcport"></el-table-column>
            <el-table-column label="Destination Port" prop="dstport"></el-table-column>


            <el-table-column label="Predict Protocol" prop="predict_protocol"></el-table-column>

            <el-table-column label="Ethertype" prop="ethertype"></el-table-column>


            <!--          <el-table-column label="Frame">-->
            <!--&lt;!&ndash;            <template slot-scope="scope">&ndash;&gt;-->
            <!--&lt;!&ndash;              &lt;!&ndash;            {{scope.row}}  上面这个可以获得当前行的所有信息&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;              <el-switch&ndash;&gt;-->
            <!--&lt;!&ndash;                  v-model="scope.row.mg_state">&ndash;&gt;-->
            <!--&lt;!&ndash;              </el-switch>&ndash;&gt;-->
            <!--&lt;!&ndash;            </template>&ndash;&gt;-->
            <!--          </el-table-column>-->
            <!--          <el-table-column label="操作">-->
            <!--            <template slot-scope="scope">-->
            <!--              <el-tooltip effect="dark" content="修改用户" placement="top" enterable>-->
            <!--              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>-->
            <!--              </el-tooltip>-->
            <!--              <el-button type="danger" icon="el-icon-delete" circle circle size="mini"></el-button>-->
            <!--              <el-button type="warning" icon="el-icon-setting" circle circle size="mini"></el-button>-->
            <!--            </template>-->
            <!--          </el-table-column>-->

          </el-table>
        </el-popover>

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
      pcaplist: [
        // {
        //   'destip': '224.0.0.22',
        //   'dstmac': '01:00:5e:00:00:16',
        //   'dstport': 0,
        //   'ethertype': 2,
        //   'predict_protocol': ['OMF'],
        //   'srcip': '192.168.1.113',
        //   'srcmac': 'e0:d5:5e:44:7d:f4',
        //   'srcport': 0,
        //   'timestamp': 1620897662493
        // }
      ],
      detailData: [
        {
          timestamp: 'fff',
          description: 'dddd'
        },
      ]
      ,
      isStart: false
    }
  },
  created() {
    // this.getUserList()
  },
  methods: {
    getUserList() {
      if (!this.isStart) {
        window.clearInterval(this.timeInterval)
        this.isStart = true
        this.$message.success('正在分析')
        this.timeInterval = setInterval(async () => {
          console.log('a')
          const {data: res} = await this.$http.get('/api/getipfix/')
          console.log('b')
          let resla = res.replace(/\'/g, "\"");
          this.pcaplist = JSON.parse(resla).reverse()
        }, 1000)
      }
      // if (res.meta.status !== 200) return this.$message.error('获取用户失败');
    },
    clearIpfixList() {
      window.clearInterval(this.timeInterval)
      this.pcaplist = []
      this.$message.success('已清空')
      this.isStart = false
    },
    stopIpfixList() {
      if (this.isStart) {
        window.clearInterval(this.timeInterval)
        this.$message.success('已停止')
        this.isStart = false
      } else this.$message.error('请先开始')
    }
  },
}
</script>

<style lang="less" scoped>

</style>