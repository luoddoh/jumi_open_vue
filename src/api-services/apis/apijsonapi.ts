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

import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { AdminResultJObject } from '../models';
import { JToken } from '../models';
/**
 * APIJSONApi - axios parameter creator
 * @export
 */
export const APIJSONApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 参数：{\"[]\":{\"SYS_LOG_OP\":{}}}
         * @summary 统一入口
         * @param {{ [key: string]: JToken; }} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAPIJSONPost: async (body?: { [key: string]: JToken; }, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/aPIJSON`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            if (configuration && configuration.accessToken) {
                const accessToken = typeof configuration.accessToken === 'function'
                    ? await configuration.accessToken()
                    : await configuration.accessToken;
                localVarHeaderParameter["Authorization"] = "Bearer " + accessToken;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json-patch+json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * APIJSONApi - functional programming interface
 * @export
 */
export const APIJSONApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 参数：{\"[]\":{\"SYS_LOG_OP\":{}}}
         * @summary 统一入口
         * @param {{ [key: string]: JToken; }} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAPIJSONPost(body?: { [key: string]: JToken; }, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<AdminResultJObject>>> {
            const localVarAxiosArgs = await APIJSONApiAxiosParamCreator(configuration).apiAPIJSONPost(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * APIJSONApi - factory interface
 * @export
 */
export const APIJSONApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 参数：{\"[]\":{\"SYS_LOG_OP\":{}}}
         * @summary 统一入口
         * @param {{ [key: string]: JToken; }} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAPIJSONPost(body?: { [key: string]: JToken; }, options?: AxiosRequestConfig): Promise<AxiosResponse<AdminResultJObject>> {
            return APIJSONApiFp(configuration).apiAPIJSONPost(body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * APIJSONApi - object-oriented interface
 * @export
 * @class APIJSONApi
 * @extends {BaseAPI}
 */
export class APIJSONApi extends BaseAPI {
    /**
     * 参数：{\"[]\":{\"SYS_LOG_OP\":{}}}
     * @summary 统一入口
     * @param {{ [key: string]: JToken; }} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof APIJSONApi
     */
    public async apiAPIJSONPost(body?: { [key: string]: JToken; }, options?: AxiosRequestConfig) : Promise<AxiosResponse<AdminResultJObject>> {
        return APIJSONApiFp(this.configuration).apiAPIJSONPost(body, options).then((request) => request(this.axios, this.basePath));
    }
}
