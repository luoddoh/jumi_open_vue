import request from '/@/utils/request';
enum Api {
  AddFlcSupplierInfo = '/api/flcSupplierInfo/add',
  DeleteFlcSupplierInfo = '/api/flcSupplierInfo/delete',
  UpdateFlcSupplierInfo = '/api/flcSupplierInfo/update',
  PageFlcSupplierInfo = '/api/flcSupplierInfo/page',
  DetailFlcSupplierInfo = '/api/flcSupplierInfo/detail',
  GetFlcCategorySupplierTree = '/api/flcCategorySupplier/FlcCategorySupplierTree',
}

// 增加供应商信息
export const addFlcSupplierInfo = (params?: any) =>
	request({
		url: Api.AddFlcSupplierInfo,
		method: 'post',
		data: params,
	});

// 删除供应商信息
export const deleteFlcSupplierInfo = (params?: any) => 
	request({
			url: Api.DeleteFlcSupplierInfo,
			method: 'post',
			data: params,
		});

// 编辑供应商信息
export const updateFlcSupplierInfo = (params?: any) => 
	request({
			url: Api.UpdateFlcSupplierInfo,
			method: 'post',
			data: params,
		});

// 分页查询供应商信息
export const pageFlcSupplierInfo = (params?: any) => 
	request({
			url: Api.PageFlcSupplierInfo,
			method: 'post',
			data: params,
		});

// 详情供应商信息
export const detailFlcSupplierInfo = (id: any) => 
	request({
			url: Api.DetailFlcSupplierInfo,
			method: 'get',
			data: { id },
		});

export const getFlcCategorySupplierTree = () =>
		request({
		url: Api.GetFlcCategorySupplierTree,
		method: 'get'
		});

