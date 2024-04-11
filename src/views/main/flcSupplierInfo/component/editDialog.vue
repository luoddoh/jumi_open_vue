<template>
	<div class="flcSupplierInfo-container">
		<el-dialog v-model="isShowDialog" :width="400" draggable="">
			<template #header>
				<div style="color: #fff">
					<!--<el-icon size="16" style="margin-right: 3px; display: inline; vertical-align: middle"> <ele-Edit /> </el-icon>-->
					<span>{{ props.title }}</span>
				</div>
			</template>
			<el-form :model="ruleForm" ref="ruleFormRef" label-width="auto" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24" class="mb20">
						<el-form-item label="供应商分类" prop="categoryId">
							<el-cascader
								:options="flcCategorySupplierTreeData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'categoryName' }"
								placeholder="请选择供应商分类"
								clearable=""
								class="w100"
								v-model="ruleForm.categoryId"
							>
								<template #default="{ node, data }">
									<span>{{ data.categoryName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
							
						</el-form-item>
						
					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-form-item v-show="false">
						<el-input v-model="ruleForm.id" />
					</el-form-item>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24" class="mb20">
						<el-form-item label="供应商名称" prop="supName">
							<el-input v-model="ruleForm.supName" placeholder="请输入供应商名称" maxlength="32" show-word-limit clearable />
							
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
	import { addFlcSupplierInfo, updateFlcSupplierInfo, detailFlcSupplierInfo } from "/@/api/main/flcSupplierInfo";
	import { getFlcCategorySupplierTree } from '/@/api/main/flcSupplierInfo';

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
		supName: [{required: true, message: '请输入供应商名称！', trigger: 'blur',},],
		categoryId: [{required: true, message: '请选择供应商分类！', trigger: 'change',},],
	});

	// 打开弹窗
	const openDialog = async (row: any) => {
		// ruleForm.value = JSON.parse(JSON.stringify(row));
		// 改用detail获取最新数据来编辑
		let rowData = JSON.parse(JSON.stringify(row));
		if (rowData.id)
			ruleForm.value = (await detailFlcSupplierInfo(rowData.id)).data.result;
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
					await addFlcSupplierInfo(values);
				} else {
					await updateFlcSupplierInfo(values);
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


	const flcCategorySupplierTreeData = ref<any>([]); 
	const getFlcCategorySupplierTreeData = async () => {
		let list = await getFlcCategorySupplierTree();
		flcCategorySupplierTreeData.value = list.data.result ?? [];
	};
	getFlcCategorySupplierTreeData();
	





	// 页面加载时
	onMounted(async () => {
	});

	//将属性或者函数暴露给父组件
	defineExpose({ openDialog });
</script>




