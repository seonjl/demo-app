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
 * @interface UploadFileRequest
 */
export interface UploadFileRequest {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof UploadFileRequest
     */
    name: string;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof UploadFileRequest
     */
    metadata?: { [key: string]: string; };
}

/**
 * Check if a given object implements the UploadFileRequest interface.
 */
export function instanceOfUploadFileRequest(value: object): value is UploadFileRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function UploadFileRequestFromJSON(json: any): UploadFileRequest {
    return UploadFileRequestFromJSONTyped(json, false);
}

export function UploadFileRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UploadFileRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'name': json['name'],
        'metadata': json['metadata'] == null ? undefined : json['metadata'],
    };
}

export function UploadFileRequestToJSON(value?: UploadFileRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'name': value['name'],
        'metadata': value['metadata'],
    };
}

