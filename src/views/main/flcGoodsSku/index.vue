<template>
  <div class="flcGoodsSku-container">
    <el-dialog v-model="isShowDialog" width="1000" style="height: 700px;" draggable="">
      <template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>商品规格列表</span>
				</div>
			</template>
      <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
        <el-form :model="queryParams" ref="queryForm" labelWidth="90">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb10">
              <el-form-item label="关键字">
                <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入模糊查询关键字" />

              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb10" v-if="showAdvanceQueryUI">
              <el-form-item label="条码">
                <el-input v-model="queryParams.barCode" clearable="" placeholder="请输入条码" />

              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
              <el-form-item>
                <el-button-group style="display: flex; align-items: center;">
                  <!-- <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI"
                    style="margin-left:5px;"> 高级查询 </el-button>
                  <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI"
                    style="margin-left:5px;"> 隐藏 </el-button> -->
                    <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                    <el-button icon="ele-Search" @click="handleQuery" > 查询</el-button>
                </el-button-group>
              </el-form-item>

            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="full-table" shadow="hover" style="margin-top: 5px">
        <el-table :data="tableData" style="width: 100%;"height="440"  v-loading="loading" tooltip-effect="light" row-key="id"
          @selection-change="handleSelectionChange" :reserve-selection="true" border>
          <el-table-column type="selection" width="30"  />
            <el-table-column prop="coverImage" label="sku封面" width="60" show-overflow-tooltip="" >
            <template #default="scope">
              <el-image :src="scope.row.coverImage" width="80" height="80"/>
            </template>
            </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width="160" show-overflow-tooltip="" />
            <el-table-column label="规格"  show-overflow-tooltip="">
									<template #default="scope">
										<div>
											[<el-text v-for="(item, index) in scope.row.speValueList"
												:key="index">{{ index == 0 ? item.speValue : '/' + item.speValue
												}}</el-text>]
										</div>
									</template>
								</el-table-column>
          <el-table-column prop="barCode" label="条码" width="140" show-overflow-tooltip="" />
          <el-table-column prop="inventoryNum" label="库存" width="80" show-overflow-tooltip="" />
          <el-table-column prop="unitName" label="单位" width="60" show-overflow-tooltip="" />
          <el-table-column prop="costPrice" label="成本价" width="70" show-overflow-tooltip="" />
          <el-table-column prop="salesPrice" label="销售价" width="70" show-overflow-tooltip="" />
          <!-- <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip=""
            v-if="auth('flcGoodsSku:update') || auth('flcGoodsSku:delete')">
            <template #default="scope">
              <el-button icon="ele-Edit" size="small" text="" type="primary" @click="checkOk" > 选择 </el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
          :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper" />
      </el-card>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup="" name="flcGoodsSku">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { formatDate } from '/@/utils/formatTime';


import { pageFlcGoodsSku } from '/@/api/main/flcGoodsSku';

//父级传递来的参数
var props = defineProps({
		id: {
		type: Number,
		default: 0,
	},
  type:{
    type:String,
    default:'procure'
  }
	});
	//父级传递来的函数，用于回调
	const emit = defineEmits(["getAddDate"]);
const showAdvanceQueryUI = ref(true);
const isShowDialog = ref(false);
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const multipleSelection=ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 50,
  total: 0,
});
const seleReturn=(row:any)=>{
  if(!row.inventoryNum){
    return false
  }else{
    return true
  }
}
// 关闭弹窗
const closeDialog = () => {
		isShowDialog.value = false;
	};

// 取消
const cancel = () => {
		isShowDialog.value = false;
	};

// 打开弹窗
const openDialog = async () => {
    handleQuery();
		isShowDialog.value = true;
	};

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageFlcGoodsSku(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

// 列排序
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
};

const checkOk=()=>{
  let value=props.id;
  console.log(value)
}
//提交
const submit=()=>{

  if(multipleSelection.value.length==0){
    ElMessage.error('请选择规格！')
    return
  }else{
    emit("getAddDate");
    closeDialog()
  }

}
const getDate=()=>{
  return multipleSelection.value
}

// 改变页面容量
const handleSizeChange = (val: number) => {
  tableParams.value.pageSize = val;
  handleQuery();
};

// 改变页码序号
const handleCurrentChange = (val: number) => {
  tableParams.value.page = val;
  handleQuery();
};




	//将属性或者函数暴露给父组件
	defineExpose({ openDialog,getDate });
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
