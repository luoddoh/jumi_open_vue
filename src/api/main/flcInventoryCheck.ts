import request from '/@/utils/request';
enum Api {
  AddFlcInventoryCheck = '/api/flcInventoryCheck/add',
  DeleteFlcInventoryCheck = '/api/flcInventoryCheck/delete',
  UpdateFlcInventoryCheck = '/api/flcInventoryCheck/update',
  PageFlcInventoryCheck = '/api/flcInventoryCheck/page',
  DetailFlcInventoryCheck = '/api/flcInventoryCheck/detail',
  GetSysUserCheckPeopleDropdown = '/api/flcInventoryCheck/SysUserCheckPeopleDropdown',
  GetSysUserReviewerDropdown = '/api/flcInventoryCheck/SysUserReviewerDropdown',
  ExamineFlcInventoryCheck = '/api/flcInventoryCheck/examine',
  ConfirmFlcInventoryCheck='/api/flcInventoryCheck/confirm',
  ListFlcInventoryCheckDetail='/api/flcInventoryCheckDetail/List',
  UpdateFlcInventoryCheckDetail='/api/flcInventoryCheckDetail/update',
}

// 增加盘点单
export const addFlcInventoryCheck = (params?: any) =>
	request({
		url: Api.AddFlcInventoryCheck,
		method: 'post',
		data: params,
	});

// 删除盘点单
export const deleteFlcInventoryCheck = (params?: any) => 
	request({
			url: Api.DeleteFlcInventoryCheck,
			method: 'post',
			data: params,
		});

// 编辑盘点单
export const updateFlcInventoryCheck = (params?: any) => 
	request({
			url: Api.UpdateFlcInventoryCheck,
			method: 'post',
			data: params,
		});

// 分页查询盘点单
export const pageFlcInventoryCheck = (params?: any) => 
	request({
			url: Api.PageFlcInventoryCheck,
			method: 'post',
			data: params,
		});

// 详情盘点单
export const detailFlcInventoryCheck = (id: any) => 
	request({
			url: Api.DetailFlcInventoryCheck,
			method: 'get',
			data: { id },
		});

export const getSysUserCheckPeopleDropdown = () =>
		request({
		url: Api.GetSysUserCheckPeopleDropdown,
		method: 'get'
		});
export const getSysUserReviewerDropdown = () =>
		request({
		url: Api.GetSysUserReviewerDropdown,
		method: 'get'
		});

// 盘点单审核
export const examineFlcInventoryCheck = (params?: any) => 
	request({
			url: Api.ExamineFlcInventoryCheck,
			method: 'post',
			data: params,
		});
// 确认盘点
export const confirmFlcInventoryCheck = (id?: any) => 
	request({
			url: Api.ConfirmFlcInventoryCheck,
			method: 'post',
			data: {
				id
			},
		});
// 对应盘点单明细
export const listFlcInventoryCheckDetail = (id: any) => 
	request({
			url: Api.ListFlcInventoryCheckDetail,
			method: 'get',
			data: { CheckId:id },
		});
// 跟新盘点单明细
export const updateFlcInventoryOutDetail = (params?: any) => 
	request({
			url: Api.UpdateFlcInventoryCheckDetail,
			method: 'post',
			data: params,
		});

