<template>
	<div class="flcInventoryCheck-container">
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
							<el-input v-model="ruleForm.docNumber" placeholder="单据号提交时自动生成" maxlength="45" disabled
								show-word-limit clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state">
							<el-select clearable v-model="ruleForm.state" placeholder="状态随流程自动改变" disabled>
								<el-option v-for="(item, index) in dl('code_check_inventory')" :key="index"
									:value="item.code" :label="`[${item.code}] ${item.value}`"></el-option>

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="盘点人" prop="checkPeople">
							<el-select clearable filterable v-model="ruleForm.checkPeople" placeholder="请选择盘点人">
								<el-option v-for="(item, index) in sysUserCheckPeopleDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="盘点时间" prop="checkTime">
							<el-date-picker v-model="ruleForm.checkTime" type="date" placeholder="盘点时间" style="width: 378px;"/>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="ruleForm.remark" placeholder="请输入备注" maxlength="200" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-table :data="CheckGoods" border style="width: 100% " height="450">
								<el-table-column type="index" label="序" width="35"/>
								<el-table-column align="center" v-if="type == ''" width="70">
									<template #header>
										<el-button size="small" @click="addValue()" type="success">添加</el-button>
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
										<el-input-number v-model="scope.row.price" :min="0" size="small"
											controls-position="right" @change="match_totalamount(scope.row)"
											:disabled="type != ''" />
									</template>
								</el-table-column>
								<el-table-column prop="checkNum" label="盘点数量">
									<template #default="scope">
										<el-input-number v-model="scope.row.checkNum" :min="0" size="small" controls-position="right"
											@change="match_totalamount(scope.row)" :disabled="type != ''" />
									</template>
								</el-table-column>
								<el-table-column prop="totalAmount" label="总金额"></el-table-column>
								<el-table-column prop="differenceNum" label="差异数量"></el-table-column>
								<el-table-column prop="differencePrice" label="差异金额"></el-table-column>
								<el-table-column prop="remark" label="备注">
									<template #default="scope">
										<el-input v-model="scope.row.remark" size="small" placeholder="可输入备注" clearable
											:disabled="type != ''" />
									</template>
								</el-table-column>

							</el-table>

				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit" v-if="type==''" >确 定</el-button>
					<el-button type="primary" @click="submit_examine_ok" v-if="type=='examine_ok'">审核</el-button>
					<el-button type="primary" @click="submit_examine_no" v-if="type=='examine_no'">反审核</el-button>
					<el-button type="primary" @click="submit_check_ok" v-if="type=='check_ok'">确认盘点</el-button>
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
import { addFlcInventoryCheck, updateFlcInventoryCheck, detailFlcInventoryCheck,listFlcInventoryCheckDetail,confirmFlcInventoryCheck,examineFlcInventoryCheck,updateFlcInventoryOutDetail } from "/@/api/main/flcInventoryCheck";
import { getSysUserCheckPeopleDropdown } from '/@/api/main/flcInventoryCheck';
import { getSysUserReviewerDropdown } from '/@/api/main/flcInventoryCheck';
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
const CheckGoods = ref<any>([]);
const stores = useUserInfo();
const flcGoodsSkuRef = ref();
//自行添加其他规则
const rules = ref<FormRules>({
	checkPeople: [{ required: true, message: '请选择盘点人', trigger: 'change', }],
	checkTime: [{ required: true, message: '请选择盘点时间！', trigger: 'change', },],
});
const addValue = () => {
	flcGoodsSkuRef.value.openDialog()
}

const delValue = (row: any) => {
	let data = CheckGoods.value;
	let index = data.indexOf(row);
	if (index != -1) {
		data.splice(index, 1);
	}
	CheckGoods.value = data;
}
const match_totalamount = (row: any) => {
	row.totalAmount = row.price * row.checkNum
	row.differenceNum=row.checkNum-row.inventoryNum
	row.differencePrice=row.price*(row.differenceNum)
	procure_amount()
}
const procure_amount = () => {
	let amount = 0;
	CheckGoods.value.forEach((item: any) => {
		amount += item.totalAmount
	})
	ruleForm.value.totalAmount = amount
}
//获取新添加规格
const getSpeValTab = () => {
	let data = flcGoodsSkuRef.value.getDate()
	let table = CheckGoods.value
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
				checkId: ruleForm.value.id,
				unitId: item.unitId,
				unitName: item.unitName,
				price: item.costPrice,
				checkNum: 0,
				totalAmount: 0,
				inventoryNum: item.inventoryNum,
				remark: ''
			})
		}
	})
	CheckGoods.value = table
}
const submit_examine_ok= async()=>{
	let obj={
		id:ruleForm.value.id,
		state:101,
		reviewer:stores.userInfos.id
	}
	var result=await examineFlcInventoryCheck(obj)
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
	var result=await examineFlcInventoryCheck(obj)
	if(result.data.code==200){
		closeDialog();
	}
}
const submit_check_ok= async()=>{
	var result=await confirmFlcInventoryCheck(ruleForm.value.id)
	if(result.data.code==200){
		closeDialog();
	}
}
// 打开弹窗
const openDialog = async (row: any) => {
	// ruleForm.value = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id){
		ruleForm.value = (await detailFlcInventoryCheck(rowData.id)).data.result;
		CheckGoods.value = (await listFlcInventoryCheckDetail(rowData.id)).data.result;
	}	
	else{
		var now = dayjs().format('YYYY/MM/DD');
		ruleForm.value = rowData;
		ruleForm.value.checkTime=now;
		CheckGoods.value=[];
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
				let result= await addFlcInventoryCheck(values);
				let id=result.data.result;
				CheckGoods.value.forEach((row:any)=>{
					row.checkId=id
				})
				await updateFlcInventoryOutDetail(CheckGoods.value)
			} else {
				await updateFlcInventoryCheck(values);
				await updateFlcInventoryOutDetail(CheckGoods.value)
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

const sysUserCheckPeopleDropdownList = ref<any>([]);
const getSysUserCheckPeopleDropdownList = async () => {
	let list = await getSysUserCheckPeopleDropdown();
	sysUserCheckPeopleDropdownList.value = list.data.result ?? [];
};
getSysUserCheckPeopleDropdownList();

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

