<template>
  <div class="flcProcureReturn-container">
    <el-card shadow="hover" :body-style="{ paddingBottom: '0' }">
      <el-form :model="queryParams" ref="queryForm" labelWidth="90">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="退货时间">
              <el-date-picker placeholder="请选择退货时间" value-format="YYYY/MM/DD" type="daterange"
                v-model="queryParams.returnTimeRange" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10">
            <el-form-item label="单据号">
              <el-input v-model="queryParams.searchKey" clearable="" placeholder="请输入单据号" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="供应商">
              <el-input v-model="queryParams.supplierId" clearable="" placeholder="请输入供应商" />

            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="4" class="mb10" v-if="showAdvanceQueryUI">
            <el-form-item label="退货员">
              <el-select clearable="" filterable="" v-model="queryParams.returner" placeholder="请选择退货员">
                <el-option v-for="(item, index) in  sysUserReturnerDropdownList" :key="index" :value="item.value"
                  :label="item.label" />

              </el-select>

            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="mb10">
            <el-form-item>
              <el-button-group style="display: flex; align-items: center;">
                <el-button type="primary" icon="ele-Search" @click="handleQuery" v-auth="'flcProcureReturn:page'"> 查询
                </el-button>
                <el-button icon="ele-Refresh" @click="() => queryParams = {}"> 重置 </el-button>
                <!-- <el-button icon="ele-ZoomIn" @click="changeAdvanceQueryUI" v-if="!showAdvanceQueryUI"
                  style="margin-left:5px;"> 高级查询 </el-button>
                <el-button icon="ele-ZoomOut" @click="changeAdvanceQueryUI" v-if="showAdvanceQueryUI"
                  style="margin-left:5px;"> 隐藏 </el-button> -->
                <el-button type="primary" style="margin-left:5px;" icon="ele-Plus" @click="openAddFlcProcureReturn"
                  v-auth="'flcProcureReturn:add'"> 新增 </el-button>

              </el-button-group>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="full-table" shadow="hover" style="margin-top: 5px">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" tooltip-effect="light" row-key="id"
        @sort-change="sortChange" border="">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="docNumber" label="单据号" width="140" show-overflow-tooltip="" />
        <el-table-column prop="supplierId" label="供应商" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.supplierIdSuplName }}</span>

          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="140" show-overflow-tooltip="">
          <template #default="scope">
            <el-tag
              :type="di('code_reture_state', scope.row.state)?.tagType == 'default' ? 'primary' : di('code_reture_state', scope.row.state)?.tagType">
              {{ di("code_reture_state", scope.row.state)?.value }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="returner" label="退货员" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.returnerRealName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="returnTime" label="退货时间" width="140" show-overflow-tooltip="" />
        <el-table-column prop="reviewer" label="审核人" width="120" show-overflow-tooltip="">
          <template #default="scope">
            <span>{{ scope.row.reviewerRealName }}</span>

          </template>

        </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="140" show-overflow-tooltip="" />
        <el-table-column prop="totalAmount" label="总价格" width="140" show-overflow-tooltip="" />
        <el-table-column prop="remark" label="备注" width="140" show-overflow-tooltip="" />
        <el-table-column label="操作" align="center" fixed="right" show-overflow-tooltip=""
          v-if="auth('flcProcureReturn:update') || auth('flcProcureReturn:delete')">
          <template #default="scope">
            <el-button icon="ele-Printer" size="small" text="" type="primary"
              @click="openPrintFlcProcureReturn(scope.row)"> 打印三联 </el-button>
            <!-- <el-button icon="ele-Printer" size="small" text="" type="primary" @click="openPrintFlcProcureReturn(scope.row)" v-auth="'flcProcureReturn:print'"> 打印 </el-button> -->
            <el-button icon="ele-Edit" size="small" text="" type="primary"
                @click="openEditFlcProcureReturn(scope.row)" v-if="scope.row.state == 100" v-auth="'flcProcureReturn:update'"> 编辑 </el-button>
              <el-button icon="ele-Lock" size="small" text="" v-if="scope.row.state == 100" type="primary" @click="openExamineOk(scope.row)"
                v-auth="'flcProcureReturn:update'"> 审核 </el-button>
              <el-button icon="ele-Unlock" size="small" text="" v-if="scope.row.state == 200" type="primary" @click="openExamineNo(scope.row)"
                v-auth="'flcProcureReturn:update'"> 反审核 </el-button>
              <el-button icon="ele-Unlock" size="small" text="" v-if="scope.row.state == 200" type="primary" @click="openRetureOk(scope.row)"
                v-auth="'flcProcureReturn:update'"> 确认退货 </el-button>
                <el-button icon="ele-View" size="small" text="" type="primary" v-if="scope.row.state!=100" @click="openFlcProcureReturnDetail(scope.row)" v-auth="'flcProcure:update'"> 详情 </el-button>
            <el-button v-if="scope.row.state == 100" icon="ele-Delete" size="small" text="" type="primary" @click="delFlcProcureReturn(scope.row)"
              v-auth="'flcProcureReturn:delete'"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="tableParams.page" v-model:page-size="tableParams.pageSize"
        :total="tableParams.total" :page-sizes="[10, 20, 50, 100, 200, 500]" small="" background=""
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" />
      <printDialog ref="printDialogRef" :title="printFlcProcureReturnTitle" @reloadTable="handleQuery" />
      <editDialog ref="editDialogRef" :title="editFlcProcureReturnTitle" :type="examine" @reloadTable="handleQuery" />
    </el-card>
  </div>
</template>

<script lang="ts" setup="" name="flcProcureReturn">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { auth } from '/@/utils/authFunction';
import { getDictDataItem as di, getDictDataList as dl } from '/@/utils/dict-utils';
import { formatDate } from '/@/utils/formatTime';
import { getAPI } from '/@/utils/axios-utils';
// 推荐设置操作 width 为 200
import { hiprint } from 'vue-plugin-hiprint';
import { SysPrintApi } from '/@/api-services/api';
import { SysPrint } from '/@/api-services/models';
import { listFlcProcureReturnDetail} from "/@/api/main/flcProcureReturn";
import printDialog from '/@/views/system/print/component/hiprint/preview.vue'
import editDialog from '/@/views/main/flcProcureReturn/component/editDialog.vue'
import { pageFlcProcureReturn, deleteFlcProcureReturn } from '/@/api/main/flcProcureReturn';
import { getSysUserReturnerDropdown } from '/@/api/main/flcProcureReturn';
import dayjs from 'dayjs';
import { useUserInfo } from '/@/stores/userInfo';

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
  returnTimeRange:[now_7,now]
});
const tableParams = ref({
  page: 1,
  pageSize: 50,
  total: 0,
});

const printFlcProcureReturnTitle = ref("");
const editFlcProcureReturnTitle = ref("");

// 改变高级查询的控件显示状态
const changeAdvanceQueryUI = () => {
  showAdvanceQueryUI.value = !showAdvanceQueryUI.value;
}


// 查询操作
const handleQuery = async () => {
  loading.value = true;
  var res = await pageFlcProcureReturn(Object.assign(queryParams.value, tableParams.value));
  tableData.value = res.data.result?.items ?? [];
  tableParams.value.total = res.data.result?.total;
  loading.value = false;
};

const examine = ref("");
const openExamineOk = (row: any) => {
  editFlcProcureReturnTitle.value = '采购退货列表';
  examine.value = 'examine_ok';
  editDialogRef.value.openDialog(row);
};
const openExamineNo = (row: any) => {
  editFlcProcureReturnTitle.value = '采购退货列表';
  examine.value = 'examine_no';
  editDialogRef.value.openDialog(row);
};
const openRetureOk = (row: any) => {
  editFlcProcureReturnTitle.value = '采购退货列表';
  examine.value = 'Reture_ok';
  editDialogRef.value.openDialog(row);
};
const openFlcProcureReturnDetail = (row: any) => {
  editFlcProcureReturnTitle.value = '采购退货列表';
  examine.value = 'RetureDetail';
  editDialogRef.value.openDialog(row);
};

// 列排序
const sortChange = async (column: any) => {
  queryParams.value.field = column.prop;
  queryParams.value.order = column.order;
  await handleQuery();
};

// 打开新增页面
const openAddFlcProcureReturn = () => {
  editFlcProcureReturnTitle.value = '添加采购退货列表';
  examine.value='';
  editDialogRef.value.openDialog({});
};

// 打开打印页面
const openPrintFlcProcureReturn = async (row: any) => {
  printFlcProcureReturnTitle.value = '打印采购退货单';
  var res = await getAPI(SysPrintApi).apiSysPrintPrintNameGet('单据');
  var printTemplate = res.data.result as SysPrint;
  var table= (await listFlcProcureReturnDetail(row.id)).data.result;
  let list:any[]=[];
  let index=1;
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
    total+=item.returnNum
    list.push({
      NAME:index++,
      SL:item.goodsName+"["+speVal+"]",
      TM:item.returnNum,
      GG:item.unitName,
      JE:item.remark
    })
  })
  let print_data={
    title:'退货明细单',
    consignee:row.supplierIdSuplName,
    printDate:formatDate(new Date(), 'YYYY-mm-dd'),
    orderId:row.docNumber,
    handledby:row.returnerRealName,
    department:row.department,
    warehouse:'义乌仓',
    creator:stores.userInfos.realName,
    totle_number:total,
    Congratulations:'感谢您的配合，为了长期更好的沟通，我们会竭诚配合!!!',
    table:list
  };
  var template = JSON.parse(printTemplate.template);
  row['printDate'] = formatDate(new Date(), 'YYYY-mm-dd')
  printDialogRef.value.showDialog(new hiprint.PrintTemplate({ template: template }), print_data, template.panels[0].width);
}

// 打开编辑页面
const openEditFlcProcureReturn = (row: any) => {
  editFlcProcureReturnTitle.value = '编辑采购退货列表';
  editDialogRef.value.openDialog(row);
};

// 删除
const delFlcProcureReturn = (row: any) => {
  ElMessageBox.confirm(`确定要删除吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleteFlcProcureReturn(row);
      handleQuery();
      ElMessage.success("删除成功");
    })
    .catch(() => { });
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

const sysUserReturnerDropdownList = ref<any>([]);
const getSysUserReturnerDropdownList = async () => {
  let list = await getSysUserReturnerDropdown();
  sysUserReturnerDropdownList.value = list.data.result ?? [];
};
getSysUserReturnerDropdownList();

handleQuery();
</script>
<style scoped>
:deep(.el-ipnut),
:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}
</style>
