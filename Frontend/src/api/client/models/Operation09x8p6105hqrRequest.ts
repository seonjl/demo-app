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
 * @interface Operation09x8p6105hqrRequest
 */
export interface Operation09x8p6105hqrRequest {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof Operation09x8p6105hqrRequest
     */
    fileId: string;
    /**
     * 
     * @type {string}
     * @memberof Operation09x8p6105hqrRequest
     */
    name?: string;
}

/**
 * Check if a given object implements the Operation09x8p6105hqrRequest interface.
 */
export function instanceOfOperation09x8p6105hqrRequest(value: object): value is Operation09x8p6105hqrRequest {
    if (!('fileId' in value) || value['fileId'] === undefined) return false;
    return true;
}

export function Operation09x8p6105hqrRequestFromJSON(json: any): Operation09x8p6105hqrRequest {
    return Operation09x8p6105hqrRequestFromJSONTyped(json, false);
}

export function Operation09x8p6105hqrRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): Operation09x8p6105hqrRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'fileId': json['file_id'],
        'name': json['name'] == null ? undefined : json['name'],
    };
}

export function Operation09x8p6105hqrRequestToJSON(value?: Operation09x8p6105hqrRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'file_id': value['fileId'],
        'name': value['name'],
    };
}

