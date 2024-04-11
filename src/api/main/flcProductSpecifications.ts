import request from '/@/utils/request';
enum Api {
  AddFlcProductSpecifications = '/api/flcProductSpecifications/add',
  DeleteFlcProductSpecifications = '/api/flcProductSpecifications/delete',
  UpdateFlcProductSpecifications = '/api/flcProductSpecifications/update',
  PageFlcProductSpecifications = '/api/flcProductSpecifications/page',
  DetailFlcProductSpecifications = '/api/flcProductSpecifications/detail',
}

// 增加商品规格
export const addFlcProductSpecifications = (params?: any) =>
	request({
		url: Api.AddFlcProductSpecifications,
		method: 'post',
		data: params,
	});

// 删除商品规格
export const deleteFlcProductSpecifications = (params?: any) => 
	request({
			url: Api.DeleteFlcProductSpecifications,
			method: 'post',
			data: params,
		});

// 编辑商品规格
export const updateFlcProductSpecifications = (params?: any) => 
	request({
			url: Api.UpdateFlcProductSpecifications,
			method: 'post',
			data: params,
		});

// 分页查询商品规格
export const pageFlcProductSpecifications = (params?: any) => 
	request({
			url: Api.PageFlcProductSpecifications,
			method: 'post',
			data: params,
		});

// 详情商品规格
export const detailFlcProductSpecifications = (id: any) => 
	request({
			url: Api.DetailFlcProductSpecifications,
			method: 'get',
			data: { id },
		});


