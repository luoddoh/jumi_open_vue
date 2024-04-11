/* tslint:disable */
/* eslint-disable */
/**
 * Admin.NET 通用权限开发平台
 * 让 .NET 开发更简单、更通用、更流行。前后端分离架构(.NET6/Vue3)，开箱即用紧随前沿技术。<br/><a href='https://gitee.com/zuohuaijun/Admin.NET/'>https://gitee.com/zuohuaijun/Admin.NET</a>
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { YesNoEnum } from './yes-no-enum';
 /**
 * 
 *
 * @export
 * @interface AddConfigInput
 */
export interface AddConfigInput {

    /**
     * 雪花Id
     *
     * @type {number}
     * @memberof AddConfigInput
     */
    id?: number;

    /**
     * 创建时间
     *
     * @type {Date}
     * @memberof AddConfigInput
     */
    createTime?: Date | null;

    /**
     * 更新时间
     *
     * @type {Date}
     * @memberof AddConfigInput
     */
    updateTime?: Date | null;

    /**
     * 创建者Id
     *
     * @type {number}
     * @memberof AddConfigInput
     */
    createUserId?: number | null;

    /**
     * 创建者姓名
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    createUserName?: string | null;

    /**
     * 修改者Id
     *
     * @type {number}
     * @memberof AddConfigInput
     */
    updateUserId?: number | null;

    /**
     * 修改者姓名
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    updateUserName?: string | null;

    /**
     * 软删除
     *
     * @type {boolean}
     * @memberof AddConfigInput
     */
    isDelete?: boolean;

    /**
     * 名称
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    name: string;

    /**
     * 编码
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    code?: string | null;

    /**
     * 属性值
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    value?: string | null;

    /**
     * @type {YesNoEnum}
     * @memberof AddConfigInput
     */
    sysFlag?: YesNoEnum;

    /**
     * 分组编码
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    groupCode?: string | null;

    /**
     * 排序
     *
     * @type {number}
     * @memberof AddConfigInput
     */
    orderNo?: number;

    /**
     * 备注
     *
     * @type {string}
     * @memberof AddConfigInput
     */
    remark?: string | null;
}
