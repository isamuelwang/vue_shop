<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改按钮" placement="top" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除按钮" placement="top" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="角色分配按钮" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisable"
      width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
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
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%">
        <!-- 内容主体区 -->
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            //验证邮箱规则
            var checkEmail = (rules, value, cb) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-})+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }
            var checkmobile = (rules, value, cb) => {
                const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }
            return {
                editDialogVisible:false,
                //获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                userlist: [],
                total: 0,
                //控制添加用户对话框的显示和隐藏
                addDialogVisable: false,
                //添加用户表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //添加用户表单规则对象
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度3-10字符之间', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '密码长度6-15字符之间', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator:checkEmail,trigger: "blur"}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机', trigger: 'blur'},
                        {validator:checkmobile , trigger: "blur"}
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            //展示编辑用户对话框
            showEditDialog(){
              this.editDialogVisible = true
            },
            //添加新用户
            addUser(){
              this.$refs.addFormRef.validate(async valid=>{
                  if(!valid) return
                  // 验证通过 发起添加用户请求
                  const {data:res} = await this.$http.post('users',this.addForm)
                  if(res.meta.status!==201){
                      this.$message.error('添加用户失败')
                  }
                  this.$message.success('添加用户成功')
                  //关闭对话框
                  this.addDialogVisable = false
                  //重新获取用户列表
                  this.getUserList()
              })
            },
            //监听对话框关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
                this.userlist = res.data.users
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList()
            },
            //监听页码值
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList()
            },
            //监听switch状态的改变
            async userStateChanged(userInfo) {
                const {data: res} = await this.$http.put('users/${userInfo.id}/state/${userInfo.mg_state}')
                if (res.meta.states !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('更新用户状态失败')
                }
                this.$message.success('更新用户状态成功')
            }

        }
    }
</script>

<style lang="less" scoped>

</style>
