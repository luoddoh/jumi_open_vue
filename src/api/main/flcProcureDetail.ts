import request from '/@/utils/request';
enum Api {
  AddFlcProcureDetail = '/api/flcProcureDetail/add',
  DeleteFlcProcureDetail = '/api/flcProcureDetail/delete',
  UpdateFlcProcureDetail = '/api/flcProcureDetail/update',
  PageFlcProcureDetail = '/api/flcProcureDetail/page',
  ListFlcProcureDetail = '/api/flcProcureDetail/List',
  DetailFlcProcureDetail = '/api/flcProcureDetail/detail',
  PrintFlcProcureDetail = '/api/flcProcureDetail/Print',
  GetFlcProcureProcureIdDropdown = '/api/flcProcureDetail/FlcProcureProcureIdDropdown',
  GetFlcGoodsGoodsIdDropdown = '/api/flcProcureDetail/FlcGoodsGoodsIdDropdown',
  GetFlcGoodsSkuSkuIdDropdown = '/api/flcProcureDetail/FlcGoodsSkuSkuIdDropdown',
  InspectionFlcProcureDetail='/api/flcProcureDetail/Inspection'
}

// 增加采购明细
export const addFlcProcureDetail = (params?: any) =>
	request({
		url: Api.AddFlcProcureDetail,
		method: 'post',
		data: params,
	});

// 删除采购明细
export const deleteFlcProcureDetail = (params?: any) => 
	request({
			url: Api.DeleteFlcProcureDetail,
			method: 'post',
			data: params,
		});

// 编辑采购明细
export const updateFlcProcureDetail = (params?: any) => 
	request({
			url: Api.UpdateFlcProcureDetail,
			method: 'post',
			data: params,
		});
// 编辑采购明细
export const inspectionFlcProcureDetail = (params?: any) => 
	request({
			url: Api.InspectionFlcProcureDetail,
			method: 'post',
			data: params,
		});
// 分页查询采购明细
export const pageFlcProcureDetail = (params?: any) => 
	request({
			url: Api.PageFlcProcureDetail,
			method: 'post',
			data: params,
		});
// 查询采购明细
export const listFlcProcureDetail = (id?: any) => 
	request({
			url: Api.ListFlcProcureDetail,
			method: 'get',
			data: {
				ProcureId:id
			},
		});

// 详情采购明细
export const detailFlcProcureDetail = (id: any) => 
request({
		url: Api.DetailFlcProcureDetail,
		method: 'get',
		data: { id },
	});
//打印记录
export const printFlcProcureDetail = (id:any,num:any) => 
request({
		url: Api.PrintFlcProcureDetail,
		method: 'get',
		data: { id,num },
	});

export const getFlcProcureProcureIdDropdown = () =>
		request({
		url: Api.GetFlcProcureProcureIdDropdown,
		method: 'get'
		});
export const getFlcGoodsGoodsIdDropdown = () =>
		request({
		url: Api.GetFlcGoodsGoodsIdDropdown,
		method: 'get'
		});
export const getFlcGoodsSkuSkuIdDropdown = () =>
		request({
		url: Api.GetFlcGoodsSkuSkuIdDropdown,
		method: 'get'
		});

