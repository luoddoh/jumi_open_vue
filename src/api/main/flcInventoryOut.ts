import request from '/@/utils/request';
enum Api {
  AddFlcInventoryOut = '/api/flcInventoryOut/add',
  DeleteFlcInventoryOut = '/api/flcInventoryOut/delete',
  UpdateFlcInventoryOut = '/api/flcInventoryOut/update',
  PageFlcInventoryOut = '/api/flcInventoryOut/page',
  DetailFlcInventoryOut = '/api/flcInventoryOut/detail',
  UpdateFlcInventoryOutDetail = '/api/flcInventoryOutDetail/update',
  ExamineFlcInventoryOut = '/api/flcInventoryOut/examine',
  ConfirmFlcInventoryOut='/api/flcInventoryOut/confirm',
  ListFlcInventoryOutDetail='/api/flcInventoryOutDetail/List',
  GetSysUserReviewerDropdown = '/api/flcInventoryOut/SysUserReviewerDropdown',
}

// 增加出库单
export const addFlcInventoryOut = (params?: any) =>
	request({
		url: Api.AddFlcInventoryOut,
		method: 'post',
		data: params,
	});

// 删除出库单
export const deleteFlcInventoryOut = (params?: any) => 
	request({
			url: Api.DeleteFlcInventoryOut,
			method: 'post',
			data: params,
		});

// 编辑出库单
export const updateFlcInventoryOut = (params?: any) => 
	request({
			url: Api.UpdateFlcInventoryOut,
			method: 'post',
			data: params,
		});

// 分页查询出库单
export const pageFlcInventoryOut = (params?: any) => 
	request({
			url: Api.PageFlcInventoryOut,
			method: 'post',
			data: params,
		});
// 跟新出库单明细
export const updateFlcInventoryOutDetail = (params?: any) => 
	request({
			url: Api.UpdateFlcInventoryOutDetail,
			method: 'post',
			data: params,
		});
// 出库单审核
export const examineFlcInventoryOut = (params?: any) => 
	request({
			url: Api.ExamineFlcInventoryOut,
			method: 'post',
			data: params,
		});
// 确认出库
export const confirmFlcInventoryOut = (id?: any) => 
	request({
			url: Api.ConfirmFlcInventoryOut,
			method: 'post',
			data: {
				id
			},
		});
// 详情出库单
export const detailFlcInventoryOut = (id: any) => 
	request({
			url: Api.DetailFlcInventoryOut,
			method: 'get',
			data: { id },
		});
// 对应出库单明细
export const listFlcInventoryOutDetail = (id: any) => 
	request({
			url: Api.ListFlcInventoryOutDetail,
			method: 'get',
			data: { OutId:id },
		});

export const getSysUserReviewerDropdown = () =>
		request({
		url: Api.GetSysUserReviewerDropdown,
		method: 'get'
		});

