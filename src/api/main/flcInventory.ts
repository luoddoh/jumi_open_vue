import request from '/@/utils/request';
enum Api {
  AddFlcInventory = '/api/flcInventory/add',
  DeleteFlcInventory = '/api/flcInventory/delete',
  UpdateFlcInventory = '/api/flcInventory/update',
  PageFlcInventory = '/api/flcInventory/page',
  DetailFlcInventory = '/api/flcInventory/detail',
  GetFlcGoodsSkuSkuIdDropdown = '/api/flcInventory/FlcGoodsSkuSkuIdDropdown',
}

// 增加库存查询
export const addFlcInventory = (params?: any) =>
	request({
		url: Api.AddFlcInventory,
		method: 'post',
		data: params,
	});

// 删除库存查询
export const deleteFlcInventory = (params?: any) => 
	request({
			url: Api.DeleteFlcInventory,
			method: 'post',
			data: params,
		});

// 编辑库存查询
export const updateFlcInventory = (params?: any) => 
	request({
			url: Api.UpdateFlcInventory,
			method: 'post',
			data: params,
		});

// 分页查询库存查询
export const pageFlcInventory = (params?: any) => 
	request({
			url: Api.PageFlcInventory,
			method: 'post',
			data: params,
		});

// 详情库存查询
export const detailFlcInventory = (id: any) => 
	request({
			url: Api.DetailFlcInventory,
			method: 'get',
			data: { id },
		});

export const getFlcGoodsSkuSkuIdDropdown = () =>
		request({
		url: Api.GetFlcGoodsSkuSkuIdDropdown,
		method: 'get'
		});

