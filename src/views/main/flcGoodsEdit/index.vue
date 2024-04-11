<template>
  <div class="flcGoods-container">
    <el-tabs type="border-card">
      <el-tab-pane label="商品属性">
        <el-card class="infoCard" shadow="never">
          <template #header>
            <div class="card-header">
              <span>基础信息</span>
            </div>
          </template>
          <div style="width: 800px;">
            <el-form :model="ruleForm" :inline="true" ref="ruleFormRef" labelWidth="150" :rules="rules">
              <el-form-item label="商品名称" prop="goodsName">

                <el-input v-model="ruleForm.goodsName" clearable placeholder="请输入商品名称" maxlength="32" show-word-limit />
              </el-form-item>
              <el-form-item label="商品编码">
                <el-input v-model="ruleForm.productCode" clearable placeholder="请输入商品编码" />
              </el-form-item>
              <el-form-item label="商品分类" prop="categoryId">
                <el-cascader :props="props" :options="categoryTree" v-model="ruleForm.categoryId" clearable
                  placeholder="请选择商品分类" :show-all-levels="false" />
              </el-form-item>
              <el-form-item label="商品简介">
                <el-input v-model="ruleForm.description" autosize clearable placeholder="请输入商品简介" />
              </el-form-item>
            </el-form>

          </div>
        </el-card>
        <el-card class="infoCard" shadow="never">
          <template #header>
            <div class="card-header">
              <span>商品封面</span>
            </div>
          </template>
          <div class="flex_box">
            <div class="card_box">
              <img class="el-upload-list__item-thumbnail" :src="ruleForm.coverImage" alt="" style="width: 100%" />
            </div>
            <el-upload :file-list="FileList" action="" list-type="picture-card" :on-change="handleChange"
              :auto-upload="false">
              <el-icon>
                <Plus />
              </el-icon>

              <template #file="{ file }">
                <div>

                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                      <el-icon>
                        <Download />
                      </el-icon>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>

          </div>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-card>
        <el-card class="infoCard" shadow="never">
          <template #header>
            <div class="card-header">
              <span>规格参数</span>
            </div>
          </template>
          <div>
            <el-text class="mx-1">规格参数</el-text>
            <el-checkbox-group v-model="checkList" @change="checkChange">
              <el-checkbox v-for="(item, index) in proSpeList" :label="item.speName" :key="index" :value="item.id" />
            </el-checkbox-group>
            <div v-for="(item, index) in showSpeList" :key="index">
              <el-text class="mx-1">{{ item.title }}</el-text>
              <el-checkbox-group v-model="item.checkSpeValue" @change="checkChangeSpe">
                <el-checkbox v-for="(ele, i) in item.list" :label="ele.speValue" :key="i" :value="ele" />
              </el-checkbox-group>
            </div>
          </div>
          <div>
            <el-table :data="tableData" border stripe style="width: 100%;height: 460px;" >
              <el-table-column v-for="(item, i) in tableHeader" :key="i" :label="item">
                <template #default="scope">
                  <el-text class="mx-1">{{ scope.row.speValueList[i] ? scope.row.speValueList[i]['speValue'] : ''
                    }}</el-text>
                </template>
              </el-table-column>
              <el-table-column prop="address" width="310" label="规格图片">
                <template #default="scope">
                  <div class="flex_box">
                    <div class="card_box_mini">
                      <img class="el-upload-list__item-thumbnail" :src="scope.row.coverImage" alt=""
                        style="width: 100%" />
                    </div>
                    <el-upload
                    style="display: flex;align-items: center;"
                    :file-list="scope.row.file" action="" list-type="picture-card"
                      :on-change="(file: any, fileList: any) => { handleChangeRow(file, scope.row) }"
                      :auto-upload="false">
                      <el-icon>
                        <Plus />
                      </el-icon>

                      <template #file="{ file }">
                        <div >

                          <img class="el-upload-list__item-thumbnail " :src="file.url" alt="" />
                          <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                              <el-icon><zoom-in /></el-icon>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                              <el-icon>
                                <Download />
                              </el-icon>
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete"
                              @click="handleRemoveRow(file, scope.row)">
                              <el-icon>
                                <Delete />
                              </el-icon>
                            </span>
                          </span>
                        </div>
                      </template>
                    </el-upload>
                  </div>

                </template>
              </el-table-column>
              <el-table-column label="规格条码">
                <template #default="scope">
                  <el-input v-model="scope.row.barCode" maxlength="7" autosize clearable placeholder="请输入规格条码" show-word-limit />
                </template>
              </el-table-column>
              <el-table-column label="规格单位">
                <template #default="scope">
                  <el-select v-model="scope.row.unitId" placeholder="Select" size="small">
                    <el-option v-for="item in unitList" :key="item.id" :label="item.unitName" :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="成本价">
                <template #default="scope">
                  <el-input-number v-model="scope.row.costPrice" :min="0" size="small" controls-position="right" />
                </template>
              </el-table-column>
              <el-table-column label="销售价">
                <template #default="scope">
                  <el-input-number v-model="scope.row.salesPrice" :min="0" size="small" controls-position="right" />
                </template>
              </el-table-column>
              <el-table-column label="打印自定义">
                <template #default="scope">
                  <el-input v-model="scope.row.printCustom"  size="small" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div style="margin-top: 10px;" class="button_div">
          <div class="bbp">
            <el-button type="success" @click="check" size="large">保存</el-button>
          </div>
        </div>

      </el-tab-pane>
      <!-- <el-tab-pane label="规格参数">

        </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script lang="ts" setup="" name="flcGoodsEdit">
import { ref, watch, onMounted, nextTick } from "vue";

import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from "element-plus";
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { detailFlcGoods, listFlcProductSpecifications, listFlcGoodsUnit, flcCategoryTree, uFlcGoods, updateFlcGoodsSkuList, listFlcGoodsSku } from '/@/api/main/flcGoodsEdit';
import { addFlcGoods } from "/@/api/main/flcGoods";
import type { FormRules } from "element-plus";
import type { UploadFile } from 'element-plus'
import { getAPI } from '/@/utils/axios-utils';
import { SysFileApi } from '/@/api-services/api';
import { Session } from '/@/utils/storage';


const props = {
  checkStrictly: true,
  emitPath: false,
  label: 'categoryName',
  value: 'id'
}
const ruleForm = ref<any>({});
const categoryTree = ref<any>([])
const checkList = ref<any>([])
const proSpeList = ref<any>([])
const showSpeList = ref<any>([])
const tableData = ref<any>([])
const tableHeader = ref<any>([])
const unitList = ref<any>([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const checkSpeList = ref<any>([])
const FileList = ref<any>([]);
const router = useRouter();
const ruleFormRef = ref();
const GoodsId: Number = Number(router.currentRoute.value.query.id);
//自行添加其他规则
const rules = ref<FormRules>({
		goodsName: [{required: true, message: '请输入商品名！', trigger: 'blur',},],
		categoryId: [{required: true, message: '请选择所属分类！', trigger: 'change',},],
	});
//查询基本信息
const handleQueryDetail = async () => {
  if(GoodsId){
    var res = await detailFlcGoods(GoodsId);
    ruleForm.value = res.data.result;
    nextTick(() => {
      handleQuerysku()
    })
  }
};

// pinia 中获取路由信息：如果是设置了固定的（isAffix），进行初始化显示
const initTagsView = async () => {
  let tagsViewList=await Session.get('tagsViewList');
  console.log(tagsViewList)
  let index=-1
  for(let i=0;i<tagsViewList.length;i++){
    if(tagsViewList[i].name=="GoodsEdit"){
      index=i
    }
  }
  if(index!=-1){
    tagsViewList.splice(index, 1)
  }
  console.log(tagsViewList)
  await Session.set('tagsViewList', tagsViewList);
  router.go(-1)
};
// 上传
const uploadFile = async () => {
  if (FileList.value.length > 0) {
    var result = await getAPI(SysFileApi).apiSysFileUploadFilePostForm(FileList.value[0].raw);
    ruleForm.value.coverImage = result.data.result?.url
  }

  let tab = tableData.value;
  for (let i = 0; i < tab.length; i++) {
    if (tab[i].file) {
      console.log(tab[i])
      let row_result = await getAPI(SysFileApi).apiSysFileUploadFilePostForm(tab[i].file[0].raw);
      tab[i].coverImage = row_result.data.result?.url;
    }
  }
  tableData.value = tab;
  saveDetail()
};
//基础信息校验
const check=()=>{
  ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
			if (isValid) {
        let ok=jc()
        if(!ok){
          return
        }
				uploadFile()
			} else {
				ElMessage({
					message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
					type: "error",
				});
			}
		});
}
//规格校验
const jc=()=>{
  let sku_info = tableData.value;
  if(!sku_info||sku_info.length==0){
    ElMessage.error('请添加规格参数')
    return false
  }
  let barCode='';
  for(let i=0;i<sku_info.length;i++){
    var item=sku_info[i]
    if(!item.unitId||item.unitId==''||item.unitId==undefined||item.unitId==null||item.unitId==0){
      ElMessage.error('请完善规格单位')
      return false
    }
    if(item.barCode&&item.barCode.length!=7){
      ElMessage.error('规格第'+(i+1)+'行，条码长度必须七位！')
      return false
    }
    if(barCode==''){
      barCode=item.barCode
    }else{
      if(barCode==item.barCode){
        ElMessage.error('重复条码请检查！')
        return false
      }
    }
  }
  return true
}
// 通过onChanne方法获得文件列表
const handleChange = (file: any) => {
  let list = [];
  list.push(file)
  FileList.value = list;
};
// 通过onChanne方法获得文件列表
const handleChangeRow = (file: any, row: any) => {
  let list = [];
  list.push(file)
  row.file = list;
};
// 查询规格列表
const handleQuery = async () => {
  var res = await listFlcProductSpecifications();
  proSpeList.value = res.data.result ?? [];
};
// 查询单位列表
const handleQueryUnit = async () => {
  var res = await listFlcGoodsUnit();
  unitList.value = res.data.result ?? [];
};
// 查询类型树
const handleQuerycategory = async () => {
  var res = await flcCategoryTree();
  categoryTree.value = res.data.result ?? [];
};

// 查询sku
const handleQuerysku = async () => {
  var res = await listFlcGoodsSku(GoodsId);
  let data = res.data.result
  let check_one: any[] = [];
  let check_two: any[] = [];
  data.forEach((item: any) => {
    item.speValueList.forEach((ele: any) => {
      let index_one = check_one.indexOf(ele.specificationId)
      if (index_one == -1) {
        check_one.push(ele.specificationId)
      }
      let index_two = check_two.indexOf(ele.id)
      if (index_two == -1) {
        check_two.push(ele.id)
      }
    })
  })
  checkList.value = check_one
  checkChange(check_two)
  setTimeout(()=>{
    nextTick(() => {
      tableData.value = data
    })
  },300)
  


  // categoryTree.value = res.data.result ?? [];
};


const handleRemove = (file: UploadFile) => {
  let list = FileList.value
  let index = list.indexOf(file)
  if (index != -1) {
    list.splice(index, 1)
  }
}
const handleRemoveRow = (file: UploadFile, row: any) => {
  let index = row.file.indexOf(file)
  if (index != -1) {
    row.file.splice(index, 1)
  }
}


const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const checkChange = (check_two?: any[]) => {
  let data = checkList.value;
  let pdata = proSpeList.value;
  let oringshowSpeList = showSpeList.value;
  let showdata: {
    checkSpeValue: any;
    title: string;
    list: any;
    id: any
  }[] = [];
  for(let i=0;i<data.length;i++){
    let item:any=data[i];
    for(let j=0;j<pdata.length;j++){
      let ele:any=pdata[j]
      if (ele.id == item) {
        let checkSpeValue: any[] = []
        if (check_two) {
          ele.speValues.forEach((i: any) => {
            let index_ok = check_two.indexOf(i.id)
            if (index_ok != -1) {
              checkSpeValue.push(i)
            }
          })
        }

        showdata.push({
          title: ele.speName,
          list: ele.speValues,
          id: ele.id,
          checkSpeValue: checkSpeValue
        })

      }
    }
  }
  for(let i=0;i<oringshowSpeList.length;i++){
    let ele:any=oringshowSpeList[i];
    for(let j=0;j<showdata.length;j++){
      let item:any=showdata[j];
      if (item.id == ele.id) {
        item.checkSpeValue = ele.checkSpeValue
      }
    }
  }
  showSpeList.value = showdata
  nextTick(() => {
    checkChangeSpe()
  })
 
}
const checkChangeSpe = () => {
  let data = showSpeList.value;
  let result: any[] = [];
  let tabResult: any[] = [];
  for(let i=0;i<data.length;i++){
    let item:any=data[i]
    if (item.checkSpeValue && item.checkSpeValue.length > 0) {
      result.push(item.title)
      tabResult.push(item.checkSpeValue)
    }
  }
  tableHeader.value = result;
  checkSpeList.value = tabResult;

}
const saveDetail =async () => {
  let goodes_info = ruleForm.value;
  let sku_info = tableData.value;
  if(GoodsId){
    let result_good=await uFlcGoods(goodes_info);
    if(result_good.data.code==200){
      ElMessage.success('商品信息已保存')
    }
    let result_sku=await updateFlcGoodsSkuList(sku_info)
    if(result_sku.data.code==200){
      ElMessage.success('规格已保存')
    }
  }else{
    let result=await addFlcGoods(goodes_info);
    let goodId=result.data.result;
    for(let i=0;i<sku_info.length;i++){
      sku_info[i].goodsId=goodId
    }
    ElMessage.success('商品信息已保存')
    let result_sku=await updateFlcGoodsSkuList(sku_info)
    if(result_sku.data.code==200){
      ElMessage.success('规格已保存')
    }
  }
  initTagsView()
}

watch(checkSpeList, async (newcheckSpeList) => {

  let table = tableData.value;
  //console.log(table)
  let result: any[] = [];
  var descartes = (pre: any = [], suf: any = []) => {
    if (!pre || pre.length < 1) {
      return suf;
    }
    let result: any = [];
    pre.forEach((o1: any) => {
      suf.forEach((o2: any) => {
        result.push([o1, o2]);
      })
    })
    return result;
  };

  function main(props: any) {
    // 定义最终的结果集
    var res: any[] = [];
    // 循环属性列表 - 支持N种属性
    props.forEach((t: any) => {
      res = descartes(res, t);
      //console.log(res);
    })
    //console.log('笛卡尔积后：', res);

    res.forEach((item: any) => {
      let row: {
        speValueList: any[],
        unitId: Number,
        coverImage: String,
        costPrice: Number,
        salesPrice: Number,
        goodsId: Number,
        barCode: String,
        id: String
      } = {
        speValueList: [],
        id: '',
        unitId: 0,
        coverImage: '',
        costPrice: 0,
        salesPrice: 0,
        goodsId: GoodsId,
        barCode: ''
      }
      let index = -1
      for (let i = 0; i < table.length; i++) {
        let ok = true
        for (let item_index = 0; item_index < item.length; item_index++) {
          if (!table[i].speValueList[item_index]) {
            ok = false
          } else {
            if (item[item_index].id != table[i].speValueList[item_index].id) {
              ok = false
            }
          }

        }
        if (ok) {
          index = i
        }
      }
      if (index != -1) {
        row.speValueList = row.speValueList.concat(item)
        row.unitId = table[index].unitId
        row.coverImage = table[index].coverImage
        row.costPrice = table[index].costPrice
        row.salesPrice = table[index].salesPrice
        row.barCode = table[index].barCode
        row.id = table[index].id
        result.push(row)
      } else {
        row.speValueList = row.speValueList.concat(item)
        result.push(row)
      }
    })
    // 逆向
    // props.reverse();
    // res = [];
    // props.forEach(t => {
    // 	res = descartes(res, t);
    // 	//console.log(res);
    // })
    // console.log('逆向笛卡尔积后：', res);
  }


  main(newcheckSpeList)
  tableData.value = result
})

handleQuery()
handleQueryUnit()
handleQuerycategory()
handleQueryDetail()

// 页面加载时
onMounted(async () => {
});
</script>
<style>
.el-upload-list__item {
  margin: 0 8px 0px 0 !important;
}
</style>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}

.infoCard:not(:first-child) {
  margin-top: 10px;
}

.flex_box {
  display: flex;
  align-items: center;
}

.card_box {
  box-shadow: 0px 0px 2px 0px #46a6ff;
  width: 145px;
  height: 145px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px 0px 0;
}
.card_box_mini {
  box-shadow: 0px 0px 2px 0px #46a6ff;
  width: 90px;
  height: 60px;
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
}
.button_div{
  position:fixed;
  top: 80px;
  right: 10px;
}
</style>(: { id: any; checkSpeValue: any; }): any[]: { id: any; }[](: { id: any; }): any[](: { speValueId: any; })(:
any)
<style>
.cell .flex_box .el-upload--picture-card,.cell .flex_box .el-upload-list__item{
  width: 90px;
  height: 60px;
}
</style>