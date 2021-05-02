<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div slot="header">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <body>
      <div>

        <!--        搜索与添加区域-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
          </el-col>

        </el-row>

        <!--        用户列表区域-->
        <el-table
            :data="userlist"
            border
            stripe
        >
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!--            {{scope.row}}  上面这个可以获得当前行的所有信息-->
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                <!--                swich监听change事件可以改变-->
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改用户" placement="top" enterable>
                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                           @click="showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除用户" placement="top" enterable>
                <el-button type="danger" icon="el-icon-delete" circle size="mini"
                           @click="removeUserById(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="设置" placement="top" enterable>
                <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

        </el-table>

        <!--        分页区域-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!--添加用户的对话框-->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
          <el-form status-icon :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <!--修改用户的对话框-->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            close="editDialogClosed"
        >
          <el-form status-icon :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>

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
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRef: '',
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 15, message: '用户名长度在3到15之间', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        mobile: [
          {required: true, message: '请输入号码', trigger: 'blur'},

        ]
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRef: '',
      editFormRules: {}
    }
  },

  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取用户失败');
      this.userlist = res.data.users;
      this.total = res.data.total;
    }, handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList()
    },
    // 监听状态的改变
    async userStateChanged(userinfo) {
      const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      if (res.meta.status !== 200) return this.$message.error('更新用户状态失败');
      return this.$message.success('更新用户状态成功');
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户预校验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //通过则添加用户
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.addDialogVisible = false;
        this.$message.success('添加用户成功');
        await this.getUserList();
      })
    },

    async showEditDialog(id) {
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      //预校验 要加async
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //通过则提交到服务器
        const {data: res} = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户失败')
        this.editDialogVisible = false;
        this.$message.success('更新用户成功');
        await this.getUserList();
      })
    },

    async removeUserById(id) {
      //弹框提示是否删除（如果不用async和await 就可以用.then .catch）
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果确认删除，返回的是confirm，点取消返回的是cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data: res} = await this.$http.delete('users/' + id);
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')

      this.$message.success('删除用户成功');
      await this.getUserList();
    }

  }


}
</script>

<style lang="less" scoped>

</style>