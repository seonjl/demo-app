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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface V1AuthGoogleRefreshPostRequest
 */
export interface V1AuthGoogleRefreshPostRequest {
    [key: string]: any | any;
    /**
     * refresh_token
     * @type {string}
     * @memberof V1AuthGoogleRefreshPostRequest
     */
    token: string;
}

/**
 * Check if a given object implements the V1AuthGoogleRefreshPostRequest interface.
 */
export function instanceOfV1AuthGoogleRefreshPostRequest(value: object): value is V1AuthGoogleRefreshPostRequest {
    if (!('token' in value) || value['token'] === undefined) return false;
    return true;
}

export function V1AuthGoogleRefreshPostRequestFromJSON(json: any): V1AuthGoogleRefreshPostRequest {
    return V1AuthGoogleRefreshPostRequestFromJSONTyped(json, false);
}

export function V1AuthGoogleRefreshPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1AuthGoogleRefreshPostRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'token': json['token'],
    };
}

export function V1AuthGoogleRefreshPostRequestToJSON(value?: V1AuthGoogleRefreshPostRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'token': value['token'],
    };
}

