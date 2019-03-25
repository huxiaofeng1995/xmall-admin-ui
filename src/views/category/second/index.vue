<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" ref="searchForm" size="small" label-width="140px">
          <el-form-item label="商品一级分类：" prop="flmch1">
            <el-select v-model="flbh1" clearable placeholder="请选择">
              <el-option
                v-for="item in first_cate_list"
                :key="item.id"
                :label="item.flmch1"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
                :data="second_cate_list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="二级级分类名称" width="200" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.flmch2}}</p>
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
        <el-form-item label="一级分类：" prop="flbh1">
          <el-select v-model="flbh1" clearable placeholder="请选择">
            <el-option
              v-for="item in first_cate_list"
              :key="item.id"
              :label="item.flmch1"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类名称" prop="flmch2">
          <el-input v-model="cate.flmch2" auto-complete="off"></el-input>
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
  import {fetchFirstCateList,fetchSecondCateList,addSecondCate,updateSecondCate,deleteSecondCate} from '@/api/category'
  export default {
    name: "secondCategoryList",
    data(){
      return  {
        flbh1: null,
        cate: {flmch2 : '', id: null, flbh1: null},
        first_cate_list: [],
        second_cate_list: [],
        listLoading: true,
        dialogTitle: '',
        dialogVisible: false,
        rules: {
          flmch2: [
            { required: true, message: '请输入二级分类名称', trigger: 'blur' }
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
      handleSearchList(){
        if (this.flbh1 != null && this.flbh1 != "") {
          fetchSecondCateList(this.flbh1).then(response => {
            this.listLoading = false;
            this.second_cate_list = response.data;
          })
        }else {
          this.$message({
            message: '请选择一级分类',
            type: 'warning',
            duration:1000
          });
        }
      },
      clearBean(){
        this.dialogVisible = false;
        this.cate.flmch2 = '';
        this.cate.id = null;
        this.cate.flbh1 = null;
      },
      handleAdd(){
        this.dialogVisible = true;
        this.dialogTitle = '添加二级分类';
      },
      handleConfirm(formName){//验证表单输入
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append("flmch2",this.cate.flmch2);
            data.append("flbh1",this.flbh1);
            if(this.cate.id == null){
              addSecondCate(data).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                this.clearBean();
                this.handleSearchList();
              });
            }else{
              updateSecondCate(this.cate).then(response=>{
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.clearBean();
                this.handleSearchList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleEdit(index, row){
        this.dialogVisible = true;
        this.dialogTitle = '编辑二级分类';
        this.flag = true;
        this.cate.flmch2 = row.flmch2;
        this.cate.id = row.id;
        this.cate.flbh1 = row.flbh1;
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该子分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSecondCate(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.handleSearchList();
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
