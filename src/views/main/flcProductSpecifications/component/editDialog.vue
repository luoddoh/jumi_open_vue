<template>
	<div class="flcProductSpecifications-container">
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
						<el-form-item label="规格名" prop="speName">
							<el-input v-model="ruleForm.speName" placeholder="请输入规格名" maxlength="45" show-word-limit
								clearable />

						</el-form-item>

					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="启用" prop="enable">
							<el-switch v-model="ruleForm.enable" active-text="是" inactive-text="否" />

						</el-form-item>

					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-col>
						<el-form-item label="规格值列表">
							<el-table :data="speValues" border style="width: 100%">
								<el-table-column type="index" width="30"/>
								<el-table-column align="center" width="80">
									<template #header>
										<el-button size="small" @click="addValue(ruleForm.id)"
											type="success">添加</el-button>
									</template>
									<template #default="scope">
										<el-button size="small" @click="delValue(scope.row)"
											type="danger">删除</el-button>
									</template>
								</el-table-column>
								<el-table-column  label="规格值" width="300">
									<template #default="scope">
										<div>
											<el-text v-if="!scope.row.valueSelect" class="mx-1">{{ scope.row.speValue }}</el-text>
											<el-input v-else-if="scope.row.valueSelect" v-model="scope.row.speValue " style="width: 100px" placeholder="输入规格值" clearable />
											<el-button :icon="scope.row.valueSelect?'ele-Select':'ele-Edit'" size="small" text="" @click="scope.row.valueSelect=!scope.row.valueSelect" type="primary"></el-button>
										</div>
									</template>
								</el-table-column>
								<el-table-column  label="备注">
									<template #default="scope">
										<div>
											<el-text v-if="!scope.row.remarkSelect" class="mx-1">{{ scope.row.remark }}</el-text>
											<el-input v-else-if="scope.row.remarkSelect" v-model="scope.row.remark " style="width: 100px" placeholder="输入备注" clearable />
											<el-button :icon="scope.row.remarkSelect?'ele-Select':'ele-Edit'" size="small" text="" @click="scope.row.remarkSelect=!scope.row.remarkSelect" type="primary"></el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
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
import { ref, onMounted } from "vue";
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import { addFlcProductSpecifications, updateFlcProductSpecifications, detailFlcProductSpecifications } from "/@/api/main/flcProductSpecifications";

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
const ruleForm = ref<any>({
	
});
const speValues = ref<any>([]);
//自行添加其他规则
const rules = ref<FormRules>({
	speName: [{ required: true, message: '请输入规格名！', trigger: 'blur', },],
});

// 打开弹窗
const openDialog = async (row: any) => {
	// ruleForm.value = JSON.parse(JSON.stringify(row));
	// 改用detail获取最新数据来编辑
	let rowData = JSON.parse(JSON.stringify(row));
	if (rowData.id){
		ruleForm.value = (await detailFlcProductSpecifications(rowData.id)).data.result;
		speValues.value=ruleForm.value.speValues;
	}
	else{
		ruleForm.value = rowData;
		ruleForm.value.enable=true;
		speValues.value=[];
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
			let spedate=validatespeValues();
			if(!spedate){
				return
			}else{
				values.speValues=spedate;
			}
			
			if (ruleForm.value.id == undefined || ruleForm.value.id == null || ruleForm.value.id == "" || ruleForm.value.id == 0) {
				await addFlcProductSpecifications(values);
			} else {
				await updateFlcProductSpecifications(values);
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

const addValue = (sid: any) => {
	speValues.value.push({
		speValue: '',
		specificationId: sid,
		remark: ''
	});
}

const delValue = (row: any) => {
	let data = speValues.value;
	let index = data.indexOf(row);
	if (index != -1) {
		data.splice(index, 1);
	}
	speValues.value = data;
}

const validatespeValues=()=>{
	let data = speValues.value;
	let result: { id:any,speValue: any; specificationId: any; remark: any; }[]=[];
	if(data.length>0){
		data.forEach((element: any) => {
			if(!element.speValue){
				ElMessage({
					message: `规格列表中存在空数据，请检查！`,
					type: "error",
				});
				return false
			}else{
				result.push({
					id:element.id,
					speValue:element.speValue,
					specificationId:element.specificationId,
					remark:element.remark,
				})
			}
		});
		return result
	}else{
		ElMessage({
			message: `规格列表为空，不予保存！`,
			type: "error",
		});
		return false
	}
	
}





// 页面加载时
onMounted(async () => {
});

//将属性或者函数暴露给父组件
defineExpose({ openDialog });
</script>
