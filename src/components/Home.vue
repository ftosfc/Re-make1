<template>
  <div style="height: 100%">
    <!--    头部区域-->
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/logo-home.jpg" style="width: 50px" alt="">
          <span>网络</span>

        </div>
        <el-button type="info" @click="logout">
          退出
        </el-button>
      </el-header>
      <!--      主体区域-->
      <el-container>
        <!--        侧栏-->

        <el-aside :width="isCollapse?'64px':'200px'">

          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
              class="el-menu-vertical-demo"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              :collapse="isCollapse"
              :collapse-transition="false"
              router

              :default-active="$route.path"
          >
            <!--            //一级菜单-- 绑定index即可更改选中色-->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!--              一级菜单的模板区域-->
              <template slot="title">
                <!--                图标-->
                <i class="el-icon-location"></i>
                <!--                文本-->
                <span>{{ item.authName }}</span>
              </template>
              <!--              二级菜单-->
              <!--              当menu开启router属性时候就可以通过点击然后跳转到他的index，这样就可以直接路由-->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>

            </el-submenu>


          </el-menu>

        </el-aside>

        <!--        主页面-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  // created() {
  //   this.getMenuList()
  // },
  name: "Home",
  data: function () {
    return {
      //左侧菜单栏
      menulist: [{
        id: 1,
        authName: '网络拓扑',
        path: '',
        children: [
          {id: 1_1, authName: '网络逻辑拓扑', path: 'netlogic',},
          {id: 1_2, authName: '网络物理拓扑', path: 'netmac',}
        ]
      },
        {
          id: 2,
          authName: '工控网络威胁检测',
          path: '',
          children: [
            {id: 2_1, authName: '流量静态特征检测', path: 'users',},
            {id: 2_2, authName: '流量时序特征检测', path: 'ipfix',},
            {id: 2_3, authName: '敏感协议分析', path: '',},
            {id: 2_4, authName: '设备管理', path: 'devicemanage',},

          ]
        },
        {
          id: 3,
          authName: '数字孪生',
          path: '',
          children: [
            {id: 3_1, authName: '安全性分析', path: 'secanalysis',},
            {id: 3_2, authName: '网络状况模拟', path: 'netstatus',},
          ]
        },
        {
          id: 5,
          authName: 'Pcap文件分析',
          path: '',
          children: [{id: 5_1, authName: 'pcap文件', path: 'pcap',},]
        },

      ],
      isCollapse: false
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },

    //获取左侧菜单数据
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #FFF;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: black;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>