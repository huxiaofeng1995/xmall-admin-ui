<template>
  <el-card class="form-container" shadow="never" style="width: 880px">
    <div>
      <i class="el-icon-edit-outline"></i>
      <span>添加属性</span>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="attr" :inline="true" :rules="rules" ref="attrForm" label-width="120px" style="width: 800px" size="small">
        <el-form-item label="一级分类：">
          <el-select v-model="flbh1" clearable placeholder="请选择" @change="handleCateChange()">
            <el-option
              v-for="item in first_cate_list"
              :key="item.id"
              :label="item.flmch1"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类：" prop="flbh2">
          <el-select v-model="attr.flbh2" clearable placeholder="请选择">
            <el-option
              v-for="item in second_cate_list"
              :key="item.id"
              :label="item.flmch2"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称：" prop="shxm_mch">
          <el-input v-model="attr.shxm_mch"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="添加属性值：" ></el-form-item>
        <div v-for="(item, index) in attr.list_value" :key="item.index">
          <el-form-item
            :prop="'list_value.' + index + '.shxzh'"
            :label="'属性值:'"
            :rules="{
                required: true, message: '属性值不能为空', trigger: 'blur'
              }"
          >
            <el-input v-model="item.shxzh"></el-input>
          </el-form-item>
          <el-form-item
            :label="'属性值名称:'"
            :prop="'list_value.' + index + '.shxzh_mch'"
            :rules="{
                required: true, message: '属性值名称不能为空', trigger: 'blur'
              }"
          >
            <el-input v-model="item.shxzh_mch"></el-input>
          </el-form-item>
          <el-button @click.prevent="removeValue(item,index)">删除</el-button>
        </div>
        <el-form-item style="margin-left:300px">
          <el-button type="primary" @click="submitForm('attrForm')">提交</el-button>
          <el-button @click="addValue">新增属性值</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
  import {fetchFirstCateList,fetchSecondCateList} from '@/api/category'
  import {addAttr} from '@/api/attr'

  export default {
    name: "addAttr",
    data(){
      return  {
        attr:{id:null,shxm_mch:'',flbh2:null,list_value:[{shxzh: '',shxzh_mch: ''}]},
        first_cate_list: [],
        second_cate_list: [],
        flbh1: null,
        rules: {
          flbh1: [
            { required: true, message: '请选择一级分类', trigger: 'change' }
          ],
          flbh2: [
            { required: true, message: '请选择二级分类', trigger: 'change' }
          ],
          shxm_mch: [
            { required: true, message: '请输入属性名', trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      this.getFirstCateList()
    },
    methods: {
      handleCateChange(){
        let flbh1 = this.flbh1;
        if(flbh1!=null && flbh1!=""){
          this.getSecondCateList(flbh1);
        }else {
          this.second_cate_list = [];
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
      clearBean(){
        this.attr.list_value = [{shxzh: '',shxzh_mch: ''}];
        this.attr.shxm_mch = '';
        this.flbh1 = null;
        this.attr.flbh2 = null;
      },
      addValue(){
        this.attr.list_value.push({shxzh: '',shxzh_mch: ''})
      },
      removeValue(item,index){
        console.log(index);
        let i = this.attr.list_value.indexOf(item);
        if(i !== -1){
          this.attr.list_value.splice(i, 1);
        }
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addAttr(this.attr).then(response=>{
              this.$message({
                message: '添加成功',
                type: 'success',
                duration:1000
              });
              this.clearBean();
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
