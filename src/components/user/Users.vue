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
        <span>时序流量特征检测</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <body>
      <div>
        <!--        搜索与添加区域-->


        <el-row :gutter="20">
          <el-col :span="12">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>

        </el-row>
        <el-popover
            placement="right"
            width="600"
            trigger="click">
          <el-table :data="gridData">
              <el-table-column width="300" property="featureName" label="Feature Name"></el-table-column>
            <el-table-column width="300" property="description" label="Description"></el-table-column>
          </el-table>

          <el-table
              :data="pcaplist"
              border
              stripe
              slot="reference"
          >
            <!--          timeStamp: String,-->
            <!--          srcIp:String,-->
            <!--          desIp:String,-->
            <!--          srcPort:String,desPort:String-->
            <!--          protocol:String-->
            <!--          Size:Int-->
            <!--          Frame:long long-->
            <el-table-column label="" type="index"></el-table-column>
            <el-table-column label="Timestamp" prop="timeStamp"></el-table-column>
            <el-table-column label="Source IP" prop="srcIp"></el-table-column>
            <el-table-column label="Source Port" prop="srcPort"></el-table-column>
            <el-table-column label="Destination IP" prop="desIp"></el-table-column>
            <el-table-column label="Protocol" prop="protocol"></el-table-column>

            <el-table-column label="Frame" prop="Frame"></el-table-column>
            <el-table-column label="Size" prop="Size"></el-table-column>


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
      pcaplist: [{
        timeStamp: 'TString',
        srcIp: 'SString',
        desIp: 'DString',
        srcPort: 'SString',
        desPort: 'DString',
        protocol: 'PString',
        Size: 8,
        Frame: 'F'


      }],
      gridData: [{featureName: 'fff', description: 'dddd'},]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
     getUserList() {
      // const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      // console.log(res);
      // if (res.meta.status !== 200) return this.$message.error('获取用户失败');
      // this.userlist = res.data.users;
      // this.total = res.data.total;
    }

  },

}
</script>

<style lang="less" scoped>

</style>