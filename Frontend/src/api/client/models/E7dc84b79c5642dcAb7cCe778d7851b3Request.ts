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
 * @interface E7dc84b79c5642dcAb7cCe778d7851b3Request
 */
export interface E7dc84b79c5642dcAb7cCe778d7851b3Request {
    [key: string]: any | any;
    /**
     * refresh_token
     * @type {string}
     * @memberof E7dc84b79c5642dcAb7cCe778d7851b3Request
     */
    token: string;
}

/**
 * Check if a given object implements the E7dc84b79c5642dcAb7cCe778d7851b3Request interface.
 */
export function instanceOfE7dc84b79c5642dcAb7cCe778d7851b3Request(value: object): value is E7dc84b79c5642dcAb7cCe778d7851b3Request {
    if (!('token' in value) || value['token'] === undefined) return false;
    return true;
}

export function E7dc84b79c5642dcAb7cCe778d7851b3RequestFromJSON(json: any): E7dc84b79c5642dcAb7cCe778d7851b3Request {
    return E7dc84b79c5642dcAb7cCe778d7851b3RequestFromJSONTyped(json, false);
}

export function E7dc84b79c5642dcAb7cCe778d7851b3RequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): E7dc84b79c5642dcAb7cCe778d7851b3Request {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'token': json['token'],
    };
}

export function E7dc84b79c5642dcAb7cCe778d7851b3RequestToJSON(value?: E7dc84b79c5642dcAb7cCe778d7851b3Request | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'token': value['token'],
    };
}

