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
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.shp_mch" placeholder="商品名称"></el-input>
          </el-form-item>
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
          <el-form-item label="二级分类：" prop="flmch2">
            <el-select v-model="listQuery.flbh2" clearable placeholder="请选择">
              <el-option
                v-for="item in second_cate_list"
                :key="item.id"
                :label="item.flmch2"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：" prop="ppmch">
            <el-select v-model="listQuery.pp_id" clearable placeholder="请选择">
              <el-option
                v-for="item in tm_class_list"
                :key="item.id"
                :label="item.ppmch"
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
                :data="spu_list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品名称" width="400" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.shp_mch}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="300" align="center">
          <template slot-scope="scope">
            <p><img style="height: 80px" :src="scope.row.shp_tp"></p>
            <el-button
              size="mini"
              @click="handleImgs(scope.$index, scope.row)">图片管理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="商品描述" width="300" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.shp_msh}}</p>
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
  import {fetchFirstCateList,fetchSecondCateList,fetchTMList,fetchTMCate} from '@/api/category'
  import {fetchSpuList,deleteSpu} from '@/api/spu'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    shp_mch: null,
    flbh1: null,
    flbh2: null,
    pp_id: null
  }

  export default {
    name: "product",
    data(){
      return  {
        listQuery: Object.assign({}, defaultListQuery),
        spu_list: [],
        total: null,
        second_cate_list: [],
        tm_class_list: [],
        tm_list: [],
        first_cate_list: [],
        listLoading: false,
        dialogTitle: '',
        dialogVisible: false,
        flbh1: null,
        pp_id: null,
        rules: {
          flbh1: [
            { required: true, message: '请选择一级分类名称', trigger: 'change' }
          ]
        }
      }
    },
    mounted(){
      this.getFirstCateList()
    },
    methods: {
      getSpuList(){
        this.listLoading = true;
        fetchSpuList(this.listQuery).then(response => {
          this.listLoading = false;
          this.spu_list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getSpuList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getSpuList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getSpuList();
      },
      handleCateChange(){
        let flbh1 = this.listQuery.flbh1;
        if(flbh1!=null && flbh1!=""){
          this.getSecondCateList(flbh1);
          this.getTMClassList(flbh1);
        }else {
          this.second_cate_list = [];
          this.tm_class_list = [];
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
      handleAdd(){
        this.$router.push({path:'/spu/addspu'});
      },
      handleEdit(index, row){
        this.$router.push({path:'/spu/updatespu',query:{id:row.id}});
      },
      handleImgs(index, row){
        this.$router.push({path:'/spu/updatespuImg',query:{id:row.id}});
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
      },
      getTMClassList(flbh1){
        fetchTMList(flbh1).then(response => {
          this.tm_class_list = response.data;
        })
      }
    }
  }
</script>

<style scoped>
</style>
