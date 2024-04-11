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

 /**
 * 授权角色菜单
 *
 * @export
 * @interface RoleMenuInput
 */
export interface RoleMenuInput {

    /**
     * 主键Id
     *
     * @type {number}
     * @memberof RoleMenuInput
     */
    id: number;

    /**
     * 菜单Id集合
     *
     * @type {Array<number>}
     * @memberof RoleMenuInput
     */
    menuIdList?: Array<number> | null;
}
