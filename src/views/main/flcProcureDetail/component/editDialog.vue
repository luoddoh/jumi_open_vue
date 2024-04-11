<template>
	<div class="flcProcureDetail-container">
		<el-dialog v-model="isShowDialog" :width="800" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购订单Id" prop="procureId">
							<el-select clearable filterable v-model="ruleForm.procureId" placeholder="请选择采购订单Id">
								<el-option v-for="(item,index) in flcProcureProcureIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select>
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品Id" prop="goodsId">
							<el-select clearable filterable v-model="ruleForm.goodsId" placeholder="请选择商品Id">
								<el-option v-for="(item,index) in flcGoodsGoodsIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select>
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="商品sku" prop="skuId">
							<el-select clearable filterable v-model="ruleForm.skuId" placeholder="请选择商品sku">
								<el-option v-for="(item,index) in flcGoodsSkuSkuIdDropdownList" :key="index" :value="item.value" :label="item.label" />
								
							</el-select>
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="库存量" prop="inventoryNum">
							<el-input-number v-model="ruleForm.inventoryNum" placeholder="请输入库存量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购价" prop="purchasePrice">
							<el-input v-model="ruleForm.purchasePrice" placeholder="请输入采购价" maxlength="18" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购数量" prop="purchaseNum">
							<el-input-number v-model="ruleForm.purchaseNum" placeholder="请输入采购数量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="未到数量" prop="okNum">
							<el-input-number v-model="ruleForm.okNum" placeholder="请输入未到数量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="已到数量" prop="noNum">
							<el-input-number v-model="ruleForm.noNum" placeholder="请输入已到数量" clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="总金额" prop="totalAmount">
							<el-input v-model="ruleForm.totalAmount" placeholder="请输入总金额" maxlength="18" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="200" show-word-limit clearable />
							
						</el-form-item>
						
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<style scoped>
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>
<script lang="ts" setup>
	import { ref,onMounted } from "vue";
	import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
	import { ElMessage } from "element-plus";
	import type { FormRules } from "element-plus";
	import { addFlcProcureDetail, updateFlcProcureDetail, detailFlcProcureDetail } from "/@/api/main/flcProcureDetail";
	import { getFlcProcureProcureIdDropdown } from '/@/api/main/flcProcureDetail';
	import { getFlcGoodsGoodsIdDropdown } from '/@/api/main/flcProcureDetail';
	import { getFlcGoodsSkuSkuIdDropdown } from '/@/api/main/flcProcureDetail';

	//父级传递来的参数
	var props = defineProps({
		title: {
		type: String,
		default: "",
	},
	});
	//父级传递来的函数，用于回调
	const emit = defineEmits(["reloadTable"]);
	const ruleFormRef = ref();
	const isShowDialog = ref(false);
	const ruleForm = ref<any>({});
	//自行添加其他规则
	const rules = ref<FormRules>({
		purchasePrice: [{required: true, message: '请输入采购价！', trigger: 'blur',},],
		purchaseNum: [{required: true, message: '请输入采购数量！', trigger: 'blur',},],
		okNum: [{required: true, message: '请输入未到数量！', trigger: 'blur',},],
		noNum: [{required: true, message: '请输入已到数量！', trigger: 'blur',},],
		totalAmount: [{required: true, message: '请输入总金额！', trigger: 'blur',},],
	});

	// 打开弹窗
	const openDialog = async (row: any) => {
		// ruleForm.value = JSON.parse(JSON.stringify(row));
		// 改用detail获取最新数据来编辑
		let rowData = JSON.parse(JSON.stringify(row));
		if (rowData.id)
			ruleForm.value = (await detailFlcProcureDetail(rowData.id)).data.result;
		else
			ruleForm.value = rowData;
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
		ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
			if (isValid) {
				let values = ruleForm.value;
				if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
					await addFlcProcureDetail(values);
				} else {
					await updateFlcProcureDetail(values);
				}
				closeDialog();
			} else {
				ElMessage({
					message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
					type: "error",
				});
			}
		});
	};

	const flcProcureProcureIdDropdownList = ref<any>([]); 
	const getFlcProcureProcureIdDropdownList = async () => {
		let list = await getFlcProcureProcureIdDropdown();
		flcProcureProcureIdDropdownList.value = list.data.result ?? [];
	};
	getFlcProcureProcureIdDropdownList();
	
	const flcGoodsGoodsIdDropdownList = ref<any>([]); 
	const getFlcGoodsGoodsIdDropdownList = async () => {
		let list = await getFlcGoodsGoodsIdDropdown();
		flcGoodsGoodsIdDropdownList.value = list.data.result ?? [];
	};
	getFlcGoodsGoodsIdDropdownList();
	
	const flcGoodsSkuSkuIdDropdownList = ref<any>([]); 
	const getFlcGoodsSkuSkuIdDropdownList = async () => {
		let list = await getFlcGoodsSkuSkuIdDropdown();
		flcGoodsSkuSkuIdDropdownList.value = list.data.result ?? [];
	};
	getFlcGoodsSkuSkuIdDropdownList();
	






	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>




