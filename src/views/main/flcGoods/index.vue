<template>
  <div class="flcGoods-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="商品名">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入商品名"/>
              
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcGoods:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI" style="margin-left:5px;"> 高级查询 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI" style="margin-left:5px;"> 隐藏查询 </el-button>
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcGoods" v-auth="'flcGoods:add'"> 新增 </el-button>
                <el-button type="primary" style="margin-left:5px;" icon="ele-DocumentCopy" @click="openFileDialog" v-auth="'flcGoods:add'"> 导入 </el-button>
              </el-button-group>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="商品编码">
              <el-input v-model="queryParams.productCode" clearable="" placeholder="请输入商品编码"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="商品简介">
              <el-input v-model="queryParams.description" clearable="" placeholder="请输入商品简介"/>
              
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
        <el-table-column prop="categoryId" label="所属分类" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.categoryIdCategoryName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="coverImage" label="封面图" width="80" align="center" show-overflow-tooltip="" >
          <template #default="scope">
            <el-image style="width: 60px; height: 60px" :src="scope.row.coverImage"  />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="productCode" label="商品编码" width="140"  show-overflow-tooltip="" />
        
        
        <el-table-column prop="description" label="商品简介"   show-overflow-tooltip="" />
        <el-table-column label="操作" width="140" align="center" fixed="right" show-overflow-tooltip="" v-if="auth('flcGoods:update') || auth('flcGoods:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit" size="small" text="" type="primary" @click="openEditFlcGoods(scope.row)" v-auth="'flcGoods:update'"> 编辑 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" @click="delFlcGoods(scope.row)" v-auth="'flcGoods:delete'"> 删除 </el-button>
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
        :title="printFlcGoodsTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :title="editFlcGoodsTitle"
        @reloadTable="handleQuery"
      />
      <excelUpload
      ref="excelUploadRef"
      ></excelUpload>
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcGoods">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';
  import { useRouter } from 'vue-router';
  import  excelUpload  from '/@/components/excelUpload/index.vue';
  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcGoods/component/editDialog.vue'
  import { pageFlcGoods, deleteFlcGoods } from '/@/api/main/flcGoods';


  const showAdvanceQueryUI = ref(false);
  const printDialogRef = ref();
  const editDialogRef = ref();
  const excelUploadRef=ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
  const queryParams = ref<any>({});
  const tableParams = ref({
    page: 1,
    pageSize: 50,
    total: 0,
  });

  const router=useRouter();
  const printFlcGoodsTitle = ref("");
  const editFlcGoodsTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcGoods(Object.assign(queryParams.value, tableParams.value));
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
  const openAddFlcGoods = () => {
    // editFlcGoodsTitle.value = '添加商品信息';
    // editDialogRef.value.openDialog({});
    router.push('/goods/goodsEdit')
  };

  // 打开打印页面
  const openPrintFlcGoods = async (row: any) => {
    printFlcGoodsTitle.value = '打印商品信息';
  }
  
  // 打开编辑页面
  const openEditFlcGoods = (row: any) => {
    // editFlcGoodsTitle.value = '编辑商品信息';
    // editDialogRef.value.openDialog(row);
    let id=row.id;
    router.push('/goods/goodsEdit?id='+id)
  };
  const openFileDialog=()=>{
    excelUploadRef.value.openDialog()
  }

  // 删除
  const delFlcGoods = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcGoods(row);
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

