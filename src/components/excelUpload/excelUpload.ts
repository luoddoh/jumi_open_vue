import request from '/@/utils/request';
enum Api{
    UploadExcelFile = '/api/flcGoods/excel',
	DateSaveExcelFile = '/api/flcGoods/dateSave',
}
export const uploadExcelFile = (params?: any) =>
	request({
		url: Api.UploadExcelFile,
		method: 'post',
		data: params,
		headers: {'Content-Type': 'multipart/form-data'},
		timeout: 300000,
	});
	export const dateSaveExcelFile = (params?: any) =>
	request({
		url: Api.DateSaveExcelFile,
		method: 'post',
		data: params,
	});