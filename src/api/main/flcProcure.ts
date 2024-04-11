import request from '/@/utils/request';
enum Api {
  AddFlcProcure = '/api/flcProcure/add',
  DeleteFlcProcure = '/api/flcProcure/delete',
  UpdateFlcProcure = '/api/flcProcure/update',
  PageFlcProcure = '/api/flcProcure/page',
  DetailFlcProcure = '/api/flcProcure/detail',
  ExamineFlcProcure = '/api/flcProcure/Examine',
  GetFlcSupplierInfoSupplierIdDropdown = '/api/flcProcure/FlcSupplierInfoSupplierIdDropdown',
  GetSysUserPurchaserDropdown = '/api/flcProcure/SysUserPurchaserDropdown',
  GetSysUserReviewerDropdown = '/api/flcProcure/SysUserReviewerDropdown',
}

// 增加采购订货列表
export const addFlcProcure = (params?: any) =>
	request({
		url: Api.AddFlcProcure,
		method: 'post',
		data: params,
	});

// 删除采购订货列表
export const deleteFlcProcure = (params?: any) => 
	request({
			url: Api.DeleteFlcProcure,
			method: 'post',
			data: params,
		});

// 编辑采购订货列表
export const updateFlcProcure = (params?: any) => 
	request({
			url: Api.UpdateFlcProcure,
			method: 'post',
			data: params,
		});

// 分页查询采购订货列表
export const pageFlcProcure = (params?: any) => 
	request({
			url: Api.PageFlcProcure,
			method: 'post',
			data: params,
		});

// 详情采购订货列表
export const detailFlcProcure = (id: any) => 
	request({
			url: Api.DetailFlcProcure,
			method: 'get',
			data: { id },
		});
// 审核订单
export const examineFlcProcure = (params?: any) => 
request({
		url: Api.ExamineFlcProcure,
		method: 'post',
		data: params,
	});


export const getFlcSupplierInfoSupplierIdDropdown = () =>
		request({
		url: Api.GetFlcSupplierInfoSupplierIdDropdown,
		method: 'get'
		});
export const getSysUserPurchaserDropdown = () =>
		request({
		url: Api.GetSysUserPurchaserDropdown,
		method: 'get'
		});
export const getSysUserReviewerDropdown = () =>
		request({
		url: Api.GetSysUserReviewerDropdown,
		method: 'get'
		});

