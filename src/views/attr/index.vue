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
        <el-table-column label="商品图片" width="100" align="center">
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
              @click="handleEdit(scope.$index, scope.row)">编辑属性值</el-button>
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
  </div>
</template>

<script>
  import {fetchFirstCateList,fetchSecondCateList} from '@/api/category'
  import {fetchAttrList} from '@/api/attr'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    flbh1: null,
    flbh2: null,
  }

  export default {
    name: "product",
    data(){
      return  {
        listQuery: Object.assign({}, defaultListQuery),
        attr_list: [],
        total: null,
        second_cate_list: [],
        first_cate_list: [],
        dialogTitle: '',
        dialogVisible: false,
        flbh1: null,
        rules: {
          flbh1: [
            { required: true, message: '请选择一级分类名称', trigger: 'change' }
          ],
          flbh2: [
            { required: true, message: '请选择二级分类名称', trigger: 'change' }
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
      handleDelete(index, row){
        this.$confirm('是否要删除该商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSpu(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.getSpuList();
          });
        });
      }
    }
  }
</script>

<style scoped>
</style>
