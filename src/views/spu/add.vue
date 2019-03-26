<template>
  <el-card class="form-container" shadow="never">
    <div>
      <i class="el-icon-edit-outline"></i>
      <span>添加商品</span>
    </div>
    <div style="margin-top: 50px">
      <el-form :model="spu" :rules="rules" ref="spuForm" label-width="120px" style="width: 600px" size="small">
        <el-form-item label="一级分类：" prop="flbh1">
          <el-select v-model="spu.flbh1" clearable placeholder="请选择" @change="handleCateChange()">
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
        <el-form-item label="商品颜色：">
          <template>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addColor"></el-button>
            <el-input v-for="(item, index) in list_color" :key="item.index" v-model="item.shp_ys"></el-input>

          </template>
        </el-form-item>
        <el-form-item label="商品版本：">
          <template>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVersion"></el-button>
            <el-input v-for="(item, index) in list_version" :key="item.index" v-model="item.shp_bb"></el-input>
          </template>
        </el-form-item>
        <el-form-item label="商品图片：" >
          <template slot-scope="scope">
            <div id = "dimg" v-for="item in fileItems" style="float:left">
              <input ref="imgFile" type="file" name="files" style="display: none" @change="upFile($event,item.index)"/>
              <img :id="'img_'+item.index" style="cursor: pointer;margin-left: 5px" :src="item.src" width="80px" height='80px' @click="upimg(item.index)"/></div>
          </template>
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
  import {addSpu} from '@/api/spu'
  import Qs from 'qs'

  export default {
    name: "addspu",
    data(){
      return  {
        spu:{id:null,shp_mch:'',shp_msh:'',flbh1:null,flbh2:null,pp_id:null},
        list_color: [],
        list_version: [],
        files: [],
        fileItems:[{index: 0,src: './static/img/upload_hover.png'}],
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
      this.getFirstCateList()
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
            const{shp_mch,shp_msh,flbh1,flbh2,pp_id} = this.spu;
            let data = new FormData();

            data.append("shp_mch", shp_mch );
            data.append("shp_msh", shp_msh );
            data.append("flbh1", flbh1 );
            data.append("flbh2", flbh2 );
            data.append("pp_id", pp_id );
            for(var i = 0; i < this.files.length;i++){//上传多个文件
              data.append("files", this.files[i]);
            }
            data.append("colors",JSON.stringify(this.list_color));
            data.append("versions",JSON.stringify(this.list_version));
            data.append("files",this.files);
            addSpu(data).then(response=>{
              this.$message({
                message: '添加成功',
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
      },
      upimg(index) {
        //触发该img标签匹配的file input标签的点击事件，来上传文件
        this.$refs.imgFile[index].click();
      },
      upFile(event,index) {
        //使用img标签预览上传的图片
        //获得图片对象
        var blob_img = event.target.files[0] ;
        if(window.URL.createObjectURL) {
          var url = window.URL.createObjectURL(blob_img);
          //替换img,显示选中上传的图片
          this.fileItems[index].src = url;
          //图片上传成功后，生成下一个空白的图片标签
          this.addimg(index);
        }else {
          var fr = new FileReader();
          fr.onload = function () {
            this.fileItems[index].src = this.result;
          }
          fr.readAsDataURL(blob_img);
          this.addimg(index);
        }
        //将图片存入请求参数中
        this.files[index] = blob_img;
      },
      addimg(index){
        var length = this.$refs.imgFile.length;//获取当前文件input/img 标签的数量
        if((index+1) == length && index < 4){//说明用户点击的是最后一张,并限制图片个数,这里限制了5张图片
          index++;
          var obj= {index: index,src:'./static/img/upload_hover.png'};
          this.fileItems.push(obj)
        }
      },
      addColor(){
        this.list_color.push({shp_ys:''})
      },
      addVersion(){
        this.list_version.push({shp_bb:''})
      }
    }
  }
</script>

<style scoped>
</style>
