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
 * @interface OperationZfn9mp4ceflRequest
 */
export interface OperationZfn9mp4ceflRequest {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof OperationZfn9mp4ceflRequest
     */
    fileId: string;
    /**
     * 
     * @type {string}
     * @memberof OperationZfn9mp4ceflRequest
     */
    name?: string;
}

/**
 * Check if a given object implements the OperationZfn9mp4ceflRequest interface.
 */
export function instanceOfOperationZfn9mp4ceflRequest(value: object): value is OperationZfn9mp4ceflRequest {
    if (!('fileId' in value) || value['fileId'] === undefined) return false;
    return true;
}

export function OperationZfn9mp4ceflRequestFromJSON(json: any): OperationZfn9mp4ceflRequest {
    return OperationZfn9mp4ceflRequestFromJSONTyped(json, false);
}

export function OperationZfn9mp4ceflRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationZfn9mp4ceflRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'fileId': json['file_id'],
        'name': json['name'] == null ? undefined : json['name'],
    };
}

export function OperationZfn9mp4ceflRequestToJSON(value?: OperationZfn9mp4ceflRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'file_id': value['fileId'],
        'name': value['name'],
    };
}

