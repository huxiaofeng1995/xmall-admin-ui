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
        <el-form :inline="true" ref="searchForm" :rules="rules" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="一级分类：" prop="flbh1">
            <el-select v-model="listQuery.flbh1" clearable placeholder="请选择" @change="handleCateChange()">
              <el-option
                v-for="item in first_cate_list"
                :key="item.id"
                :label="item.flmch1"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类：" prop="flbh2">
            <el-select v-model="listQuery.flbh2" clearable placeholder="请选择">
              <el-option
                v-for="item in second_cate_list"
                :key="item.id"
                :label="item.flmch2"
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
                :data="attr_list"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="300" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.shxm_mch}}</p>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.shfqy=='1'?'启用':'停用'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性值列表" align="center">
          <template slot-scope="scope">
            <p v-for="item in scope.row.list_value" v-show="item.shfqy=='1'"><el-tag size="small">{{item.shxzh}}{{item.shxzh_mch}}</el-tag></p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">属性值管理</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogTableVisible"
      width="30%">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>属性值列表</span>
        <el-button
          class="btn-add"
          @click="handleValueAdd()"
          size="mini">
          添加
        </el-button>
      </el-card>
      <div class="table-container">
        <el-table ref="productTable"
                  :data="value_list"
                  border>
          <el-table-column label="编号" width="70" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="属性值" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.shxzh}}</p>
            </template>
          </el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.shxzh_mch}}</p>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="100" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.shfqy=='1'?'启用':'停用'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleValueDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title="添加属性值"
      :visible.sync="dialogValueAddVisible"
      width="30%" @close="clearBean">
      <el-form :model="value_bean" :rules="rules" ref="valueForm"  label-width="120px">
        <el-form-item label="属性值" prop="shxzh">
          <el-input v-model="value_bean.shxzh"></el-input>
        </el-form-item>
        <el-form-item label="属性值名称" prop="shxzh_mch">
          <el-input v-model="value_bean.shxzh_mch"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearBean">取 消</el-button>
        <el-button type="primary" @click="execValueAdd('valueForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchFirstCateList,fetchSecondCateList} from '@/api/category'
  import {fetchAttrList,addAttrValue,deleteAttr,deleteAttrValue} from '@/api/attr'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    flbh1: null,
    flbh2: null,
  }

  export default {
    name: "attrList",
    data(){
      return  {
        listQuery: Object.assign({}, defaultListQuery),
        attr_list: [],
        value_list: [],
        total: null,
        second_cate_list: [],
        first_cate_list: [],
        dialogTitle: '',
        dialogTableVisible: false,
        dialogValueAddVisible: false,
        value_bean: {id: null, shxzh: '',shxzh_mch: '',shxm_id: null},
        rules: {
          flbh1: [
            { required: true, message: '请选择一级分类名称', trigger: 'change' }
          ],
          flbh2: [
            { required: true, message: '请选择二级分类名称', trigger: 'change' }
          ],
          shxzh: [
            { required: true, message: '请输入属性值', trigger: 'blur' }
          ],
          shxzh_mch: [
            { required: true, message: '请输入属性值名', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getFirstCateList()
    },
    methods: {
      getAttrList(){
        fetchAttrList(this.listQuery).then(respone=>{
          this.attr_list = respone.data.list;
          this.total = respone.data.total;
        })
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getAttrList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getAttrList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getAttrList();
      },
      handleCateChange(){
        let flbh1 = this.listQuery.flbh1;
        if(flbh1!=null && flbh1!=""){
          this.getSecondCateList(flbh1);
        }else {
          this.second_cate_list = [];
        }
      },
      getSecondCateList(flbh1){
        fetchSecondCateList(flbh1).then(response => {
          this.second_cate_list = response.data;
        })
      },
      getFirstCateList() {
        fetchFirstCateList().then(response => {
          this.first_cate_list = response.data;
        })
      },
      clearBean(){
        this.dialogTableVisible = false;
        this.dialogValueAddVisible = false;
        this.value_bean.shxzh_mch = '';
        this.value_bean.shxzh = '';
        this.value_bean.shxm_id = null;
      },
      handleEdit(index, row){
        this.dialogTitle = '属性值管理';
        this.dialogTableVisible = true;
        this.value_list = row.list_value;
        this.value_bean.shxm_id = row.id;
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttr(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.getAttrList();
          });
        });
      },
      execValueAdd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append('shxzh',this.value_bean.shxzh);
            data.append('shxzh_mch',this.value_bean.shxzh_mch);
            data.append('shxm_id',this.value_bean.shxm_id);
            addAttrValue(data).then(response=>{
              this.$message({
                message: '添加成功',
                type: 'success',
                duration:1000
              });
              this.clearBean();
              this.getAttrList();
            });
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleAdd(){
        this.$router.push({path:'/spu/addAttr'})
      },
      handleValueAdd(){
        this.dialogValueAddVisible = true;
      },
      handleValueDelete(index,row){
        this.$confirm('是否要删除该属性值', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttrValue(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.clearBean();
            this.getAttrList();
          });
        });
      }
    }
  }
</script>

<style scoped>
</style>
