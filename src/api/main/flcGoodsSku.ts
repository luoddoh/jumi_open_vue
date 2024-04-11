import request from '/@/utils/request';
enum Api {
  AddFlcGoodsSku = '/api/flcGoodsSku/add',
  DeleteFlcGoodsSku = '/api/flcGoodsSku/delete',
  UpdateFlcGoodsSku = '/api/flcGoodsSku/update',
  PageFlcGoodsSku = '/api/flcGoodsSku/page',
  DetailFlcGoodsSku = '/api/flcGoodsSku/detail',
}

// 增加商品sku表
export const addFlcGoodsSku = (params?: any) =>
	request({
		url: Api.AddFlcGoodsSku,
		method: 'post',
		data: params,
	});

// 删除商品sku表
export const deleteFlcGoodsSku = (params?: any) => 
	request({
			url: Api.DeleteFlcGoodsSku,
			method: 'post',
			data: params,
		});

// 编辑商品sku表
export const updateFlcGoodsSku = (params?: any) => 
	request({
			url: Api.UpdateFlcGoodsSku,
			method: 'post',
			data: params,
		});

// 分页查询商品sku表
export const pageFlcGoodsSku = (params?: any) => 
	request({
			url: Api.PageFlcGoodsSku,
			method: 'post',
			data: params,
		});

// 详情商品sku表
export const detailFlcGoodsSku = (id: any) => 
	request({
			url: Api.DetailFlcGoodsSku,
			method: 'get',
			data: { id },
		});


