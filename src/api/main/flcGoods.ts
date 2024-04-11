import request from '/@/utils/request';
enum Api {
  AddFlcGoods = '/api/flcGoods/add',
  DeleteFlcGoods = '/api/flcGoods/delete',
  UpdateFlcGoods = '/api/flcGoods/update',
  PageFlcGoods = '/api/flcGoods/page',
  DetailFlcGoods = '/api/flcGoods/detail',
  GetFlcCategoryTree = '/api/flcGoods/FlcCategoryTree',
}

// 增加商品信息
export const addFlcGoods = (params?: any) =>
	request({
		url: Api.AddFlcGoods,
		method: 'post',
		data: params,
	});

// 删除商品信息
export const deleteFlcGoods = (params?: any) => 
	request({
			url: Api.DeleteFlcGoods,
			method: 'post',
			data: params,
		});

// 编辑商品信息
export const updateFlcGoods = (params?: any) => 
	request({
			url: Api.UpdateFlcGoods,
			method: 'post',
			data: params,
		});

// 分页查询商品信息
export const pageFlcGoods = (params?: any) => 
	request({
			url: Api.PageFlcGoods,
			method: 'post',
			data: params,
		});

// 详情商品信息
export const detailFlcGoods = (id: any) => 
	request({
			url: Api.DetailFlcGoods,
			method: 'get',
			data: { id },
		});

export const getFlcCategoryTree = () =>
		request({
		url: Api.GetFlcCategoryTree,
		method: 'get'
		});

