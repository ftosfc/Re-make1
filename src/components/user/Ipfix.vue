<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工控网络威胁检测</el-breadcrumb-item>
      <el-breadcrumb-item>流量时序特征检测</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div slot="header">
        <span>会话流分析</span>

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


        <el-table
            :data="pcaplist"
            border
            stripe
            sortable
            max-height="500"
            slot="reference"
        >
          <!--          timeStamp: String,-->
          <!--          srcIp:String,-->
          <!--          desIp:String,-->
          <!--          srcPort:String,desPort:String-->
          <!--          protocol:String-->
          <!--          Size:Int-->
          <!--          Frame:long long-->
          <el-table-column label="" type="index" align="center"></el-table-column>
          <el-table-column label="会话流ID" prop="eventid" align="center"></el-table-column>

          <el-table-column label="源IP" prop="srcip" align="center"></el-table-column>
          <el-table-column label="源端口" prop="srcport" align="center"></el-table-column>

          <el-table-column label="目的IP" prop="destip" align="center"></el-table-column>
          <el-table-column label="目的端口" prop="dstport" align="center"></el-table-column>


          <el-table-column label="协议" prop="predict_protocol" align="center"></el-table-column>

          <el-table-column label="以太网帧数" prop="ethertype" align="center">

          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-popover
                  placement="right"
                  width="1100"
                  trigger="click">
                <el-table
                    border
                    max-height="500"
                    stripe
                    :data="detailData">
                  <el-table-column label="序号" type="index" align="center"></el-table-column>

                  <el-table-column label="源IP" prop="srcip" align="center"></el-table-column>
                  <el-table-column label="源端口" prop="srcport" align="center"></el-table-column>

                  <el-table-column label="目的IP" prop="destip" align="center"></el-table-column>
                  <el-table-column label="目的端口" prop="dstport" align="center"></el-table-column>


                  <el-table-column label="协议" prop="protocol" align="center"></el-table-column>
                  <el-table-column label="帧大小" prop="size" align="center"></el-table-column>
                  <el-table-column label="Payload" prop="payload" align="center" width="400px"></el-table-column>
                </el-table>
                <el-button @click="handleClick(scope.row)" type="primary" size="small" slot="reference">查看</el-button>
              </el-popover>
            </template>
          </el-table-column>


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
      pcaplist: [],
      detailData: [],
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
          const {data: res} = await this.$http.get('/api/getEvents/ HTTP/1.1 200 2650')
          let resla = res.replace(/\n/g, "");
          // this.pcaplist = JSON.parse(resla).reverse()
          let row = resla.split(';');
          let temp = [];
          for (let rowKey of row) {
            let col = rowKey.split(',');
            if (!col[0]) continue;
            temp.unshift({
              'eventid': col[0],
              'srcip': col[1],
              'dstport': col[2],
              'destip': col[3],
              'srcport': col[4],
              'predict_protocol': col[5],
              'ethertype': col[6],
            })
          }
          // console.log(temp)
          this.pcaplist = temp;
        }, 2000)
      }

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
    },
    async handleClick(row) {
      // this.detailData.push({
      //   timestamp: 'fff',
      //   description: 'dddd',
      //   srcip_port: '100:2',
      //   dstip_port: '500:5',
      //   protocol: '6',
      //   size: 5,
      //   payload: 9
      // })
      let formData = new FormData();
      formData.append('eventid', row.eventid)
      const {data: res} = await this.$http.post('/api/getEventPackets/ HTTP/1.1 200 2547', formData)
      //let resla = res.replace(/\n/g, "");
      let resla = res
      console.log(res)
      let temp = [];
      // this.pcaplist = JSON.parse(resla).reverse()
      let resRow = resla.split('&$&$;');

      for (let rowKey of resRow) {
        rowKey=rowKey.replace(/\s+/g,"");
        let index = -1;
        let before;
        let col = [];
        for (let i = 0; i < 6; i++) {
          before = index + 1;
          index = rowKey.indexOf(',', before);

          col[i] = rowKey.substr(before, index-before);
          console.log(before + ' ' + index+" "+col[i]);
        }
        col[6] = rowKey.substr(index+1, rowKey.length);
        temp.push({
          srcip: col[0],
          srcport: col[1],
          destip: col[2],
          dstport: col[3],
          protocol: col[4],
          size: col[5],
          payload: col[6],
        })
        // let resla = res.replace(/\'/g, "\"");
      }
      this.detailData = temp;
    }
  },
}
</script>

<style lang="less" scoped>

</style>