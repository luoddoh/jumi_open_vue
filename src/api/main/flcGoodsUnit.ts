import request from '/@/utils/request';
enum Api {
  AddFlcGoodsUnit = '/api/flcGoodsUnit/add',
  DeleteFlcGoodsUnit = '/api/flcGoodsUnit/delete',
  UpdateFlcGoodsUnit = '/api/flcGoodsUnit/update',
  PageFlcGoodsUnit = '/api/flcGoodsUnit/page',
  DetailFlcGoodsUnit = '/api/flcGoodsUnit/detail',
}

// 增加商品单位
export const addFlcGoodsUnit = (params?: any) =>
	request({
		url: Api.AddFlcGoodsUnit,
		method: 'post',
		data: params,
	});

// 删除商品单位
export const deleteFlcGoodsUnit = (params?: any) => 
	request({
			url: Api.DeleteFlcGoodsUnit,
			method: 'post',
			data: params,
		});

// 编辑商品单位
export const updateFlcGoodsUnit = (params?: any) => 
	request({
			url: Api.UpdateFlcGoodsUnit,
			method: 'post',
			data: params,
		});

// 分页查询商品单位
export const pageFlcGoodsUnit = (params?: any) => 
	request({
			url: Api.PageFlcGoodsUnit,
			method: 'post',
			data: params,
		});

// 详情商品单位
export const detailFlcGoodsUnit = (id: any) => 
	request({
			url: Api.DetailFlcGoodsUnit,
			method: 'get',
			data: { id },
		});


