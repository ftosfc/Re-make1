<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <span>商品分类</span>
        <el-button type="primary" style="float: right; padding: 3px 0">操作按钮</el-button>
      </div>
      <body>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>

      </el-row>

      <!--      表格-->
      <el-table
          :data="catelist"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          border
          lazy
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
            type="index"
            width="50px">
        </el-table-column>
        <el-table-column
            prop="cat_name"
            label="分类名称"
            sortable
        >
        </el-table-column>
        <el-table-column
            label="状态"
            sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
               style="color:lightgreen"></i>
            <i class="el-icon-error" v-else
               style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="排序"
            sortable
        >
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            label="操作"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>

          </template>
        </el-table-column>

      </el-table>

      <!--      分页区-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      </body>
    </el-card>

    <!--    添加分类对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
    >
      <el-form status-icon :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="70px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--              options指定数据源-->
          <!--          props用来指定配置对象其中id表示对象值，label表示我们看到的对象名称-->
          <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',
              children: 'children',checkStrictly:'true'}"
              clearable

              @change="parentCateChange"></el-cascader>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      catelist: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [{
          required: true, trigger: 'blur', message: "请输入类名"
        }]
      },
      parentCateList: [],
      selectedKeys: []//选中的父级id数组
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    showAddCateDialog() {
      //先获取父级分类列表
      this.getParentCateList();
      this.addCateDialogVisible = true;

    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0

    },

    //获取父级分类
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {
        params: {type: 2}
      })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败')
      this.parentCateList = res.data

    },
    //级联选择器改变
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        //夫分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类复制
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        await this.getCateList()
        this.addCateDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>