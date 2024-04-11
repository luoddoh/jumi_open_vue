<template>
  <div class="flcInventoryCheck-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="盘点时间">
              <el-date-picker placeholder="请选择盘点时间" value-format="YYYY/MM/DD" type="daterange" v-model="queryParams.checkTimeRange" />
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            
            <el-form-item label="单据号">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入单据号"/>
              
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary"  icon="ele-Search" @click="handleQuery" v-auth="'flcInventoryCheck:page'"> 查询 </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <!-- <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI" style="margin-left:5px;"> 高级查询 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI" style="margin-left:5px;"> 隐藏 </el-button> -->
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcInventoryCheck" v-auth="'flcInventoryCheck:add'"> 新增 </el-button>
                
              </el-button-group>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="状态">
              <el-select clearable="" v-model="queryParams.state" placeholder="请选择状态">
                <el-option v-for="(item,index) in dl('code_check_inventory')" :key="index" :value="item.code" :label="`[${item.code}] ${item.value}`" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="盘点人">
              <el-select clearable="" filterable="" v-model="queryParams.checkPeople" placeholder="请选择盘点人">
                <el-option v-for="(item,index) in  sysUserCheckPeopleDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="审核人">
              <el-select clearable="" filterable="" v-model="queryParams.reviewer" placeholder="请选择审核人">
                <el-option v-for="(item,index) in  sysUserReviewerDropdownList" :key="index" :value="item.value" :label="item.label" />
                
              </el-select>
              
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="审核时间">
              <el-date-picker placeholder="请选择审核时间" value-format="YYYY/MM/DD" type="daterange" v-model="queryParams.reviewerTimeRange" />
              
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="备注">
              <el-input v-model="queryParams.remark" clearable="" placeholder="请输入备注"/>
              
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
          <el-table-column prop="state" label="状态" width="140"  show-overflow-tooltip="" >
            <template #default="scope">
              <el-tag :type="di('code_check_inventory', scope.row.state)?.tagType"> {{di("code_check_inventory", scope.row.state)?.value}} </el-tag>
            </template>
          </el-table-column>
        <el-table-column prop="checkPeople" label="盘点人" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.checkPeopleRealName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="checkTime" label="盘点时间" width="140" sortable='custom' show-overflow-tooltip="" />
        <el-table-column prop="reviewer" label="审核人" width="120"  show-overflow-tooltip="">
          <template #default="scope">
            <span>{{scope.row.reviewerRealName}}</span>
            
          </template>
          
        </el-table-column>
        <el-table-column prop="reviewerTime" label="审核时间" width="140" sortable='custom' show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注"   show-overflow-tooltip="" />
        <el-table-column label="操作"  align="center" fixed="right" show-overflow-tooltip="" v-if="auth('flcInventoryCheck:update') || auth('flcInventoryCheck:delete')">
          <template #default="scope">
            <el-button icon="ele-Edit"  v-if="scope.row.state==100" size="small" text="" type="primary" @click="openEditFlcInventoryCheck(scope.row)" v-auth="'flcInventoryCheck:update'"> 编辑 </el-button>
            <el-button icon="ele-Lock" v-if="scope.row.state==100" size="small" text="" type="primary" @click="openExamineOk(scope.row)"
                v-auth="'flcInventoryOut:update'"> 审核 </el-button>
              <el-button icon="ele-Unlock" v-if="scope.row.state==101" size="small" text="" type="primary" @click="openExamineNo(scope.row)"
                v-auth="'flcInventoryOut:update'"> 反审核 </el-button>
                <el-button icon="ele-Select" v-if="scope.row.state==101" size="small" text="" type="primary" @click="openExamineCheck(scope.row)"
                v-auth="'flcInventoryOut:update'"> 确认盘点 </el-button>
                <el-button icon="ele-View" v-if="scope.row.state!=100" size="small" text="" type="primary" @click="openFlcInventoryCheckDetail(scope.row)" v-auth="'flcInventoryCheck:update'"> 详情 </el-button>
            <el-button icon="ele-Delete" v-if="scope.row.state==100" size="small" text="" type="primary" @click="delFlcInventoryCheck(scope.row)" v-auth="'flcInventoryCheck:delete'"> 删除 </el-button>
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
        :title="printFlcInventoryCheckTitle"
        @reloadTable="handleQuery" />
      <editDialog
        ref="editDialogRef"
        :type="examine"
        :title="editFlcInventoryCheckTitle"
        @reloadTable="handleQuery"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcInventoryCheck">
  import { ref } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { auth } from '/@/utils/authFunction';
  import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
  import { formatDate } from '/@/utils/formatTime';


  import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
  import editDialog from '/@/views/main/flcInventoryCheck/component/editDialog.vue'
  import { pageFlcInventoryCheck, deleteFlcInventoryCheck } from '/@/api/main/flcInventoryCheck';
  import { getSysUserCheckPeopleDropdown } from '/@/api/main/flcInventoryCheck';
  import { getSysUserReviewerDropdown } from '/@/api/main/flcInventoryCheck';
  import dayjs from 'dayjs';
  import { useUserInfo } from '/@/stores/userInfo';

const stores = useUserInfo();
  var now = dayjs().format('YYYY/MM/DD');
  var now_7=dayjs().subtract(7, 'day').format('YYYY/MM/DD');
  const showAdvanceQueryUI = ref(true);
  const printDialogRef = ref();
  const editDialogRef = ref();
  const loading = ref(false);
  const tableData = ref<any>([]);
  const queryParams = ref<any>({
    uid:stores.userInfos.id,
    checkTimeRange:[
    now_7,now
    ]
  });
  const tableParams = ref({
    page: 1,
    pageSize: 50,
    total: 0,
  });

  const printFlcInventoryCheckTitle = ref("");
  const editFlcInventoryCheckTitle = ref("");

  // 改变高级查询的控件显示状态
  const changeAdvanceQueryUI = () => {
    showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
  }
  const examine = ref("");
const openExamineOk = (row: any) => {
  editFlcInventoryCheckTitle.value = '出库单信息列表';
  examine.value = 'examine_ok';
  editDialogRef.value.openDialog(row);
};
const openExamineNo = (row: any) => {
  editFlcInventoryCheckTitle.value = '出库单信息列表';
  examine.value = 'examine_no';
  editDialogRef.value.openDialog(row);
};
const openExamineCheck = (row: any) => {
  editFlcInventoryCheckTitle.value = '出库单信息列表';
  examine.value = 'check_ok';
  editDialogRef.value.openDialog(row);
};
const openFlcInventoryCheckDetail = (row: any) => {
  editFlcInventoryCheckTitle.value = '出库单信息列表';
  examine.value = 'checkDetail';
  editDialogRef.value.openDialog(row);
};

  // 查询操作
  const handleQuery = async () => {
    loading.value = true;
    var res = await pageFlcInventoryCheck(Object.assign(queryParams.value, tableParams.value));
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
  const openAddFlcInventoryCheck = () => {
    editFlcInventoryCheckTitle.value = '添加盘点单';
    examine.value = '';
    editDialogRef.value.openDialog({});
  };

  // 打开打印页面
  const openPrintFlcInventoryCheck = async (row: any) => {
    printFlcInventoryCheckTitle.value = '打印盘点单';
  }
  
  // 打开编辑页面
  const openEditFlcInventoryCheck = (row: any) => {
    editFlcInventoryCheckTitle.value = '编辑盘点单';
    examine.value = '';
    editDialogRef.value.openDialog(row);
  };

  // 删除
  const delFlcInventoryCheck = (row: any) => {
    ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    await deleteFlcInventoryCheck(row);
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
  
  handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>

