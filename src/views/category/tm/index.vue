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
                :data="tm_list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.ppmch}}</p>
          </template>
        </el-table-column>
        <el-table-column label="品牌图片" width="300" align="center">
            <template slot-scope="scope"><img style="height: 80px" :src="scope.row.url"></template>
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
      <el-form ref="cateForm" :model="cate" :rules="rules" label-width="120px">
        <el-form-item label="品牌名称" prop="flmch2">
          <el-input v-model="cate.ppmch" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌图片" prop="flmch2">
          <template slot-scope="scope">
            <div id = "dimg" v-for="item in fileItems" style="float:left">
            <input ref="imgFile" type="file" name="files" style="display: none" @change="upFile($event,item.index)"/>
            <img :id="'img_'+item.index" style="cursor: pointer;margin-left: 5px" :src="item.src" width="100px" height='100px' @click="upimg(item.index)"/></div>
          </template>
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
  import {fetchFirstCateList,fetchTMCate,addTMCate,deleteTMCate} from '@/api/category'
  export default {
    name: "secondCategoryList",
    data(){
      return  {
        files: [],
        fileItems:[{index: 0,src: './static/upload_hover.png'}],
        cate: {ppmch : '', id: null, url: ''},
        tm_list: [],
        listLoading: true,
        dialogTitle: '',
        dialogVisible: false,
        rules: {
          ppmch: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getTMList();
    },
    methods: {
      getTMList(){
        fetchTMCate().then(response => {
          this.listLoading = false;
          this.tm_list = response.data;
        })
      },
      clearBean(){
        this.dialogVisible = false;
        this.cate.ppmch = '';
        this.cate.id = null;
        this.cate.url = '';
        this.files = [];
        this.fileItems = [{index: 0,src: './static/img/upload_hover.png'}];
      },
      handleAdd(){
        this.dialogVisible = true;
        this.dialogTitle = '添加品牌';
      },
      handleConfirm(formName){//验证表单输入
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = new FormData();
            data.append("ppmch",this.cate.ppmch);
            data.append("file",this.files[0]);
            if(this.cate.id == null){
              addTMCate(data).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                this.clearBean();
                this.getTMList();
              });
            }else{
              //更新功能暂不提供
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleEdit(index, row){
        this.$message({
          message: '请删除该品牌并重新添加',
          type: 'success',
          duration:1000
        });
        // this.dialogVisible = true;
        // this.dialogTitle = '编辑品牌';
        // this.flag = true;
        // this.cate.ppmch = row.ppmch;
        // this.cate.id = row.id;
        // this.cate.url = row.url;
      },
      handleDelete(index, row){
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTMCate(row.id).then(response=>{
            this.$message({
              message: '删除成功',
              type: 'success',
              duration:1000
            });
            this.getTMList();
          });
        });
      },
      upimg(index) {
        console.log(this.$refs);
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
          //this.addimg(index);
        }else {
          var fr = new FileReader();
          fr.onload = function () {
            this.fileItems[index].src = this.result;
          }
          fr.readAsDataURL(blob_img);
          //this.addimg(index);
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
      }
    }
  }
</script>

<style scoped>

</style>
