/* tslint:disable */
/* eslint-disable */
/**
 * API Documentation
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  GetMe200Response,
} from '../models/index';
import {
    GetMe200ResponseFromJSON,
    GetMe200ResponseToJSON,
} from '../models/index';

/**
 * 
 */
export class MeApi extends runtime.BaseAPI {

    /**
     * Get my information
     * Me.get
     */
    async getMeRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetMe200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/v1/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetMe200ResponseFromJSON(jsonValue));
    }

    /**
     * Get my information
     * Me.get
     */
    async getMe(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetMe200Response> {
        const response = await this.getMeRaw(initOverrides);
        return await response.value();
    }

}
