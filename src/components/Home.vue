<template>
  <div style="height: 100%">
    <!--    头部区域-->
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/logo-home.jpg" style="width: 50px" alt="">
          <span>电商管理</span>
        </div>
        <el-button type="info" @click="logout">
          退出
        </el-button>
      </el-header>
      <!--      主体区域-->
      <el-container>
        <!--        侧栏-->
        <el-aside width="200px">
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>

              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
<!--            <el-menu-item index="3" disabled>-->
<!--              <i class="el-icon-document"></i>-->
<!--              <span slot="title">导航三</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="4">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">导航四</span>-->
<!--            </el-menu-item>-->
          </el-menu>
        </el-aside>

        <!--        主页面-->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #FFFFCC;
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

.el-main {
  background-color: #EAEDF1;
}

.home-container {
  height: 100%;
}

</style>