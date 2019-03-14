<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAdd()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="first_cate_list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="一级分类名称" width="200" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.flmch1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="cateForm":model="cate" :rules="rules" label-width="120px">
        <el-form-item label="一级分类名称" prop="flmch1">
          <el-input v-model="cate.flmch1" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearBean">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('cateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchFirstCateList,addFirstCate,updateFirstCate,deleteFirstCate} from '@/api/category'
  export default {
    name: "categoryList",
    data(){
      return  {
        cate: {flmch1 : '', id: null},
        first_cate_list: [],
        second_cate_list: [],
        tm_list: [],
        listLoading: true,
        dialogTitle: '',
        dialogVisible: false,
        rules: {
          flmch1: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getFirstCateList()
    },
    methods: {
      getFirstCateList() {
        fetchFirstCateList().then(response => {
          this.listLoading = false;
          this.first_cate_list = response.data;
        })
      },
      clearBean(){
        this.dialogVisible = false;
        this.cate.flmch1 = '';
        this.cate.id = null;
      },
      handleConfirm(formName){//验证表单输入
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append("flmch1",this.cate.flmch1);
            if(this.cate.id == null){
              addFirstCate(data).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });

                this.clearBean();
                this.getFirstCateList();
              });
            }else{
              updateFirstCate(this.cate).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.clearBean();
                this.getFirstCateList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleAdd(){
        this.dialogVisible = true;
        this.dialogTitle = '添加一级分类';
      },
      handleEdit(index, row){
        this.dialogVisible = true;
        this.dialogTitle = '编辑一级分类';
        this.cate.flmch1 = row.flmch1;
        this.cate.id = row.id;
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFirstCate(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.getFirstCateList();
          });
        });
      }
    }
  }
</script>

<style scoped>
</style>
