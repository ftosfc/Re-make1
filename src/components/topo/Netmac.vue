<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>网络拓扑</el-breadcrumb-item>
      <el-breadcrumb-item>网络物理拓扑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <span>网络物理拓扑</span>
        <el-button style="float:right;padding: 6px" type="primary" @click="clearMacTopo">清空</el-button>
        <el-button style="float:right;padding: 6px;margin-right:6px" type="primary" @click="stopMacTopo">停止</el-button>

        <el-button style="float:right;padding: 6px" type="primary" @click="startMacTopo">生成拓扑</el-button>


      </div>

      <div id="macGraph" class="macGraph" ref="macGraph" style="width: 100%;height: 600px">
        <el-alert
            title="点击“生成拓扑”开始"
            type="success">
        </el-alert>
      </div>


    </el-card>
  </div>

</template>

<script>
import {sendWebsocket, closeWebsocket} from '@/plugins/websocket.js'

export default {
  name: "Netmac",
  data() {
    return {
      jsonData: [],
      option: {
        tooltip: {//鼠标放到节点或边上显示的东西
          show: true,   //默认显示
          showContent: true, //是否显示提示框浮层
          trigger: 'item',//触发类型，默认数据项触发
          triggerOn: 'mousemove|click',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
          alwaysShowContent: false, //默认离开提示框区域隐藏，true为一直显示
          displayMode: 'single',
          renderMode: 'auto',
          showDelay: 0,//浮层显示的延迟，单位为 ms，默认没有延迟，也不建议设置。在 triggerOn 为 'mousemove' 时有效。
          hideDelay: 200,//浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
          enterable: false,//鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
          position: 'right',//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。只在 trigger 为'item'的时候有效。
          confine: false,//是否将 tooltip 框限制在图表的区域内。外层的 dom 被设置为 'overflow: hidden'，或者移动端窄屏，导致 tooltip 超出外界被截断时，此配置比较有用。
          transitionDuration: 0.4,//提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。
          borderRadius: 4,
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, .2)",
          shadowOffsetX: 1,
          shadowOffsetY: 2,
          backgroundColor: '#fff',
          textStyle: {
            color: '#666',
            fontSize: 14
          }
        },

        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        color: ['#5470c6', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        // legend: { //=========圖表控件
        //   show: true,
        //   textStyle: { //标签的字体样式
        //     //color: '#cde6c7', //字体颜色
        //     fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
        //     //fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
        //     fontFamily: 'sans-serif',//文字的字体系列
        //     fontWeight: 'normal'
        //   },
        //   data: [
        //     {
        //       name: '负载',
        //       icon: 'circle',//'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        //     },
        //     {
        //       name: '中间件',
        //       icon: 'circle'
        //     }, {
        //       name: '端口号',
        //       icon: 'circle'
        //     }, {
        //       name: '数据库',
        //       icon: 'circle'
        //     }, {
        //       name: '用户名',
        //       icon: 'circle'
        //     }]
        // },
        series: [{
          type: 'graph', //关系图
          name: "Mac", //系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
          layout: 'force', // 图的布局。[ default: 'none' ]
          // 'none' 不采用任何布局，使用节点中提供的 x， y 作为节点的位置。
          // 'circular' 采用环形布局;'force' 采用力引导布局.

          legendHoverLink: true,//是否启用图例 hover(悬停) 时的联动高亮。
          hoverAnimation: true,//是否开启鼠标悬停节点的显示动画
          coordinateSystem: null,//坐标系可选
          xAxisIndex: 0, //x轴坐标 有多种坐标系轴坐标选项
          yAxisIndex: 0, //y轴坐标

          force: { //力引导图基本配置
            //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
            repulsion: [0, 50],//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
            gravity: 0.02,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
            edgeLength: 150,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
            friction: 0.6,
            layoutAnimation: true
            //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
          },
          align: 'auto',
          roam: true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          nodeScaleRatio: 0.6,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
          draggable: true,//节点是否可拖拽，只在使用力引导布局(layout: 'force',)的时候有用。
          focusNodeAdjacency: true,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
          symbol: 'circle',//关系图节点标记的图形。ECharts 提供的标记类型包括 'circle'(圆形), 'rect'（矩形）, 'roundRect'（圆角矩形）, 'triangle'（三角形）, 'diamond'（菱形）, 'pin'（大头针）, 'arrow'（箭头）  也可以通过 'image://url' 设置为图片，其中 url 为图片的链接。'path:// 这种方式可以任意改变颜色并且抗锯齿
          symbolSize: 10,//也可以用数组分开表示宽和高，例如 [20, 10] 如果需要每个数据的图形大小不一样，可以设置为如下格式的回调函数：(value: Array|number, params: Object) => number|Array
          //symbolRotate:,//关系图节点标记的旋转角度。注意在 markLine 中当 symbol 为 'arrow' 时会忽略 symbolRotate 强制设置为切线的角度。
          //symbolOffset:[0,0],//关系图节点标记相对于原本位置的偏移。[0, '50%']
          edgeSymbol: ['none', 'none'],//边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头，如下：edgeSymbol: ['circle', 'arrow']
          edgeSymbolSize: 10,//边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。

          itemStyle: {//===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
            normal: { //默认样式
              label: {
                show: true
              },
              borderType: 'solid', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
              borderColor: 'rgba(255,255,255,0.4)', //设置图形边框为淡金色,透明度为0.4
              borderWidth: 0, //图形的描边线宽。为 0 时无描边。
              opacity: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
              // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
            },
            emphasis: {//高亮状态
              borderType: 'solid', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
              borderColor: 'rgba(255,255,255,0.4)', //设置图形边框为淡金色,透明度为0.4
              borderWidth: 2 //图形的描边线宽。为 0 时无描边。
            }
          },
          lineStyle: { //==========关系边的公用线条样式。
            normal: {
              color: 'source',
              width: '1',
              type: 'solid', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
              curveness: 0, //线条的曲线程度，从0到1
              opacity: 0.5
              // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
            },
            emphasis: {//高亮状态
              width: 10
            }
          },
          label: { //=============图形上的文本标签
            normal: {
              show: true,//是否显示标签。
              position: 'right',//标签的位置。['50%', '50%'] [x,y]
              textStyle: { //标签的字体样式
                color: '', //字体颜色
                fontStyle: 'normal',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                fontWeight: 'bolder',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                fontFamily: 'sans-serif', //文字的字体系列
                fontSize: 12, //字体大小
              }
            },
            emphasis: {//高亮状态

            }
          },
          edgeLabel: {//==============线条的边缘标签
            normal: {
              show: false
            },
            position: 'middle',
            distance: 5,
            emphasis: {//高亮状态
            }
          },
          //别名为nodes   name:影响图形标签显示,value:影响选中后值得显示,category:所在类目的index,symbol:类目节点标记图形,symbolSize:10图形大小
          //label:标签样式。
          data: [
            // {
            //   id: 0,
            //   category: 0,
            //   name: '101.133.8.88',
            //   value: 20,
            //
            // }, {
            //   id: 1,
            //   category: 1,
            //   name: '192.168.8.88',
            //   value: 20,
            //
            // }, {
            //   id: 2,
            //   category: 2,
            //   name: '7001',
            //   value: 20,
            //   yId: "jvm",
            //   host: "192.168.6.37",
            //   port: "7001",
            //   username: "weblogic",
            //   pwd: "weblogic1"
            // }, {
            //   id: 3,
            //   category: 2,
            //   name: '7100',
            //   value: 20,
            //
            // }, {
            //   id: 4,
            //   category: 1,
            //   name: '102.12.33.23',
            //   value: 20,
            //
            // }, {
            //   id: 5,
            //   category: 2,
            //   name: '7001',
            //   value: 20,
            //
            // }, {
            //   id: 6,
            //   category: 2,
            //   name: '7100',
            //   value: 20,
            //
            // }, {
            //   id: 7,
            //   category: 2,
            //   name: '7001',
            //   value: 20,
            //
            // }, {
            //   id: 8,
            //   category: 1,
            //   name: '101.11.66.6',
            //   value: 20,
            //
            // }, {
            //   id: 9,
            //   category: 2,
            //   name: '7101',
            //   value: 20,
            //
            // }, {
            //   id: 10,
            //   category: 2,
            //   name: '7101',
            //   value: 20,
            //
            // }, {
            //   id: 11,
            //   category: 2,
            //   name: '7001',
            //   value: 20,
            //
            // }, {
            //   id: 12,
            //   category: 2,
            //   name: '7100',
            //   value: 20,
            //
            // }, {
            //   id: 13,
            //   category: 3,
            //   name: '192.168.44.44',
            //   value: 20,
            //
            // }, {
            //   id: 14,
            //   category: 3,
            //   name: '192.168.33.33',
            //   value: 20,
            //
            // }, {
            //   id: 15,
            //   category: 3,
            //   name: '192.168.22.22',
            //   value: 20,
            //
            // }, {
            //   id: 16,
            //   category: 4,
            //   name: '55555555555',
            //   value: 20,
            //
            // }
          ],
          categories: [ //symbol name：用于和 legend 对应以及格式化 tooltip 的内容。 label有效
            {
              name: '负载',
              symbol: 'circle',
              label: { //标签样式
                show: true,
                color: '#050303'
              }
            }, {
              name: '中间件',
              symbol: 'circle',
              label: { //标签样式
                show: true,
                color: '#050303'
              }
            }, {
              name: '端口号',
              symbol: 'circle',
              label: { //标签样式
                show: true,
                color: '#050303'
              }
            }, {
              name: '数据库',
              symbol: 'circle',
              label: { //标签样式
                show: true,
                color: '#050303'
              }
            }, {
              name: '用户名',
              symbol: 'circle',
              label: { //标签样式
                show: true,
                color: '#050303'
              }
            }],
          links: [ //edges是其别名代表节点间的关系数据。
            // {
            //   source: 1,
            //   target: 0
            // }, {
            //   source: 4,
            //   target: 0
            // }, {
            //   source: 8,
            //   target: 0
            // }, {
            //   source: 2,
            //   target: 1
            // }, {
            //   source: 3,
            //   target: 1
            // }, {
            //   source: 5,
            //   target: 4
            // }, {
            //   source: 6,
            //   target: 4
            // }, {
            //   source: 7,
            //   target: 4
            // }, {
            //   source: 9,
            //   target: 8
            // }, {
            //   source: 10,
            //   target: 8
            // }, {
            //   source: 11,
            //   target: 8
            // }, {
            //   source: 12,
            //   target: 8
            // }, {
            //   source: 13,
            //   target: 6
            // }, {
            //   source: 14,
            //   target: 6
            // }, {
            //   source: 15,
            //   target: 2
            // }, {
            //   source: 16,
            //   target: 15
            // }
          ]
        }]
      },

      i: 30,
      isStart: false,
      myChart: '',
      timeInterval: ''
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.isStart)
    //   this.drawGraph();
    // });
  },
  beforeDestroy() {
    // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
    // 在需要主动关闭ws的地方都可以调用该方法
    closeWebsocket()
  },
  methods: {
    //画mac拓扑图
    drawGraph() {
      let myChart = this.$echarts.init(this.$refs.macGraph);
      this.myChart = myChart;
      myChart.showLoading();

      myChart.setOption(this.option);
      let res = []
      // this.i=30
      // this.timeInterval = setInterval(() => {
      //   // this.option.series[0].data.push({
      //   //   id: this.i,
      //   //   category: 4,
      //   //   name: this.i + 'k',
      //   //   value: 20,
      //   // });
      //   this.option.series[0].data.push({
      //     id: this.i,
      //     category: 4,
      //     name: this.i + 'k',
      //     value: 20,
      //   })
      //   // console.log(this.i++)
      //   res = this.option.series[0].data
      //
      //   myChart.setOption({
      //     series: [{
      //       data: res
      //     }]
      //   })
      //   this.i++
      // }, 500)//此处要理解为什么是1000*i

      myChart.hideLoading();
      window.onresize = myChart.resize;
    },

    wsMessage(data) {
      const dataJson = data
      console.log(dataJson)

      // 这里写拿到数据后的业务代码


    },
    // ws连接失败，组件要执行的代码
    wsError() {
      // 比如取消页面的loading
    },
    requstWs() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebsocket()
      // 跟后端协商，需要什么参数数据给后台
      const obj = {}
      // 发起ws请求
      sendWebsocket('ws://test.ws.com/' + 'getNetTopo', obj, this.wsMessage, this.wsError)
    },

    //   id: 14,
    //   category: 3,
    //   name: '192.168.33.33',
    //   value: 20,


    stopMacTopo() {
      if (this.isStart) {
        window.clearInterval(this.timeInterval)
        this.isStart = false;
        this.$message.success('已停止')
      } else this.$message.error('请先开始')
    },
    clearMacTopo() {

        window.clearInterval(this.timeInterval)
        this.myChart.clear()
        this.option.series[0].data = []
        this.option.series[0].links = []
        // closeWebsocket()
        this.isStart = false;
        this.$message.success('已清空')
    },

    startMacTopo() {
      //转格式到图的data和links数组.后面放到wsMessage里
      if (!this.isStart) {
        this.isStart = true
        this.$message.success('正在分析')
        //this.requstWs()
        this.getMacList()
        // console.log(this.option.series[0].data)
        // console.log(this.option.series[0].links)

      }
      // console.log(this.isStart);
    },
    getMacList() {
      this.drawGraph()
      this.timeInterval = setInterval(async () => {
        this.option.series[0].data = []
        this.option.series[0].links = []
        const {data: res} = await this.$http.get('/api/getNetTopo/')
        let resla = res.replace(/\'/g, "\"");
        this.jsonData = await JSON.parse(resla)
        console.log(this.jsonData)
        let i = 0;
        let hashMac = []
        let hashMacJson = {}
        for (let item in this.jsonData) {
          const ex = {
            id: i + '',
            category: i % 4,
            name: item,
            value: i
          }
          let j = 0;
          // console.log(item)
          // console.log(this.jsonData[item])
          let temp = this.jsonData[item].split(',');
          if (!hashMac.includes(item)) {
            hashMac.push(item)
            hashMacJson[item] = i + ''
            this.option.series[0].data.push(ex)
            i++
          }
          for (let tempKey of temp) {
            const exc = {
              id: i + '',
              category: i % 4,
              name: tempKey + '',
              value: j
            }
            // console.log(tempKey)
            if (!hashMac.includes(tempKey)) {
              hashMac.push(tempKey)
              this.option.series[0].data.push(exc)
              hashMacJson[tempKey] = i + ''
              // console.log('进来啦')
              i++
            }
            // console.log(tempKey)
            // console.log(hashMacJson[tempKey])
            this.option.series[0].links.push({
              source: hashMacJson[item],
              target: hashMacJson[tempKey],
            })
            j++
          }


          // console.log(i + '--->' + item)
          // console.log(i + '--->' + this.jsonData[item])


          // for (let exKey in this.jsonData[item]) {
          //   const exc = {
          //     id: i + '-' + j,
          //     category: i % 4,
          //     name: this.jsonData[item][exKey],
          //     value: j
          //   }
          //   console.log(i+'--->'+item)
          //   console.log(i+'--->'+this.jsonData[item])
          //   console.log(i+'--->'+this.jsonData[item][exKey])
          //   this.option.series[0].data.push(exc)
          //   this.option.series[0].links.push({
          //     source: i + '',
          //     target: i + '-' + j,
          //   })
          //   j++;
          //   //console.log(exc)
          // }
          i++
        }

        this.myChart.setOption(this.option)
      }, 2000)

      // return true;


      // this.userlist = res.data.users;
      // this.total = res.data.total;
      // this.$http.get('json').done(data => {
      //   myChart.setOption()
      // })
      // this.myChart.setOption({
      //   series: [{
      //     data: [{
      //       id: 0,
      //       category: 0,
      //       name: 110,
      //       value: 119,
      //     }]
      //   }]
      // }, true)
    },
    windowFull() {
      //此处使用let是关键，也可以使用闭包。原理不再赘述
      let total = document.documentElement.clientHeight;
      let colHeight = total - 100 - this.$refs.macGraph.offsetTop;
      this.$refs.macGraph.style.height = colHeight + "px";
    },
    created() {
      this.option.series[0].data = []

    }
  }
}
</script>

<style less="lang" scoped>
/*.el-card {*/
/*  margin: 0;*/
/*  height: 100%;*/
/*}*/
/*.el-card__body{*/
/*  margin: 0;*/
/*  height: 100%;*/
/*}*/
/*.macGraph {*/
/*  width: 100%;*/
/*  height: 100%;*/
/*}*/
</style>