<template>
	<div class="flcProcure-container">
		<el-dialog v-model="isShowDialog" width="1000" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules"  >
				<el-row :gutter="35" class="no-click-area">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据号" prop="docNumber">
							<el-input v-model="ruleForm.docNumber" :disabled="!ruleForm.id"  placeholder="请输入单据号" maxlength="32" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="供应商" prop="supplierId">
							<el-select clearable filterable v-model="ruleForm.supplierId" placeholder="请选择供应商">
								<el-option v-for="(item, index) in flcSupplierInfoSupplierIdDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购时间" prop="procurementTime">
							<el-date-picker v-model="ruleForm.procurementTime" type="date" placeholder="采购时间" style="width: 378px;"/>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="100" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="总金额" prop="totalAmount">
							<el-input v-model="ruleForm.totalAmount" placeholder="请输入总金额" maxlength="18" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购员" prop="purchaser">
							<el-select clearable filterable v-model="ruleForm.purchaser" placeholder="请选择采购员">
								<el-option v-for="(item, index) in sysUserPurchaserDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state" >
							<el-select clearable v-model="ruleForm.state" disabled placeholder="请选择状态" >
								<el-option v-for="(item, index) in dl('code_procure_state')" :key="index"
									:value="item.code" :label="`[${item.code}] ${item.value}`"></el-option>

							</el-select>

						</el-form-item>

					</el-col> -->
					
				</el-row>
				<el-row :gutter="35">
					<el-table :data="shoppingGoods" border style="width: 100%">
								<el-table-column type="index" width="35"/>
								<el-table-column label="商品名称">
									<template #default="scope">
										<el-text>{{ scope.row.goodsName }}</el-text>
									</template>
								</el-table-column>
								<el-table-column label="规格" show-overflow-tooltip="">
									<template #default="scope">
										<div>
											[<el-text v-for="(item, index) in scope.row.speValueList"
												:key="index">{{ index == 0 ? item.speValue : '/' + item.speValue
												}}</el-text>]
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="unitName" label="单位" width="50"></el-table-column>
								<el-table-column prop="inventoryNum" label="库存量" width="60"></el-table-column>
								<el-table-column prop="purchasePrice" label="采购价"></el-table-column>
								<el-table-column prop="purchaseNum" label="采购数量"></el-table-column>
								<el-table-column  label="本次收到数量" width="120">
									<template #default="scope">
										<el-input-number v-model="scope.row.OneOkNumber" :min="0" size="small"
											controls-position="right"  @change="match_ok_number(scope.row)"/>
									</template>
								</el-table-column>
								<el-table-column prop="noNum" label="未到数量" width="70"></el-table-column>
								<el-table-column prop="okNum" label="已到数量" width="70"></el-table-column>
								<el-table-column prop="totalAmount" label="总金额">
									<template #default="scope">
										<el-text>{{ scope.row.ok_totalAmount?scope.row.ok_totalAmount:scope.row.totalAmount }}</el-text>
									</template>
								</el-table-column>
								<el-table-column prop="remark" label="备注" show-overflow-tooltip=""></el-table-column>
							</el-table>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit" v-if="type==''" >确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<flcGoodsSku ref="flcGoodsSkuRef" @getAddDate="getSpeValTab"  />
	</div>
</template>
<style scoped>
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addFlcProcure, updateFlcProcure, detailFlcProcure } from "/@/api/main/flcProcure";
import { updateFlcProcureDetail,listFlcProcureDetail,inspectionFlcProcureDetail } from "/@/api/main/flcProcureDetail";
import { getFlcSupplierInfoSupplierIdDropdown } from '/@/api/main/flcProcure';
import { getSysUserPurchaserDropdown } from '/@/api/main/flcProcure';
import { getSysUserReviewerDropdown } from '/@/api/main/flcProcure';
import flcGoodsSku from '/@/views/main/flcGoodsSku/index.vue'
import { useUserInfo } from '/@/stores/userInfo';

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
	type:{
		type: String,
		default: "",
	}
});
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
const shoppingGoods = ref<any>([]);
const stores = useUserInfo();
const flcGoodsSkuRef = ref();

//自行添加其他规则
const rules = ref<FormRules>({
	docNumber: [{ required: true, message: '请输入单据号！', trigger: 'blur', },],
	state: [{ required: true, message: '请选择状态！', trigger: 'change', },],
});

// const addValue = (id: any) => {
// 	flcGoodsSkuRef.value.openDialog(id)
// }

// const delValue = (row: any) => {
// 	let data = shoppingGoods.value;
// 	let index = data.indexOf(row);
// 	if (index != -1) {
// 		data.splice(index, 1);
// 	}
// 	shoppingGoods.value = data;
// }

const match_ok_number = (row: any) => {
	row.ok_totalAmount=row.OneOkNumber*row.purchasePrice
	if(!row.oringnoNum){
		row.oringnoNum=row.noNum
	}
	row.noNum=row.oringnoNum-row.OneOkNumber<0?0:row.oringnoNum-row.OneOkNumber
}

//获取新添加规格
const getSpeValTab = () => {
	let data = flcGoodsSkuRef.value.getDate()
	let table = shoppingGoods.value
	data.forEach((item: any) => {
		let add_bool = true
		table.forEach((ele: any) => {
			if (item.id == ele.id) {
				add_bool = false
			}
		})
		if (add_bool) {
			table.push({
				skuId: item.id,
				speValueList: item.speValueList,
				goodsId: item.goodsId,
				goodsName: item.goodsName,
				procureId: ruleForm.value.id,
				unitId: item.unitId,
				unitName: item.unitName,
				purchasePrice: item.costPrice,
				purchaseNum: 0,
				totalAmount: 0,
				okNum:0,
				noNum:0,
				inventoryNum: 0,
				remark: ''
			})
		}
	})
	shoppingGoods.value = table
	console.log(data)
}

// 打开弹窗
const openDialog = async (row: any) => {
	// ruleForm.value = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id){
		ruleForm.value = (await detailFlcProcure(rowData.id)).data.result;
		shoppingGoods.value=(await listFlcProcureDetail(rowData.id)).data.result;
	}	
	else{
		ruleForm.value = rowData;
		shoppingGoods.value=[];
	}
	
	isShowDialog.value = true;
};

// 关闭弹窗
const closeDialog = () => {
	emit("reloadTable");
	isShowDialog.value = false;
};

// 取消
const cancel = () => {
	isShowDialog.value = false;
};

// 提交
const submit = async () => {
	let result= await inspectionFlcProcureDetail(shoppingGoods.value)
	if(result.data.code==200){
		closeDialog();
	}
};
const flcSupplierInfoSupplierIdDropdownList = ref<any>([]);
const getFlcSupplierInfoSupplierIdDropdownList = async () => {
	let list = await getFlcSupplierInfoSupplierIdDropdown();
	flcSupplierInfoSupplierIdDropdownList.value = list.data.result ?? [];
};
getFlcSupplierInfoSupplierIdDropdownList();

const sysUserPurchaserDropdownList = ref<any>([]);
const getSysUserPurchaserDropdownList = async () => {
	let list = await getSysUserPurchaserDropdown();
	sysUserPurchaserDropdownList.value = list.data.result ?? [];
};
getSysUserPurchaserDropdownList();

const sysUserReviewerDropdownList = ref<any>([]);
const getSysUserReviewerDropdownList = async () => {
	let list = await getSysUserReviewerDropdown();
	sysUserReviewerDropdownList.value = list.data.result ?? [];
};
getSysUserReviewerDropdownList();


const handleQuery = () => {

}




// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
<style scoped>
.no-click-area {
  pointer-events: none;
  /* 其他需要的样式 */
}
</style>
