﻿<template>
	<div class="flcProcureReturn-container">
		<el-dialog v-model="isShowDialog" width="1000" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules"
				:class="props.type == '' || props.type == 'Reture_ok' ? '' : 'no-click-area'">
				<el-row :gutter="35" :class="props.type == 'Reture_ok' ? 'no-click-area' : ''">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据号" prop="docNumber">
							<el-input v-model="ruleForm.docNumber" placeholder="单据号自动生成" disabled maxlength="32"
								show-word-limit clearable />

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
						<el-form-item label="退货员" prop="returner">
							<el-select clearable filterable v-model="ruleForm.returner" placeholder="请选择退货员">
								<el-option v-for="(item, index) in sysUserReturnerDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="退货时间" prop="returnTime">
							<el-date-picker v-model="ruleForm.returnTime" type="date" placeholder="退货时间" style="width: 378px;"/>

						</el-form-item>

					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核人" prop="reviewer">
							<el-select clearable filterable v-model="ruleForm.reviewer" disabled placeholder="请选择审核人">
								<el-option v-for="(item, index) in sysUserReviewerDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="总价格" prop="totalAmount">
							<el-input v-model="ruleForm.totalAmount" placeholder="请输入总价格" disabled maxlength="18"
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核时间" prop="auditTime">
							<el-date-picker v-model="ruleForm.auditTime" disabled type="date" placeholder="审核时间" />

						</el-form-item>

					</el-col> -->

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="200" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-table :data="ReturnGoods" border style="width: 100%" height="450">
								<el-table-column type="index" label="序号" />
								<el-table-column align="center" v-if="props.type == ''" width="70">
									<template #header >
										<el-button size="small" @click="addValue(ruleForm.id)"
											type="success">添加</el-button>
									</template>
									<template #default="scope">
										<el-button size="small" @click="delValue(scope.row)"
											type="danger">删除</el-button>
									</template>
								</el-table-column>
								<el-table-column label="商品名称">
									<template #default="scope">
										<el-text>{{ scope.row.goodsName }}</el-text>
									</template>
								</el-table-column>
								<el-table-column label="规格" show-overflow-tooltip="">
									<template #default="scope">
										<div>
											[<el-text v-for="(item, index) in scope.row.speValueList" :key="index">{{
			index == 0 ? item.speValue : '/' + item.speValue
		}}</el-text>]
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="unitName" label="单位"></el-table-column>
								<el-table-column prop="inventoryNum" label="库存量"></el-table-column>
								<el-table-column label="退货价">
									<template #default="scope">
										<el-text v-if="props.type == 'Reture_ok'">{{ scope.row.returnPrice }}</el-text>
										<el-input-number v-if="props.type != 'Reture_ok'" v-model="scope.row.returnPrice"
											:min="0" size="small" controls-position="right"
											@change="match_totalamount(scope.row)" />
									</template>
								</el-table-column>
								<el-table-column prop="returnNum" label="退货数量">
									<template #default="scope">
										<el-text v-if="props.type == 'Reture_ok'">{{ scope.row.returnNum }}</el-text>
										<el-input-number v-model="scope.row.returnNum" v-if="props.type != 'Reture_ok'"
											:min="0" :max="scope.row.inventoryNum" size="small"
											controls-position="right" @change="match_totalamount(scope.row)" />
									</template>
								</el-table-column>
								<el-table-column prop="totalAmount" label="总金额"></el-table-column>
								<el-table-column prop="remark" label="备注">
									<template #default="scope">
										<el-text v-if="props.type == 'Reture_ok'">{{ scope.row.remark }}</el-text>
										<el-input v-if="props.type != 'Reture_ok'" v-model="scope.row.remark" size="small"
											placeholder="可输入备注" clearable />
									</template>
								</el-table-column>

							</el-table>

				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit" v-if="type == ''">确 定</el-button>
					<el-button type="primary" @click="submit_examine_ok" v-if="type == 'examine_ok'">审核</el-button>
					<el-button type="primary" @click="submit_examine_no" v-if="type == 'examine_no'">反审核</el-button>
					<el-button type="primary" @click="submit_Reture_ok" v-if="type == 'Reture_ok'">确认退货</el-button>
				</span>
			</template>
		</el-dialog>
		<flcGoodsSku ref="flcGoodsSkuRef" :type="'procureReturn'" @getAddDate="getSpeValTab" />
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
import { addFlcProcureReturn, updateFlcProcureReturn, detailFlcProcureReturn, listFlcProcureReturnDetail, updateFlcProcureReturnDetail, examineFlcProcureReturn ,confirmFlcProcureReturn} from "/@/api/main/flcProcureReturn";
import { getSysUserReturnerDropdown } from '/@/api/main/flcProcureReturn';
import { getSysUserReviewerDropdown } from '/@/api/main/flcProcureReturn';
import { getFlcSupplierInfoSupplierIdDropdown } from '/@/api/main/flcProcureReturn';
import flcGoodsSku from '/@/views/main/flcGoodsSku/index.vue'
import { useUserInfo } from '/@/stores/userInfo';
import dayjs from 'dayjs';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "",
	}
});
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
//自行添加其他规则
const rules = ref<FormRules>({
	returnTime: [{ required: true, message: '请选择退货时间！', trigger: 'change', },],
	returner: [{ required: true, message: '请选择退货员！', trigger: 'change', },],
	supplierId: [{ required: true, message: '请选择供应商！', trigger: 'change', },],
});
const ReturnGoods = ref<any>([]);
const stores = useUserInfo();
const flcGoodsSkuRef = ref();

const addValue = (id: any) => {
	flcGoodsSkuRef.value.openDialog(id)
}

const delValue = (row: any) => {
	let data = ReturnGoods.value;
	let index = data.indexOf(row);
	if (index != -1) {
		data.splice(index, 1);
	}
	ReturnGoods.value = data;
}
const match_totalamount = (row: any) => {
	row.totalAmount = row.returnPrice * row.returnNum
	procure_amount()
}
const procure_amount = () => {
	let amount = 0;
	ReturnGoods.value.forEach((item: any) => {
		amount += item.totalAmount
	})
	ruleForm.value.totalAmount = amount
}
//获取新添加规格
const getSpeValTab = () => {
	let data = flcGoodsSkuRef.value.getDate()
	let table = ReturnGoods.value
	data.forEach((item: any) => {
		let add_bool = true
		table.forEach((ele: any) => {
			if (item.id == ele.skuId) {
				add_bool = false
			}
		})
		if (add_bool) {
			table.push({
				skuId: item.id,
				speValueList: item.speValueList,
				goodsId: item.goodsId,
				goodsName: item.goodsName,
				returnId: ruleForm.value.id,
				unitId: item.unitId,
				unitName: item.unitName,
				returnPrice: item.costPrice,
				returnNum: 0,
				totalAmount: 0,
				inventoryNum: item.inventoryNum,
				remark: ''
			})
		}
	})
	ReturnGoods.value = table
}


// 打开弹窗
const openDialog = async (row: any) => {
	// ruleForm.value = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id) {
		ReturnGoods.value = (await listFlcProcureReturnDetail(rowData.id)).data.result;
		ruleForm.value = (await detailFlcProcureReturn(rowData.id)).data.result;
	}
	else {
		var now = dayjs().format('YYYY/MM/DD');
		ruleForm.value = rowData;
		ruleForm.value.returnTime=now
		ReturnGoods.value=[];
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
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
				let result= await addFlcProcureReturn(values);
				let id=result.data.result;
				ReturnGoods.value.forEach((row:any)=>{
					row.returnId=id
				})
				await updateFlcProcureReturnDetail(ReturnGoods.value)
			} else {
				await updateFlcProcureReturn(values);
				await updateFlcProcureReturnDetail(ReturnGoods.value)
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
const submit_examine_ok = async () => {
	let obj={
		id:ruleForm.value.id,
		state:200,
		reviewer:stores.userInfos.id
	}
	var result = await examineFlcProcureReturn(obj)
	console.log(result)
	if (result.data.code == 200) {
		closeDialog();
	}

}
const submit_examine_no = async () => {
	let obj={
		id:ruleForm.value.id,
		state:100,
	}
	var result = await examineFlcProcureReturn(obj)
	if (result.data.code == 200) {
		closeDialog();
	}
}
const submit_Reture_ok = async () => {
	let id = ruleForm.value.id;
	var result = await confirmFlcProcureReturn(id)
	if (result.data.code == 200) {
		closeDialog();
	}
}


const flcSupplierInfoSupplierIdDropdownList = ref<any>([]);
const getFlcSupplierInfoSupplierIdDropdownList = async () => {
	let list = await getFlcSupplierInfoSupplierIdDropdown();
	flcSupplierInfoSupplierIdDropdownList.value = list.data.result ?? [];
};
getFlcSupplierInfoSupplierIdDropdownList();

const sysUserReturnerDropdownList = ref<any>([]);
const getSysUserReturnerDropdownList = async () => {
	let list = await getSysUserReturnerDropdown();
	sysUserReturnerDropdownList.value = list.data.result ?? [];
};
getSysUserReturnerDropdownList();

const sysUserReviewerDropdownList = ref<any>([]);
const getSysUserReviewerDropdownList = async () => {
	let list = await getSysUserReviewerDropdown();
	sysUserReviewerDropdownList.value = list.data.result ?? [];
};
getSysUserReviewerDropdownList();







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
