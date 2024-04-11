<template>
  <div class="flcProcure-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="采购时间">
              <el-date-picker placeholder="请选择采购时间" value-format="YYYY/MM/DD" type="daterange" v-model="queryParams.procurementTimeRange" />
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="单据号">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入单据号"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="供应商">
              <el-select clearable="" filterable="" v-model="queryParams.supplierId" placeholder="请选择供应商">
                <el-option v-for="(item,index) in  flcSupplierInfoSupplierIdDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
         
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcProcure:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                
              </el-button-group>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="状态">
              
              <el-select clearable="" v-model="queryParams.state" placeholder="请选择状态">
                <el-option v-for="(item,index) in dl('code_procure_state')" :key="index" :value="item.code" :disabled="item.code==100" :label="`[${item.code}] ${item.value}`" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="总价格">
              <el-input v-model="queryParams.totalAmount" clearable="" placeholder="请输入总价格"/>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="采购员">
              <el-select clearable="" filterable="" v-model="queryParams.purchaser" placeholder="请选择采购员">
                <el-option v-for="(item,index) in  sysUserPurchaserDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
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
        <el-table-column prop="docNumber" label="单据号" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="supplierId" label="供应商" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.supplierIdSupName}}</span>
            
          </template>
          
        </el-table-column>
          <el-table-column prop="state" label="状态" width="140"  show-overflow-tooltip="" >
            <template #default="scope">
              <el-tag :type="di('code_procure_state', scope.row.state)?.tagType=='default'?'primary':di('code_procure_state', scope.row.state)?.tagType"> {{di("code_procure_state", scope.row.state)?.value}} </el-tag>
            </template>
          </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="procurementTime" label="采购时间" width="140"  show-overflow-tooltip="" />
       
        <el-table-column prop="totalAmount" label="总价格" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="purchaser" label="采购员" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.purchaserRealName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="reviewer" label="审核人" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.reviewerRealName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="remark" label="备注" main-width="340"  show-overflow-tooltip="" />
        <el-table-column label="操作" width="300" align="center" fixed="right" show-overflow-tooltip="" >
          <template #default="scope">
            <el-button icon="ele-View" size="small" text=""  type="primary" @click="openFlcProcureDetail(scope.row)"  > 详情 </el-button>
            <el-button icon="ele-Edit" size="small" text="" v-if="scope.row.state!=400" type="primary" @click="openEditFlcProcure(scope.row)" v-auth="'flcProcureInspection:inspection'" > 验货 </el-button>
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
        :title="printFlcProcureTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :title="editFlcProcureTitle"
        :type="typetext"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcProcureInspection">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';


  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcProcureInspection/component/editDialog.vue'
  import { pageFlcProcure } from '/@/api/main/flcProcure';
  import { getFlcSupplierInfoSupplierIdDropdown } from '/@/api/main/flcProcure';
  import { getSysUserPurchaserDropdown } from '/@/api/main/flcProcure';
  import dayjs from 'dayjs';
  import { useUserInfo } from '/@/stores/userInfo';
  const showAdvanceQueryUI = ref(true);
  const printDialogRef = ref();
  const editDialogRef = ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
  const typetext=ref<any>();
  const stores = useUserInfo();
  var now = dayjs().format('YYYY/MM/DD');
  var now_7=dayjs().subtract(7, 'day').format('YYYY/MM/DD');
  const queryParams = ref<any>({
    uid:stores.userInfos.id,
    isinventory:stores.userInfos.isinventory,
    userSupplierId:stores.userInfos.supplierId,
    procurementTimeRange:[
    now_7,now
    ],
    qtype:'inspection'
  });
  const tableParams = ref({
    page: 1,
    pageSize: 50,
    total: 0,
  });
  const printFlcProcureTitle = ref("");
  const editFlcProcureTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcProcure(Object.assign(queryParams.value, tableParams.value));
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

 

  // 打开打印页面
  const openPrintFlcProcure = async (row: any) => {
    printFlcProcureTitle.value = '打印采购订货列表';
  }
  
  // 打开验货页面
  const openEditFlcProcure = (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    editDialogRef.value.openDialog(row);
  };
   // 打开详情页面
   const openFlcProcureDetail = (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    typetext.value='Detail'
    editDialogRef.value.openDialog(row);
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
  
  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>

