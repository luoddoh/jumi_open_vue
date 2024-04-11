<template>
    <el-dialog v-model="dialogVisible" title="上传表格" width="1200">
        <el-row>
            <el-col :span="24">
                <el-upload  class="upload-demo" drag
                    action="/api/flcGoods/excel"
                    :http-request="upload"
                    multiple>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖拽文件或 <em>点击上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            xls/xlsx 文件 
                        </div>
                    </template>
                </el-upload>
                <div style="height: 300px;">
                    <el-popover
                        placement="right"
                        :width="1000"
                        trigger="click">
                        <template #reference>
                            <el-button type="primary" text>总数据</el-button>
                        </template>
                        <el-table :data="allData" max-height="500">
                            <el-table-column  v-for="(item,index) in all_head" :key="index" :property="item.label" :label="item.title" />
                        </el-table>
                    </el-popover>
                    
                </div>
            </el-col>
        </el-row>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    仅保存数据
                </el-button>
                <!-- <el-button type="primary" @click="dialogVisible = false">
                    保存数据并且保存文件
                </el-button> -->
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup name="excelUpload">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { UploadFilled } from '@element-plus/icons-vue'
import {uploadExcelFile,dateSaveExcelFile} from './excelUpload'
// import { getAPI } from '/@/utils/axios-utils';
// import { SysFileApi } from '/@/api-services/api';

const dialogVisible = ref<any>(false);
const allData=ref<any>([])
const speDate=ref<any>([])

const all_head=ref<any>([
    {
        title:'行号',
        label:'index'
    },
    {
        title:'一级分类',
        label:'oneClass'
    },
    {
        title:'二级分类',
        label:'TwoClass'
    },
    {
        title:'三级分类',
        label:'ThreeClass'
    },
    {
        title:'商品全名',
        label:'GoodsName'
    },
    {
        title:'条码',
        label:'BarCard'
    },
    {
        title:'SKU编号',
        label:'SkuCode'
    },
    {
        title:'重量(kg)',
        label:'weight'
    },
    {
        title:'产地',
        label:'Producer'
    },
    {
        title:'零售价',
        label:'RetailPrice'
    },
    {
        title:'参考成本价',
        label:'costPrice'
    },
    {
        title:'基本单位',
        label:'Unit'
    },
    {
        title:'说明',
        label:'PrintCustom'
    },
])





const upload=async (option:any)=>{
    let formDate=new FormData();
    formDate.append('file',option.file)
   let result=await uploadExcelFile(formDate)
   allData.value=result.data.result.tabelDate
   speDate.value=result.data.result.speVal
   console.log(result.data.result)
}
const save=async()=>{
    let obj={
        table:allData.value,
        speVals:speDate.value
    }
    let result=await dateSaveExcelFile(obj)
    if(result.data?.code==200){
        ElMessage.success('保存成功！')
        dialogVisible.value = false
    }
}
const openDialog = () => {
    dialogVisible.value = true
}
defineExpose({ openDialog });
</script>
<style scoped></style>