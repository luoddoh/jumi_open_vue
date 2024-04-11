<template>
  <div class="flcCategorySupplier-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="分类名">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入查询分类名"/>
              
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="分类名">
              <el-input v-model="queryParams.categoryName" clearable="" placeholder="请输入分类名"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcCategorySupplier:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <!-- <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI" style="margin-left:5px;"> 高级查询 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI" style="margin-left:5px;"> 隐藏 </el-button> -->
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcCategorySupplier" v-auth="'flcCategorySupplier:add'"> 新增 </el-button>
                
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
        <el-table-column type="index" label="序" width="35" align="center"/>
        <el-table-column prop="superiorId" label="上级分类" width="200"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.superiorIdCategoryName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="categoryName" label="分类名" width="200"  show-overflow-tooltip="" />
        <el-table-column  label="备注" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('flcCategorySupplier:update') || auth('flcCategorySupplier:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditFlcCategorySupplier(scope.row)" v-auth="'flcCategorySupplier:update'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delFlcCategorySupplier(scope.row)" v-auth="'flcCategorySupplier:delete'"> 删除 </el-button>
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
        :title="printFlcCategorySupplierTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :title="editFlcCategorySupplierTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcCategorySupplier">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';


  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcCategorySupplier/component/editDialog.vue'
  import { pageFlcCategorySupplier, deleteFlcCategorySupplier } from '/@/api/main/flcCategorySupplier';


  const showAdvanceQueryUI = ref(false);
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

  const printFlcCategorySupplierTitle = ref("");
  const editFlcCategorySupplierTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcCategorySupplier(Object.assign(queryParams.value, tableParams.value));
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
  const openAddFlcCategorySupplier = () => {
    editFlcCategorySupplierTitle.value = '添加供应商分类';
    editDialogRef.value.openDialog({});
  };

  // 打开打印页面
  const openPrintFlcCategorySupplier = async (row: any) => {
    printFlcCategorySupplierTitle.value = '打印供应商分类';
  }
  
  // 打开编辑页面
  const openEditFlcCategorySupplier = (row: any) => {
    editFlcCategorySupplierTitle.value = '编辑供应商分类';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delFlcCategorySupplier = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcCategorySupplier(row);
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

