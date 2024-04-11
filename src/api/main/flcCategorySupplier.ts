import request from '/@/utils/request';
enum Api {
  AddFlcCategorySupplier = '/api/flcCategorySupplier/add',
  DeleteFlcCategorySupplier = '/api/flcCategorySupplier/delete',
  UpdateFlcCategorySupplier = '/api/flcCategorySupplier/update',
  PageFlcCategorySupplier = '/api/flcCategorySupplier/page',
  DetailFlcCategorySupplier = '/api/flcCategorySupplier/detail',
  GetFlcCategorySupplierTree = '/api/flcCategorySupplier/FlcCategorySupplierTree',
}

// 增加供应商分类
export const addFlcCategorySupplier = (params?: any) =>
	request({
		url: Api.AddFlcCategorySupplier,
		method: 'post',
		data: params,
	});

// 删除供应商分类
export const deleteFlcCategorySupplier = (params?: any) => 
	request({
			url: Api.DeleteFlcCategorySupplier,
			method: 'post',
			data: params,
		});

// 编辑供应商分类
export const updateFlcCategorySupplier = (params?: any) => 
	request({
			url: Api.UpdateFlcCategorySupplier,
			method: 'post',
			data: params,
		});

// 分页查询供应商分类
export const pageFlcCategorySupplier = (params?: any) => 
	request({
			url: Api.PageFlcCategorySupplier,
			method: 'post',
			data: params,
		});

// 详情供应商分类
export const detailFlcCategorySupplier = (id: any) => 
	request({
			url: Api.DetailFlcCategorySupplier,
			method: 'get',
			data: { id },
		});

export const getFlcCategorySupplierTree = () =>
		request({
		url: Api.GetFlcCategorySupplierTree,
		method: 'get'
		});

