<template>
  <div class="flcProcureDetail-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="采购订单Id">
              <el-select clearable="" filterable="" v-model="queryParams.procureId" placeholder="请选择采购订单Id">
                <el-option v-for="(item,index) in  flcProcureProcureIdDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcProcureDetail:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcProcureDetail" v-auth="'flcProcureDetail:add'"> 新增 </el-button>
                
              </el-button-group>
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
        <el-table-column prop="procureId" label="采购订单Id" width="90"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.procureIdDocNumber}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="goodsId" label="商品Id" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.goodsIdGoodsName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="skuId" label="商品sku" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.skuIdId}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="inventoryNum" label="库存量" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="purchasePrice" label="采购价" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="purchaseNum" label="采购数量" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="okNum" label="未到数量" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="noNum" label="已到数量" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="totalAmount" label="总金额" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140"  show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('flcProcureDetail:update') || auth('flcProcureDetail:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditFlcProcureDetail(scope.row)" v-auth="'flcProcureDetail:update'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delFlcProcureDetail(scope.row)" v-auth="'flcProcureDetail:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
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
        :title="printFlcProcureDetailTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :title="editFlcProcureDetailTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcProcureDetail">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';


  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcProcureDetail/component/editDialog.vue'
  import { pageFlcProcureDetail, deleteFlcProcureDetail } from '/@/api/main/flcProcureDetail';
  import { getFlcProcureProcureIdDropdown } from '/@/api/main/flcProcureDetail';


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

  const printFlcProcureDetailTitle = ref("");
  const editFlcProcureDetailTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcProcureDetail(Object.assign(queryParams.value, tableParams.value));
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
  const openAddFlcProcureDetail = () => {
    editFlcProcureDetailTitle.value = '添加采购明细';
    editDialogRef.value.openDialog({});
  };

  // 打开打印页面
  const openPrintFlcProcureDetail = async (row: any) => {
    printFlcProcureDetailTitle.value = '打印采购明细';
  }
  
  // 打开编辑页面
  const openEditFlcProcureDetail = (row: any) => {
    editFlcProcureDetailTitle.value = '编辑采购明细';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delFlcProcureDetail = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcProcureDetail(row);
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

  const flcProcureProcureIdDropdownList = ref<any>([]); 
  const getFlcProcureProcureIdDropdownList = async () => {
    let list = await getFlcProcureProcureIdDropdown();
    flcProcureProcureIdDropdownList.value = list.data.result ?? [];
  };
  getFlcProcureProcureIdDropdownList();
  
  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>

