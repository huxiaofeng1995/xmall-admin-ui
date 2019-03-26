<template>
  <el-card class="form-container" shadow="never">
    <div>
      <i class="el-icon-edit-outline"></i>
      <span>修改商品</span>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="spu" :rules="rules" ref="spuForm" label-width="120px" style="width: 600px" size="small">
        <el-form-item label="一级分类：" prop="flbh1">
          <el-select v-model="spu.flbh1" clearable placeholder="请选择" @change="handleCateChange()" disabled>
            <el-option
              v-for="item in first_cate_list"
              :key="item.id"
              :label="item.flmch1"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类：" prop="flbh2">
          <el-select v-model="spu.flbh2" clearable placeholder="请选择">
            <el-option
              v-for="item in second_cate_list"
              :key="item.id"
              :label="item.flmch2"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌：" prop="pp_id">
          <el-select v-model="spu.pp_id" clearable placeholder="请选择">
            <el-option
              v-for="item in tm_class_list"
              :key="item.id"
              :label="item.ppmch"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="shp_mch">
          <el-input v-model="spu.shp_mch"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
            :autoSize="true"
            v-model="spu.shp_msh"
            type="textarea"
            placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm('spuForm')">确 定</el-button>
      </span>
    </div>
  </el-card>
</template>

<script>
  import {fetchFirstCateList,fetchSecondCateList,fetchTMList,fetchTMCate} from '@/api/category'
  import {getSpu,updateSpu} from '@/api/spu'
  import Qs from 'qs'

  export default {
    name: "addspu",
    data(){
      return  {
        spu:{id:null,shp_mch:'',shp_msh:'',flbh1:null,flbh2:null,pp_id:null},
        tm_class_list: [],
        first_cate_list: [],
        second_cate_list: [],
        rules: {
          flbh1: [
            { required: true, message: '请选择一级分类', trigger: 'change' }
          ],
          flbh2: [
            { required: true, message: '请选择二级分类', trigger: 'change' }
          ],
          pp_id: [
            { required: true, message: '请选择品牌', trigger: 'change' }
          ],
          shp_mch: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      let id = this.$route.query.id
      getSpu(id).then(response=>{
        this.spu = response.data;
        let flbh1 = this.spu.flbh1;
        this.getFirstCateList();
        this.getSecondCateList(flbh1);
        this.getTMClassList(flbh1);
      });
    },
    methods: {
      handleCateChange(){
        let flbh1 = this.spu.flbh1;
        if(flbh1!=null && flbh1!=""){
          this.getSecondCateList(flbh1);
          this.getTMClassList(flbh1);
        }else {
          this.second_cate_list = [];
          this.tm_class_list = [];
        }
      },
      getFirstCateList() {
        fetchFirstCateList().then(response => {
          this.first_cate_list = response.data;
        })
      },
      getSecondCateList(flbh1){
        fetchSecondCateList(flbh1).then(response => {
          this.second_cate_list = response.data;
        })
      },
      getTMClassList(flbh1){
        fetchTMList(flbh1).then(response => {
          this.tm_class_list = response.data;
        })
      },
      clearBean(){
        this.spu.shp_mch = '';
        this.spu.id = null;
        this.spu.pp_id = null;
        this.spu.shp_msh = '';
        this.spu.flbh1 = null;
        this.spu.flbh2 = null;
      },
      handleConfirm(formName){//验证表单输入
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateSpu(this.spu).then(response=>{
              this.$message({
                message: '修改成功',
                type: 'success',
                duration:1000
              });
              this.$router.push({path:'/spu/product'});
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
