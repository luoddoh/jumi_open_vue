import request from '/@/utils/request';
enum Api {
  AddFlcCategory = '/api/flcCategory/add',
  DeleteFlcCategory = '/api/flcCategory/delete',
  UpdateFlcCategory = '/api/flcCategory/update',
  PageFlcCategory = '/api/flcCategory/page',
  DetailFlcCategory = '/api/flcCategory/detail',
  GetFlcCategoryTree = '/api/flcCategory/FlcCategoryTree',
}

// 增加商品分类
export const addFlcCategory = (params?: any) =>
	request({
		url: Api.AddFlcCategory,
		method: 'post',
		data: params,
	});

// 删除商品分类
export const deleteFlcCategory = (params?: any) => 
	request({
			url: Api.DeleteFlcCategory,
			method: 'post',
			data: params,
		});

// 编辑商品分类
export const updateFlcCategory = (params?: any) => 
	request({
			url: Api.UpdateFlcCategory,
			method: 'post',
			data: params,
		});

// 分页查询商品分类
export const pageFlcCategory = (params?: any) => 
	request({
			url: Api.PageFlcCategory,
			method: 'post',
			data: params,
		});

// 详情商品分类
export const detailFlcCategory = (id: any) => 
	request({
			url: Api.DetailFlcCategory,
			method: 'get',
			data: { id },
		});

export const getFlcCategoryTree = () =>
		request({
		url: Api.GetFlcCategoryTree,
		method: 'get'
		});

