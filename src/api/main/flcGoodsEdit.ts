import request from '/@/utils/request';
enum Api {
  FlcProductSpecificationsList = '/api/flcProductSpecifications/list',
  listFlcGoodsUnit='/api/flcGoodsUnit/list',
  flcCategoryTree='/api/flcCategory/FlcCategoryTree',
  DetailFlcGoods='/api/flcGoods/detail',
  UpdateFlcGoods = '/api/flcGoods/update',
  UpdateFlcGoodsSkuList = '/api/flcGoodsSku/update',
  ListFlcGoodsSku = '/api/flcGoodsSku/ByIdList',
}

// 
export const listFlcProductSpecifications = () =>
	request({
		url: Api.FlcProductSpecificationsList,
		method: 'get',
	});

    export const listFlcGoodsUnit = () =>
	request({
		url: Api.listFlcGoodsUnit,
		method: 'get',
	});

    export const flcCategoryTree = () =>
	request({
		url: Api.flcCategoryTree,
		method: 'get',
	});
// 详情商品信息
export const detailFlcGoods = (id: any) => 
	request({
			url: Api.DetailFlcGoods,
			method: 'get',
			data: { id },
		});
        // 详情sku信息
export const listFlcGoodsSku = (goodsId: any) => 
request({
        url: Api.ListFlcGoodsSku,
        method: 'get',
        data: { goodsId },
    });
// 编辑商品信息
export const uFlcGoods = (params?: any) => 
	request({
			url: Api.UpdateFlcGoods,
			method: 'post',
			data: params,
		});

        // 编辑商品SKU信息
export const updateFlcGoodsSkuList = (params?: any) => 
request({
        url: Api.UpdateFlcGoodsSkuList,
        method: 'post',
        data: params,
    });
