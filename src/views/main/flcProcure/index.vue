<template>
  <div class="flcProcure-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="采购时间">
              <el-date-picker placeholder="请选择采购时间" value-format="YYYY/MM/DD" @change="logdd" type="daterange" v-model="queryParams.procurementTimeRange"  :shortcuts="shortcuts"  />
              
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
                <!-- <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI" style="margin-left:5px;"> 高级查询 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI" style="margin-left:5px;"> 隐藏 </el-button> -->
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcProcure" v-auth="'flcProcure:add'"> 新增 </el-button>
                
              </el-button-group>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="状态">
              
              <el-select clearable="" v-model="queryParams.state" placeholder="请选择状态">
                <el-option v-for="(item,index) in dl('code_procure_state')" :key="index" :value="item.code" :label="`[${item.code}] ${item.value}`" />
                
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
          <el-table-column prop="state" label="状态"  show-overflow-tooltip="" >
            <template #default="scope">
              <el-tag :type="di('code_procure_state', scope.row.state)?.tagType=='default'?'primary':di('code_procure_state', scope.row.state)?.tagType"> {{di("code_procure_state", scope.row.state)?.value}} </el-tag>
            </template>
          </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="140"  show-overflow-tooltip="" />
        <el-table-column prop="procurementTime" label="采购时间" width="140"  show-overflow-tooltip="" />
       
        <el-table-column prop="totalAmount" label="总价格"  show-overflow-tooltip="" />
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
        <el-table-column prop="remark" label="备注"  show-overflow-tooltip="" />
        <el-table-column label="操作"  align="center" width="470" fixed="right" show-overflow-tooltip="" v-if="auth('flcProcure:update') || auth('flcProcure:delete')">
          <template #default="scope">
            <el-button icon="ele-Printer" size="small" text="" type="primary" @click="openPrintFlcProcure(scope.row)"> 打印三联 </el-button>
            <el-button icon="ele-Printer" size="small" text="" type="primary" @click="openPrintDetail(scope.row)"> 打印热敏 </el-button>
            <el-button icon="ele-View" size="small" text="" type="primary" v-if="scope.row.state!=100" @click="openFlcProcureDetail(scope.row)" v-auth="'flcProcure:update'"> 详情 </el-button>
            <el-button icon="ele-Edit" size="small" text="" type="primary" v-if="scope.row.state==100" @click="openEditFlcProcure(scope.row)" v-auth="'flcProcure:update'"> 编辑 </el-button>
            <el-button icon="ele-Lock" size="small" text="" type="primary" v-if="scope.row.state==100" @click="openExamineOk(scope.row)" v-auth="'flcProcure:update'"> 审核 </el-button>
            <el-button icon="ele-Unlock" size="small" text="" type="primary" v-if="scope.row.state==200" @click="openExamineNo(scope.row)" v-auth="'flcProcure:update'"> 反审核 </el-button>
            <el-button icon="ele-Delete" size="small" text="" type="primary" v-if="scope.row.state==100" @click="delFlcProcure(scope.row)" v-auth="'flcProcure:delete'"> 删除 </el-button>
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
        :type="examine"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcProcure">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';

  import { getAPI } from '/@/utils/axios-utils';
  import { hiprint } from 'vue-plugin-hiprint';
  import { SysPrintApi } from '/@/api-services/api';
  import { SysPrint } from '/@/api-services/models';
  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcProcure/component/editDialog.vue'
  import { pageFlcProcure, deleteFlcProcure } from '/@/api/main/flcProcure';
  import { getFlcSupplierInfoSupplierIdDropdown } from '/@/api/main/flcProcure';
  import { getSysUserPurchaserDropdown } from '/@/api/main/flcProcure';
  import { listFlcProcureDetail } from "/@/api/main/flcProcureDetail";
  import { useUserInfo } from '/@/stores/userInfo';
  import dayjs from 'dayjs';
const stores = useUserInfo();
  const showAdvanceQueryUI = ref(true);
  const printDialogRef = ref();
  const editDialogRef = ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
    var now = dayjs().format('YYYY/MM/DD');
  var now_7=dayjs().subtract(7, 'day').format('YYYY/MM/DD');
  const queryParams = ref<any>({
    uid:stores.userInfos.id,
    isinventory:stores.userInfos.isinventory,
    userSupplierId:stores.userInfos.supplierId,
    procurementTimeRange:[
    now_7,now
    ]
  });
  const examine=ref("");
  const tableParams = ref({
    page: 1,
    pageSize: 50,
    total: 0,
  });
  
  const printFlcProcureTitle = ref("");
  const editFlcProcureTitle = ref("");
const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    },
  },
  {
    text: '近一周',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    },
  },
]
const logdd=()=>{
  console.log(queryParams)
}
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

  // 打开新增页面
  const openAddFlcProcure = () => {
    editFlcProcureTitle.value = '添加采购订货列表';
    examine.value = 'edit';
    editDialogRef.value.openDialog({});
  };

  // 打开打印页面
const openPrintFlcProcure = async (row: any) => {
  printFlcProcureTitle.value = '打印采购订货单';
  var res = await getAPI(SysPrintApi).apiSysPrintPrintNameGet('订货单');
  var printTemplate = res.data.result as SysPrint;
  var table= (await listFlcProcureDetail(row.id)).data.result;
  let list:any[]=[];
  let total=0;
  table.forEach((item:any)=>{
    let speVal=""
    item.speValueList.forEach((ele:any)=>{
      if(speVal==""){
        speVal+=ele.speValue
      }else{
        speVal+="/"+ele.speValue
      }
    })
    total+=item.purchaseNum
    list.push({
      NAME:item.goodsName,
      GG:"["+speVal+"]",
      DJ:item.purchasePrice,
      SL:item.purchaseNum,
      JE:item.totalAmount,
      DETAIL:item.remark
    })
  })
  let print_data={
    supplier:row.supplierIdSupName,
    printDate:formatDate(new Date(), 'YYYY-mm-dd'),
    orderId:row.docNumber,
    handledby:row.purchaserRealName,
    department:row.department,
    warehouse:'义乌仓',
    creator:stores.userInfos.realName,
    totle_number:total,
    Congratulations:'感谢您的配合，为了长期更好的沟通，我们会竭诚配合!!!',
    table:list
  };
  var template = JSON.parse(printTemplate.template);
  console.log(template)
  row['printDate'] = formatDate(new Date(), 'YYYY-mm-dd')
  printDialogRef.value.showDialog(new hiprint.PrintTemplate({ template: template }), print_data, template.panels[0].width);
}
const openFlcProcureDetail= (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    examine.value = 'Detail';
    editDialogRef.value.openDialog(row);
  };
  // 打开编辑页面
  const openEditFlcProcure = (row: any) => {
    editFlcProcureTitle.value = '编辑采购订货列表';
    examine.value = 'edit';
    editDialogRef.value.openDialog(row);
  };
  const openExamineOk = (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    examine.value = 'examine_ok';
    editDialogRef.value.openDialog(row);
  };
  const openExamineNo = (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    examine.value = 'examine_no';
    editDialogRef.value.openDialog(row);
  };
  const openPrintDetail = (row: any) => {
    editFlcProcureTitle.value = '采购订货列表';
    examine.value = 'Print';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delFlcProcure = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcProcure(row);
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

