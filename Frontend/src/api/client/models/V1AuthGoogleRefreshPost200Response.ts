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
 * @interface V1AuthGoogleRefreshPost200Response
 */
export interface V1AuthGoogleRefreshPost200Response {
    /**
     * 
     * @type {string}
     * @memberof V1AuthGoogleRefreshPost200Response
     */
    accessToken?: string;
    /**
     * 
     * @type {number}
     * @memberof V1AuthGoogleRefreshPost200Response
     */
    expiresIn?: number;
    /**
     * 
     * @type {string}
     * @memberof V1AuthGoogleRefreshPost200Response
     */
    tokenType?: string;
    /**
     * 
     * @type {string}
     * @memberof V1AuthGoogleRefreshPost200Response
     */
    scope?: string;
}

/**
 * Check if a given object implements the V1AuthGoogleRefreshPost200Response interface.
 */
export function instanceOfV1AuthGoogleRefreshPost200Response(value: object): value is V1AuthGoogleRefreshPost200Response {
    return true;
}

export function V1AuthGoogleRefreshPost200ResponseFromJSON(json: any): V1AuthGoogleRefreshPost200Response {
    return V1AuthGoogleRefreshPost200ResponseFromJSONTyped(json, false);
}

export function V1AuthGoogleRefreshPost200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1AuthGoogleRefreshPost200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'accessToken': json['access_token'] == null ? undefined : json['access_token'],
        'expiresIn': json['expires_in'] == null ? undefined : json['expires_in'],
        'tokenType': json['token_type'] == null ? undefined : json['token_type'],
        'scope': json['scope'] == null ? undefined : json['scope'],
    };
}

export function V1AuthGoogleRefreshPost200ResponseToJSON(value?: V1AuthGoogleRefreshPost200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'access_token': value['accessToken'],
        'expires_in': value['expiresIn'],
        'token_type': value['tokenType'],
        'scope': value['scope'],
    };
}

