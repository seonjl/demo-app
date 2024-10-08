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
 * @interface CreateIssueRequest
 */
export interface CreateIssueRequest {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof CreateIssueRequest
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof CreateIssueRequest
     */
    description: string;
}

/**
 * Check if a given object implements the CreateIssueRequest interface.
 */
export function instanceOfCreateIssueRequest(value: object): value is CreateIssueRequest {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    return true;
}

export function CreateIssueRequestFromJSON(json: any): CreateIssueRequest {
    return CreateIssueRequestFromJSONTyped(json, false);
}

export function CreateIssueRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateIssueRequest {
    if (json == null) {
        return json;
    }
    return {
        
            ...json,
        'title': json['title'],
        'description': json['description'],
    };
}

export function CreateIssueRequestToJSON(value?: CreateIssueRequest | null): any {
    if (value == null) {
        return value;
    }
    return {
        
            ...value,
        'title': value['title'],
        'description': value['description'],
    };
}

