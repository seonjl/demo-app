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
 * @interface GoogleAuthorize200Response
 */
export interface GoogleAuthorize200Response {
    /**
     * 
     * @type {string}
     * @memberof GoogleAuthorize200Response
     */
    accessToken: string;
    /**
     * 
     * @type {string}
     * @memberof GoogleAuthorize200Response
     */
    refreshToken: string;
    /**
     * 
     * @type {number}
     * @memberof GoogleAuthorize200Response
     */
    expiresIn: number;
    /**
     * 
     * @type {string}
     * @memberof GoogleAuthorize200Response
     */
    scope: string;
    /**
     * 
     * @type {string}
     * @memberof GoogleAuthorize200Response
     */
    tokenType: string;
    /**
     * 
     * @type {string}
     * @memberof GoogleAuthorize200Response
     */
    email: string;
}

/**
 * Check if a given object implements the GoogleAuthorize200Response interface.
 */
export function instanceOfGoogleAuthorize200Response(value: object): value is GoogleAuthorize200Response {
    if (!('accessToken' in value) || value['accessToken'] === undefined) return false;
    if (!('refreshToken' in value) || value['refreshToken'] === undefined) return false;
    if (!('expiresIn' in value) || value['expiresIn'] === undefined) return false;
    if (!('scope' in value) || value['scope'] === undefined) return false;
    if (!('tokenType' in value) || value['tokenType'] === undefined) return false;
    if (!('email' in value) || value['email'] === undefined) return false;
    return true;
}

export function GoogleAuthorize200ResponseFromJSON(json: any): GoogleAuthorize200Response {
    return GoogleAuthorize200ResponseFromJSONTyped(json, false);
}

export function GoogleAuthorize200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): GoogleAuthorize200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'accessToken': json['access_token'],
        'refreshToken': json['refresh_token'],
        'expiresIn': json['expires_in'],
        'scope': json['scope'],
        'tokenType': json['token_type'],
        'email': json['email'],
    };
}

export function GoogleAuthorize200ResponseToJSON(value?: GoogleAuthorize200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'access_token': value['accessToken'],
        'refresh_token': value['refreshToken'],
        'expires_in': value['expiresIn'],
        'scope': value['scope'],
        'token_type': value['tokenType'],
        'email': value['email'],
    };
}

