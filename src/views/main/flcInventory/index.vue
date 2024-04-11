<template>
  <div class="flcInventory-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="商品名">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入商品名"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="总价格">
              <el-input v-model="queryParams.totalAmount" clearable="" placeholder="请输入总价格"/>
              
            </el-form-item>
          </el-col>
         
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcInventory:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                
              </el-button-group>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="库存量≥">
              <el-input v-model="queryParams.maxNumber" clearable="" placeholder="请输入总价格"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="库存量≤">
              <el-input v-model="queryParams.minNumber" clearable="" placeholder="请输入总价格"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="总价格≥">
              <el-input v-model="queryParams.maxTotalAmount" clearable="" placeholder="请输入总价格"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="总价格≤">
              <el-input v-model="queryParams.minTotalAmount" clearable="" placeholder="请输入总价格"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 5px">
      <el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loading"
				tooltip-effect="light"
				row-key="id"
                @sort-change="sortChange"
				border="">
        <el-table-column type="index" label="序号" width="55" align="center"/>
        <el-table-column prop="goodesName" label="商品"   />
        <el-table-column prop="skuIdBarCode" label="规格"  show-overflow-tooltip="" >
          <template #default="scope">
            <div>
											[<el-text v-for="(item, index) in scope.row.speValueList"
												:key="index">{{ index == 0 ? item.speValue : '/' + item.speValue
												}}</el-text>]
										</div>
          </template>
          </el-table-column>
        <el-table-column prop="skuIdBarCode" label="条码" width="90"  show-overflow-tooltip="" />
        <el-table-column prop="unitName" label="单位" width="100" />
        <el-table-column prop="number" label="数量" sortable width="140"  show-overflow-tooltip="" />
        <el-table-column prop="totalAmount" label="总价格" sortable width="140"  show-overflow-tooltip="" />
        <el-table-column prop="" label="备注"   />
      </el-table>
      <el-pagination
				v-model:currentPage="tableParams.page"
				v-model:page-size="tableParams.pageSize"
				:total="tableParams.total"
				:page-sizes="[10, 20, 50, 100, 200, 500]"
				small=""
				background=""
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
	/>
      <printDialog
        ref="printDialogRef"
        :title="printFlcInventoryTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :title="editFlcInventoryTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcInventory">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';


  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcInventory/component/editDialog.vue'
  import { pageFlcInventory, deleteFlcInventory } from '/@/api/main/flcInventory';


  const showAdvanceQueryUI = ref(true);
  const printDialogRef = ref();
  const editDialogRef = ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
  const queryParams = ref<any>({});
  const tableParams = ref({
    page: 1,
    pageSize: 50,
    total: 0,
  });

  const printFlcInventoryTitle = ref("");
  const editFlcInventoryTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcInventory(Object.assign(queryParams.value, tableParams.value));
    tableData.value = res.data.result?.items ?? [];
    tableParams.value.total = res.data.result?.total;
    loading.value = false;
  };

  // 列排序
  const sortChange = async (column: any) => {
	queryParams.value.field = column.prop;
	queryParams.value.order = column.order;
	await handleQuery();
  };

  // 打开新增页面
  const openAddFlcInventory = () => {
    editFlcInventoryTitle.value = '添加库存查询';
    editDialogRef.value.openDialog({});
  };

  // 打开打印页面
  const openPrintFlcInventory = async (row: any) => {
    printFlcInventoryTitle.value = '打印库存查询';
  }
  
  // 打开编辑页面
  const openEditFlcInventory = (row: any) => {
    editFlcInventoryTitle.value = '编辑库存查询';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delFlcInventory = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcInventory(row);
    handleQuery();
    ElMessage.success("删除成功");
  })
  .catch(() => {});
  };

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

  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}

</style>


