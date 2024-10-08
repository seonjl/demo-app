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
 * @interface OperationIab9v4baovnRequest
 */
export interface OperationIab9v4baovnRequest {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof OperationIab9v4baovnRequest
     */
    fileId: string;
    /**
     * 
     * @type {string}
     * @memberof OperationIab9v4baovnRequest
     */
    name?: string;
}

/**
 * Check if a given object implements the OperationIab9v4baovnRequest interface.
 */
export function instanceOfOperationIab9v4baovnRequest(value: object): value is OperationIab9v4baovnRequest {
    if (!('fileId' in value) || value['fileId'] === undefined) return false;
    return true;
}

export function OperationIab9v4baovnRequestFromJSON(json: any): OperationIab9v4baovnRequest {
    return OperationIab9v4baovnRequestFromJSONTyped(json, false);
}

export function OperationIab9v4baovnRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationIab9v4baovnRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'fileId': json['file_id'],
        'name': json['name'] == null ? undefined : json['name'],
    };
}

export function OperationIab9v4baovnRequestToJSON(value?: OperationIab9v4baovnRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'file_id': value['fileId'],
        'name': value['name'],
    };
}

