<template>
	<div class="flcProcure-container">
		<el-dialog v-model="isShowDialog" width="1000" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules" >
				<el-row :gutter="35" :class=" props.type!='edit'?'no-click-area':''">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单据号" prop="docNumber">
							<el-input v-model="ruleForm.docNumber" disabled  placeholder="请输入单据号" maxlength="32" show-word-limit
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
						<el-form-item label="采购员" prop="purchaser">
							<el-select clearable filterable v-model="ruleForm.purchaser" placeholder="请选择采购员">
								<el-option v-for="(item, index) in sysUserPurchaserDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="采购时间" prop="procurementTime">
							<el-date-picker v-model="ruleForm.procurementTime" value-format="YYYY/MM/DD"  type="date" placeholder="采购时间"  style="width: 378px;"/>

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
					
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核人" prop="reviewer">
							<el-select clearable filterable v-model="ruleForm.reviewer" disabled  placeholder="审核后自动生成">
								<el-option v-for="(item, index) in sysUserReviewerDropdownList" :key="index"
									:value="item.value" :label="item.label" />

							</el-select>

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态" prop="state" >
							<el-select clearable v-model="ruleForm.state" disabled placeholder="请选择状态" >
								<el-option v-for="(item, index) in dl('code_procure_state')" :key="index"
									:value="item.code" :label="`[${item.code}] ${item.value}`"></el-option>

							</el-select>

						</el-form-item>

					</el-col>
					
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="审核时间" prop="auditTime">
							<el-date-picker v-model="ruleForm.auditTime" disabled type="date" placeholder="审核时间" />

						</el-form-item>

					</el-col> -->
				</el-row>
				<el-row :gutter="35" v-if="props.type!='Print'" :class=" props.type!='edit'?'no-click-area':''">
					<el-table :data="shoppingGoods" border style="width: 100% " height="450">
								<el-table-column type="index" width="35" />
								<el-table-column align="center" width="70">
									<template #header>
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
											[<el-text v-for="(item, index) in scope.row.speValueList"
												:key="index">{{ index == 0 ? item.speValue : '/' + item.speValue
												}}</el-text>]
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="unitName" label="单位" width="50"></el-table-column>
								<el-table-column prop="inventoryNum" label="库存量"></el-table-column>
								<el-table-column label="采购价">
									<template #default="scope">
										<el-input-number v-model="scope.row.purchasePrice" :min="0" size="small"
											controls-position="right" @change="match_totalamount(scope.row)" />
									</template>
								</el-table-column>
								<el-table-column prop="purchaseNum" label="采购数量">
									<template #default="scope">
										<el-input-number v-model="scope.row.purchaseNum" :min="0" size="small"
											controls-position="right"  @change="match_totalamount(scope.row)"/>
									</template>
								</el-table-column>
								<el-table-column prop="noNum" label="未到数量" width="70"></el-table-column>
								<el-table-column prop="okNum" label="已到数量" width="70"></el-table-column>
								<el-table-column prop="totalAmount" label="总金额"></el-table-column>
								<el-table-column prop="remark" label="备注">
									<template #default="scope">
									<el-input v-model="scope.row.remark" size="small" placeholder="可输入备注"
										clearable />
									</template>
								</el-table-column>
							</el-table>

				</el-row>
				<el-row :gutter="35" v-if="props.type=='Print'" >
					<el-table :data="shoppingGoods" border style="width: 100%">
								<el-table-column type="index" width="35"/>
								<el-table-column prop="goodsName"  label="商品名称"></el-table-column>
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
								<el-table-column prop="inventoryNum" label="库存量"></el-table-column>
								<el-table-column prop="purchasePrice" label="采购价"></el-table-column>
								<el-table-column prop="purchaseNum" label="采购数量"></el-table-column>
								<el-table-column prop="noNum" label="未到数量"></el-table-column>
								<el-table-column prop="okNum" label="已到数量"></el-table-column>
								<el-table-column prop="totalAmount" label="总金额"></el-table-column>
								<el-table-column prop="remark" label="备注"></el-table-column>
								<el-table-column prop="printNum" label="打印次数"  width="70"></el-table-column>
								<el-table-column width="100" >
									<template #header>
										<el-button icon="ele-Printer" size="small" text="" type="primary" @click="openAll"> 全部打印 </el-button>
									</template>
									<template #default="scope">
										<el-button icon="ele-Printer" size="small" text="" type="primary" @click="open(scope.row)"> 打印 </el-button>
									</template>
								</el-table-column>
							</el-table>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancel">取 消</el-button>
					<el-button type="primary" @click="submit" v-if="type=='edit'">确 定</el-button>
					<el-button type="primary" @click="submit_examine_ok" v-if="type=='examine_ok'">审核</el-button>
					<el-button type="primary" @click="submit_examine_no" v-if="type=='examine_no'">反审核</el-button>
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
import { ElMessage,ElMessageBox } from "element-plus";
import type { FormRules } from "element-plus";
import { addFlcProcure, updateFlcProcure, detailFlcProcure,examineFlcProcure } from "/@/api/main/flcProcure";
import { updateFlcProcureDetail,listFlcProcureDetail,printFlcProcureDetail } from "/@/api/main/flcProcureDetail";
import { getFlcSupplierInfoSupplierIdDropdown } from '/@/api/main/flcProcure';
import { getSysUserPurchaserDropdown } from '/@/api/main/flcProcure';
import { getSysUserReviewerDropdown } from '/@/api/main/flcProcure';
import flcGoodsSku from '/@/views/main/flcGoodsSku/index.vue'
import { useUserInfo } from '/@/stores/userInfo';

import { getAPI } from '/@/utils/axios-utils';
  import { hiprint } from 'vue-plugin-hiprint';
  import { SysPrintApi } from '/@/api-services/api';
  import { SysPrint } from '/@/api-services/models';
  import dayjs from 'dayjs';

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
	type:{
		type:String,
		default:"edit"
	}
});
var now = dayjs().format('YYYY/MM/DD');
//父级传递来的函数，用于回调
const emit = defineEmits(["reloadTable"]);
const ruleFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});
const shoppingGoods = ref<any>([]);
const stores = useUserInfo();
const flcGoodsSkuRef = ref();


  // 打开打印页面
  const openPrintFlcProcure = async (row: any,num:any) => {
  var res = await getAPI(SysPrintApi).apiSysPrintPrintNameGet('条码');
  var printTemplate = res.data.result as SysPrint;
  var template = JSON.parse(printTemplate.template);
  let arr:any[]=[]
  let sup=getSupplier(ruleForm.value.supplierId)
  
  var barCodeList=JSON.parse(row.barCodeList)
  let spe=''
	row.speValueList.forEach((item:any)=>{
		if(spe==''){
			spe+=item.speValue
		}else{
			spe+='/'+item.speValue
		}
	})
  if(num>=barCodeList.length){
	let mo=num%barCodeList.length
	let for_num=num/barCodeList.length
	for(let i=0;i<for_num;i++){
		for(let j=0;j<barCodeList.length;j++){
			
			let print_one={
				name:row.goodsName+"["+spe+"]",
				type:'测试',
				code:barCodeList[j],
				imageUrl:'https://kc.qianxingwl.com/Upload/2024/04/09/3c.png',
				printCustom:row.printCustom,
				supplier:sup
			}
			arr.push(print_one)
		}
		if(i==for_num-1&&mo>0){
			for(let j=0;j<mo;j++){
				let print_one={
				name:row.goodsName+"["+spe+"]",
				type:'测试',
				code:barCodeList[j],
				imageUrl:'https://kc.qianxingwl.com/Upload/2024/04/09/3c.png',
				printCustom:row.printCustom,
				supplier:sup
			}
			arr.push(print_one)
			}
		}
	}
  }else{
	for(let i=0;i<num;i++){
		let index= Math.ceil(Math.random()*barCodeList.length)
		let print_one={
				name:row.goodsName+"["+spe+"]",
				type:'测试',
				code:barCodeList[index],
				imageUrl:'https://kc.qianxingwl.com/Upload/2024/04/09/3c.png',
				printCustom:row.printCustom,
				supplier:sup
			}
			arr.push(print_one)
	}
  }
  var print_tem=new hiprint.PrintTemplate({ template: template });
  let print_ok=false
  print_tem.print(arr,{},{
	callback:async ()=>{
		if(!print_ok){
			console.log('浏览器打印窗口已打开')
			await printFlcProcureDetail(row.id,arr.length);
			shoppingGoods.value=(await listFlcProcureDetail(ruleForm.value.id)).data.result;
			print_ok=true
		}
	}
  })
}
const open=(row:any)=>{
	ElMessageBox.prompt('请输入需要打印的数量', '提升', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern:/^[0-9]*$/,
    inputErrorMessage: '请输入正确的数量',
	inputValue:row.purchaseNum
  })
    .then(({ value }) => {
		openPrintFlcProcure(row,value)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
const openAll=async()=>{
  var res = await getAPI(SysPrintApi).apiSysPrintPrintNameGet('条码');
  var printTemplate = res.data.result as SysPrint;
  var template = JSON.parse(printTemplate.template);
  let arr:any[]=[]
  let sup=getSupplier(ruleForm.value.supplierId)
  let table=shoppingGoods.value;
  for(let o=0;o<table.length;o++){
	let row=table[o];
	var barCodeList=JSON.parse(row.barCodeList)
	let spe=''
		row.speValueList.forEach((item:any)=>{
			if(spe==''){
				spe+=item.speValue
			}else{
				spe+='/'+item.speValue
			}
		})
	for(let i=0;i<row.purchaseNum;i++){
		let index= Math.ceil(Math.random()*barCodeList.length)
		let print_one={
				name:row.goodsName+"["+spe+"]",
				type:'测试',
				code:barCodeList[index],
				imageUrl:'https://kc.qianxingwl.com/Upload/2024/04/09/3c.png',
				printCustom:row.printCustom,
				supplier:sup
			}
		arr.push(print_one)
	}
  }
  var print_tem=new hiprint.PrintTemplate({ template: template });
  let print_ok=false
  print_tem.print(arr,{},{
	callback:async ()=>{
		if(!print_ok){
			console.log('浏览器打印窗口已打开')
			for(let o=0;o<table.length;o++){
				let row=table[o];
				await printFlcProcureDetail(row.id,row.purchaseNum);
			}
			shoppingGoods.value=(await listFlcProcureDetail(ruleForm.value.id)).data.result;
			print_ok=true
		}
	}
  })
}

//自行添加其他规则
const rules = ref<FormRules>({
	procurementTime: [{ required: true, message: '请选择采购时间！', trigger: 'change', },],
	purchaser: [{ required: true, message: '请选择采购员！', trigger: 'change', },],
	supplierId: [{ required: true, message: '请选择供应商！', trigger: 'change', },],
});

const addValue = (id: any) => {
	flcGoodsSkuRef.value.openDialog(id)
}

const delValue = (row: any) => {
	let data = shoppingGoods.value;
	let index = data.indexOf(row);
	if (index != -1) {
		data.splice(index, 1);
	}
	shoppingGoods.value = data;
}

const match_totalamount = (row: any) => {
	row.totalAmount=row.purchasePrice*row.purchaseNum
	row.noNum=row.purchaseNum
	procure_amount()
}
const procure_amount=()=>{
	let amount=0;
	shoppingGoods.value.forEach((item:any)=>{
		amount+=item.totalAmount
	})
	ruleForm.value.totalAmount=amount
}
//获取新添加规格
const getSpeValTab = () => {
	let data = flcGoodsSkuRef.value.getDate()
	let table = shoppingGoods.value
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
const getSupplier=(id:any)=>{
	let data=flcSupplierInfoSupplierIdDropdownList.value
	console.log(data)
	for(let i=0;i<data.length;i++){
		if(id==data[i].value){
			return data[i].label
		}
	}
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
		ruleForm.value.procurementTime=now
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
	ruleFormRef.value.validate(async (isValid: boolean, fields?: any) => {
		if (isValid) {
			let values = ruleForm.value;
			if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
				let result= await addFlcProcure(values);
				let id=result.data.result;
				shoppingGoods.value.forEach((row:any)=>{
					row.procureId=id
				})
				await updateFlcProcureDetail(shoppingGoods.value)
			} else {
				await updateFlcProcure(values);
				await updateFlcProcureDetail(shoppingGoods.value)
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

const submit_examine_ok= async()=>{
	let obj={
		id:ruleForm.value.id,
		state:200,
		reviewer:stores.userInfos.id
	}
	var result=await examineFlcProcure(obj)
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
	var result=await examineFlcProcure(obj)
	if(result.data.code==200){
		closeDialog();
	}
}

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
