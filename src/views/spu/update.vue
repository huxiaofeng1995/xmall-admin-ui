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
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="一级分类名称" width="400" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.flmch1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="品牌" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleShowTMLIST(scope.$index, scope.row)">查看该分类的品牌</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      width="30%">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
        <el-button
          class="btn-add"
          @click="handleTMAdd()"
          size="mini">
          添加
        </el-button>
      </el-card>
      <div class="table-container">
        <el-table ref="productTable"
                  :data="tm_class_list"
                  v-loading="listLoading"
                  border>
          <el-table-column label="编号" width="70" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="品牌名称" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.ppmch}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleTMDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title="添加品牌"
      :visible.sync="dialogTMAddVisible"
      width="30%">
      <el-form ref="tmForm" :rules="rules" label-width="120px">
        <el-form-item label="品牌：">
          <el-select v-model="pp_id" clearable placeholder="请选择">
            <el-option
              v-for="item in tm_list"
              :key="item.id"
              :label="item.ppmch"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearBean">取 消</el-button>
        <el-button type="primary" @click="execTMAdd()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchFirstCateList,addFirstCate,updateFirstCate,deleteFirstCate,fetchTMList,fetchTMCate,addTMCLASS,deleteTMCLASS} from '@/api/category'
  export default {
    name: "firstCategoryList",
    data(){
      return  {
        cate: {flmch1 : '', id: null},
        tm_class_list: [],
        tm_list: [],
        first_cate_list: [],
        listLoading: true,
        dialogTitle: '',
        dialogVisible: false,
        dialogTableVisible: false,
        dialogTMAddVisible: false,
        flbh1: null,
        pp_id: null,
        rules: {
          flmch1: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getFirstCateList()
      this.getTMList()
    },
    methods: {
      getTMList(){
        fetchTMCate().then(response => {
          this.tm_list = response.data;
        })
      },
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
        this.dialogTMAddVisible = false;
        this.pp_id = null;
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
      },
      handleShowTMLIST(index, row){
        this.dialogTableVisible = true;
        this.dialogTitle = '品牌列表';
        this.flbh1 = row.id;
        this.getTMClassList(this.flbh1)
      },
      getTMClassList(flbh1){
        fetchTMList(flbh1).then(response => {
          this.tm_class_list = response.data;
        })
      },
      handleTMAdd(){
        this.dialogTMAddVisible = true;
      },
      execTMAdd(){
        if(this.pp_id !=null){
          let data = new FormData();
          data.append("pp_id",this.pp_id);
          data.append("flbh1",this.flbh1);
          addTMCLASS(data).then(response=>{
            this.$message({
              message: '添加成功',
              type: 'success',
              duration:1000
            });
            this.clearBean();
            this.getTMClassList(this.flbh1)
          });
        }else {
          this.$message({
            message: '请选择品牌',
            type: 'error',
            duration:1000
          });
        }
      },
      handleTMDelete(index,row){
        deleteTMCLASS(row.id,this.flbh1).then(response=>{
          this.$message({
            message: '删除成功',
            type: 'success',
            duration:1000
          });
          this.getTMClassList(this.flbh1);
        });
      }
    }
  }
</script>

<style scoped>
</style>
