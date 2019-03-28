<template>
  <el-card class="form-container" shadow="never" style="width: 75%">
    <div>
      <i class="el-icon-edit-outline"></i>
      <span>添加商品SKU</span>
    </div>
    <div style="margin-top: 50px">
      <el-form ref="spuForm" label-width="120px" style="width: 90%" size="small">
        <el-form-item label="商品名称：" >
          <template>
            {{spu.shp_mch}}
          </template>
        </el-form-item>
        <el-form-item label="商品规格：">
          <el-card shadow="never" class="cardBg">
            <div v-for="(productAttr,idx) in selectProductAttr"><!--商品销售属性-->
              {{productAttr.name}}：
              <div>
                <el-checkbox-group v-model="selectProductAttr[idx].values" @change="showChange">
                  <div v-for="(item,index) in selectProductAttr[idx].options" style="display: inline-block"
                       class="littleMarginLeft">
                    <el-checkbox :label="item.id+'-'+(item.shp_ys||item.shp_bb)" :key="item.id">{{item.shp_ys||item.shp_bb}}</el-checkbox>
                    <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index,item.id)">删除
                    </el-button>
                  </div>
                </el-checkbox-group>
                <el-input v-model="addProductAttrValue[idx]" style="width: 160px;margin-left: 10px" clearable></el-input>
                <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)" style="margin-right: 10px">增加</el-button>
              </div>
            </div>
          </el-card>
          <el-button type="primary" @click="refreshProductSkuList" style="margin-top: 10px">刷新库存表</el-button>
          <el-table style="width: 100%;margin-top: 20px"
                    :data="skuStockList"
                    border>
            <el-table-column label="颜色"  align="center" v-if="showColor" width="120">
              <template slot-scope="scope">
                {{scope.row.shp_ys.split("-")[1]}}
              </template>
            </el-table-column>
            <el-table-column label="版本" align="center" v-if="showVersion" width="120">
              <template slot-scope="scope">
                {{scope.row.shp_bb.split("-")[1]}}
              </template>
            </el-table-column>
            <el-table-column
              label="库存"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.kc"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jg"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="sku名称"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sku_mch"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="销量"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sku_xl"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="库存地址"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.kcdz"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              type="expand"
              label="属性编辑"
              width="50">
              <template slot-scope="scope">
                <el-form label-position="left" inline>
                  <el-form-item label="商品属性：">
                    <el-card shadow="never" class="cardBg">
                      <div v-for="(se,index) in attr_list" :key="se.id" style="margin-top: 10px">
                        <span style="display: inline-block;width: 100px" >{{se.shxm_mch}}:</span>
                        <el-select v-model="scope.row.list_value[index]" clearable placeholder="请选择" @change="handleSEChange">
                          <el-option
                            v-for="item in se.list_value"
                            :key="item.id"
                            :label="item.shxzh+item.shxzh_mch"
                            :value="item.id+'-'+item.shxm_id">
                          </el-option>
                        </el-select>
                      </div>
                    </el-card>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </div>
  </el-card>
</template>

<script>
  import {getSpu,fetchSpuVersions,fetchSpuColors} from '@/api/spu'
  import {addColor,addVersion,delColor,delVersion,fetchAllAttrList} from "@/api/attr";
  import {addSku} from '@/api/sku'

  export default {
    name: "addsku",
    data() {
      return {
        spu:{id:null,shp_mch:'',shp_msh:'',flbh1:null,flbh2:null,pp_id:null},
        list_color: [],
        list_version: [],
        selectProductAttr:[{name:'颜色',values:[],options:[]},{name:'版本',values:[],options:[]}], //values为多选框选中的选项，options为所有选项
        addProductAttrValue: [],
        skuStockList:[],
        showColor: true,
        showVersion: true,
        attr_list: [],
        sku_attr_value:[]
      }
    },
    mounted(){
      let spu_id = this.$route.query.pid
      getSpu(spu_id).then(response=>{
        this.spu = response.data
        fetchAllAttrList(this.spu.flbh2).then(response=>{
          this.attr_list = response.data;
        })
      })
      this.getSpuColors(spu_id);
      this.getSpuVersions(spu_id);
    },
    methods: {
      getSpuColors(id){
        fetchSpuColors(id).then(response=>{
          this.selectProductAttr[0].options = response.data;
        })
      },
      getSpuVersions(id){
        fetchSpuVersions(id).then(response=>{
          this.selectProductAttr[1].options = response.data;
        })
      },
      showChange(){

      },
      refreshProductSkuList() {
        this.showColor = true;
        this.showVersion = true;
        this.skuStockList = [];
        let skuList = this.skuStockList;
        let colors = this.selectProductAttr[0].values;
        let versions = this.selectProductAttr[1].values;
        if(colors.length > 0){
          if(versions.length > 0){
            for (let i = 0; i < colors.length; i++) {//两种属性都有选中值
              for (let j = 0; j < versions.length; j++) {
                skuList.push({
                  shp_ys: colors[i],
                  shp_bb: versions[j],
                  kc: null,
                  jg: null,
                  sku_mch: null,
                  sku_xl: null,
                  kcdz: null,
                  list_value: []
                });
              }
            }
          }else {
            this.showVersion = false;
            for (let i = 0; i < colors.length; i++) {//只选中了颜色的属性值
              skuList.push({
                shp_ys: colors[i],
                kc: null,
                jg: null,
                sku_mch: null,
                sku_xl: null,
                kcdz: null,
                list_value: []
              });
            }
          }
        }else {
          this.showColor = false;
          if(versions.length > 0){
            for (let i = 0; i < versions.length; i++) {//只选中了版本的属性值
              skuList.push({
                shp_bb: versions[i],
                kc: null,
                jg: null,
                sku_mch: null,
                sku_xl: null,
                kcdz: null,
                list_value: []
              });
            }
          }else {
            this.showVersion = false;
            //没有选中的属性
            skuList.push({
              kc: null,
              jg: null,
              sku_mch: null,
              sku_xl: null,
              kcdz: null,
              list_value: []
            });
          }
        }
      },
      handleRemoveProductAttrValue(idx, index,id) {
        this.selectProductAttr[idx].options.splice(index, 1);
        if(idx === 0){
          delColor(id).then(response=>{
            location.reload();
          })
        }else {
          delVersion(id).then(response=>{
            location.reload();
          })
        }
      },
      handleRemoveProductSku(index, row) {
        let list = this.skuStockList;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
      },
      handleAddProductAttrValue(idx){
        var data = new FormData();
        data.append("shp_id",this.spu.id);
        if(idx === 0){
          data.append("shp_ys",this.addProductAttrValue[idx]);
          addColor(data).then(response=>{
            location.reload();
          })
        }else {
          data.append("shp_bb",this.addProductAttrValue[idx]);
          addVersion(data).then(response=>{
            location.reload();
          })
        }
      },
      handleSEChange(){
        console.log(this.skuStockList);
      },
      submitForm(){
        if(this.skuStockList.length > 0){
          let data = new FormData();
          data.append("shp_id", this.spu.id);
          data.append("pp_id",this.spu.pp_id);
          data.append("sku_info",JSON.stringify(this.skuStockList))
          addSku(data).then(response=>{
            this.$message({
              message: '添加成功',
              type: 'success',
              duration:1000
            });
            this.$router.push({path:'/spu'});
          })
        }else {
          this.$message({
            message: '请填写详细的sku信息',
            type: 'warning',
            duration:1000
          });
        }
      }
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>
