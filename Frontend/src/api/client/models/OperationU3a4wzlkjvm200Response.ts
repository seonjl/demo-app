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
 * @interface OperationU3a4wzlkjvm200Response
 */
export interface OperationU3a4wzlkjvm200Response {
    /**
     * 
     * @type {string}
     * @memberof OperationU3a4wzlkjvm200Response
     */
    url?: string;
}

/**
 * Check if a given object implements the OperationU3a4wzlkjvm200Response interface.
 */
export function instanceOfOperationU3a4wzlkjvm200Response(value: object): value is OperationU3a4wzlkjvm200Response {
    return true;
}

export function OperationU3a4wzlkjvm200ResponseFromJSON(json: any): OperationU3a4wzlkjvm200Response {
    return OperationU3a4wzlkjvm200ResponseFromJSONTyped(json, false);
}

export function OperationU3a4wzlkjvm200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationU3a4wzlkjvm200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function OperationU3a4wzlkjvm200ResponseToJSON(value?: OperationU3a4wzlkjvm200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

