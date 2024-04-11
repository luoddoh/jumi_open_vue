<template>
	<div class="flcInventoryOut-container">
		<el-dialog v-model="isShowDialog" width="1000" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
				<el-row :gutter="35" :class="type!=''?'no-click-area':''">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据号" prop="docNumber">
							<el-input v-model="ruleForm.docNumber" placeholder="请输入单据号" maxlength="45" show-word-limit
								clearable disabled />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="出库类型" prop="outType">
							<el-select clearable v-model="ruleForm.outType" placeholder="请选择出库类型">
								<el-option v-for="(item, index) in dl('code_out_inventory')" :key="index"
									:value="item.code" :label="`[${item.code}] ${item.value}`"></el-option>

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="出库时间" prop="outTime">
							<el-date-picker v-model="ruleForm.outTime" type="date" placeholder="出库时间" style="width: 378px;"/>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="操作员" prop="operator">
							<el-select clearable filterable v-model="ruleForm.operator" placeholder="请选择操作员">
								<el-option v-for="(item, index) in sysUserReviewerDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="订单备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入订单备注" maxlength="200" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-table :data="OutGoods" border style="width: 100%;height: 450px">
								<el-table-column type="index" label="序" width="35"/>
								<el-table-column align="center" v-if="type == ''"  width="70">
									<template #header>
										<el-button size="small" @click="addValue()"
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
								<el-table-column label="成本价">
									<template #default="scope">
										<el-input-number 
											v-model="scope.row.price" :min="0" size="small"
											controls-position="right" @change="match_totalamount(scope.row)" :disabled="type!=''" />
									</template>
								</el-table-column>
								<el-table-column prop="outNum" label="出库数量">
									<template #default="scope">
										<el-input-number v-model="scope.row.outNum" 
											:min="0" :max="scope.row.inventoryNum" size="small"
											controls-position="right" @change="match_totalamount(scope.row)" :disabled="type!=''" />
									</template>
								</el-table-column>
								<el-table-column prop="totalAmount" label="总金额"></el-table-column>
								<el-table-column prop="remark" label="备注" show-overflow-tooltip="">
									<template #default="scope">
										<el-input v-model="scope.row.remark"
											size="small" placeholder="可输入备注" clearable :disabled="type!=''"/>
									</template>
								</el-table-column>

							</el-table>

				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit" v-if="type==''">确 定</el-button>
					<el-button type="primary" @click="submit_examine_ok" v-if="type=='examine_ok'">审核</el-button>
					<el-button type="primary" @click="submit_examine_no" v-if="type=='examine_no'">反审核</el-button>
					<el-button type="primary" @click="submit_out_ok" v-if="type=='out_ok'">确认出库</el-button>
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
import { addFlcInventoryOut, updateFlcInventoryOut, detailFlcInventoryOut,updateFlcInventoryOutDetail,listFlcInventoryOutDetail,examineFlcInventoryOut,confirmFlcInventoryOut } from "/@/api/main/flcInventoryOut";
import { getSysUserReviewerDropdown } from '/@/api/main/flcInventoryOut';
import flcGoodsSku from '/@/views/main/flcGoodsSku/index.vue'
import { useUserInfo } from '/@/stores/userInfo';
import dayjs from 'dayjs';
//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
	type:{
		type:String,
		default:''
	}
});
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
const flcGoodsSkuRef = ref();
const OutGoods=ref<any>([]);
const stores = useUserInfo();

//自行添加其他规则
const rules = ref<FormRules>({
	outType: [{ required: true, message: '请选择出库类型！', trigger: 'change', },],
	outTime: [{ required: true, message: '请选择出库时间！', trigger: 'change', },],
	operator: [{ required: true, message: '请选择操作员！', trigger: 'change', },],
});


const addValue = () => {
	flcGoodsSkuRef.value.openDialog()
}

const delValue = (row: any) => {
	let data = OutGoods.value;
	let index = data.indexOf(row);
	if (index != -1) {
		data.splice(index, 1);
	}
	OutGoods.value = data;
}
const match_totalamount = (row: any) => {
	row.totalAmount = row.price * row.outNum
	procure_amount()
}
const procure_amount = () => {
	let amount = 0;
	OutGoods.value.forEach((item: any) => {
		amount += item.totalAmount
	})
	ruleForm.value.totalAmount = amount
}
//获取新添加规格
const getSpeValTab = () => {
	let data = flcGoodsSkuRef.value.getDate()
	let table = OutGoods.value
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
				outId: ruleForm.value.id,
				unitId: item.unitId,
				unitName: item.unitName,
				price: item.costPrice,
				outNum: 0,
				totalAmount: 0,
				inventoryNum: item.inventoryNum,
				remark: ''
			})
		}
	})
	OutGoods.value = table
}

// 打开弹窗
const openDialog = async (row: any) => {
	// ruleForm.value = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id){
		ruleForm.value = (await detailFlcInventoryOut(rowData.id)).data.result;
		OutGoods.value = (await listFlcInventoryOutDetail(rowData.id)).data.result;
	}	
	else{
		var now = dayjs().format('YYYY/MM/DD');
		ruleForm.value = rowData;
		ruleForm.value.outTime=now
		OutGoods.value=[];
	}
		
	isShowDialog.value = true;
};
const submit_examine_ok= async()=>{
	let obj={
		id:ruleForm.value.id,
		state:101,
		reviewer:stores.userInfos.id
	}
	var result=await examineFlcInventoryOut(obj)
	console.log(result)
	if(result.data.code==200){
		closeDialog();
	}
	
}
const submit_examine_no= async()=>{
	let obj={
		id:ruleForm.value.id,
		state:100,
	}
	var result=await examineFlcInventoryOut(obj)
	if(result.data.code==200){
		closeDialog();
	}
}
const submit_out_ok= async()=>{
	var result=await confirmFlcInventoryOut(ruleForm.value.id)
	if(result.data.code==200){
		closeDialog();
	}
}
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
				let result= await addFlcInventoryOut(values);
				let id=result.data.result;
				OutGoods.value.forEach((row:any)=>{
					row.outId=id
				})
				await updateFlcInventoryOutDetail(OutGoods.value)
			} else {
				await updateFlcInventoryOut(values);
				await updateFlcInventoryOutDetail(OutGoods.value)
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
