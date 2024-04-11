import request from '/@/utils/request';
enum Api {
  AddFlcProcureReturn = '/api/flcProcureReturn/add',
  DeleteFlcProcureReturn = '/api/flcProcureReturn/delete',
  UpdateFlcProcureReturn = '/api/flcProcureReturn/update',
  PageFlcProcureReturn = '/api/flcProcureReturn/page',
  DetailFlcProcureReturn = '/api/flcProcureReturn/detail',
  ListFlcProcureReturnDetail = '/api/FlcProcureReturnDetail/List',
  UpdateFlcProcureReturnDetail = '/api/FlcProcureReturnDetail/Update',
  GetFlcSupplierInfoSupplierIdDropdown = '/api/flcProcure/FlcSupplierInfoSupplierIdDropdown',
  GetSysUserReturnerDropdown = '/api/flcProcureReturn/SysUserReturnerDropdown',
  GetSysUserReviewerDropdown = '/api/flcProcureReturn/SysUserReviewerDropdown',
  ExamineFlcProcureReturn = '/api/flcProcureReturn/Examine',
  ConfirmFlcProcureReturn = '/api/flcProcureReturn/Confirm',
}

// 增加采购退货列表
export const addFlcProcureReturn = (params?: any) =>
	request({
		url: Api.AddFlcProcureReturn,
		method: 'post',
		data: params,
	});

// 删除采购退货列表
export const deleteFlcProcureReturn = (params?: any) => 
	request({
			url: Api.DeleteFlcProcureReturn,
			method: 'post',
			data: params,
		});

// 编辑采购退货列表
export const updateFlcProcureReturn = (params?: any) => 
	request({
			url: Api.UpdateFlcProcureReturn,
			method: 'post',
			data: params,
		});

// 分页查询采购退货列表
export const pageFlcProcureReturn = (params?: any) => 
	request({
			url: Api.PageFlcProcureReturn,
			method: 'post',
			data: params,
		});
// 跟新采购退货明细
export const updateFlcProcureReturnDetail = (params?: any) => 
	request({
			url: Api.UpdateFlcProcureReturnDetail,
			method: 'post',
			data: params,
		});
// 详情采购退货列表
export const detailFlcProcureReturn = (id: any) => 
	request({
			url: Api.DetailFlcProcureReturn,
			method: 'get',
			data: { id },
		});
// 详情采购明细列表
export const listFlcProcureReturnDetail = (id: any) => 
request({
		url: Api.ListFlcProcureReturnDetail,
		method: 'get',
		data: { ReturnId:id },
	});
	export const examineFlcProcureReturn = (params?: any) => 
	request({
			url: Api.ExamineFlcProcureReturn,
			method: 'post',
			data: params,
		});
export const confirmFlcProcureReturn = (id: any) => 
	request({
			url: Api.ConfirmFlcProcureReturn,
			method: 'get',
			data: { id },
		});
export const getFlcSupplierInfoSupplierIdDropdown = () =>
	request({
	url: Api.GetFlcSupplierInfoSupplierIdDropdown,
	method: 'get'
	});
export const getSysUserReturnerDropdown = () =>
		request({
		url: Api.GetSysUserReturnerDropdown,
		method: 'get'
		});
export const getSysUserReviewerDropdown = () =>
		request({
		url: Api.GetSysUserReviewerDropdown,
		method: 'get'
		});

