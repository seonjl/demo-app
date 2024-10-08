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
 * @interface ListTasks200ResponseInner
 */
export interface ListTasks200ResponseInner {
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    userEmail: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    taskId: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    taskStatus: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    dueDate: string;
    /**
     * 
     * @type {string}
     * @memberof ListTasks200ResponseInner
     */
    createdAt: string;
}

/**
 * Check if a given object implements the ListTasks200ResponseInner interface.
 */
export function instanceOfListTasks200ResponseInner(value: object): value is ListTasks200ResponseInner {
    if (!('userEmail' in value) || value['userEmail'] === undefined) return false;
    if (!('taskId' in value) || value['taskId'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('taskStatus' in value) || value['taskStatus'] === undefined) return false;
    if (!('dueDate' in value) || value['dueDate'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    return true;
}

export function ListTasks200ResponseInnerFromJSON(json: any): ListTasks200ResponseInner {
    return ListTasks200ResponseInnerFromJSONTyped(json, false);
}

export function ListTasks200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListTasks200ResponseInner {
    if (json == null) {
        return json;
    }
    return {
        
        'userEmail': json['user_email'],
        'taskId': json['task_id'],
        'title': json['title'],
        'description': json['description'],
        'taskStatus': json['task_status'],
        'dueDate': json['due_date'],
        'createdAt': json['created_at'],
    };
}

export function ListTasks200ResponseInnerToJSON(value?: ListTasks200ResponseInner | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'user_email': value['userEmail'],
        'task_id': value['taskId'],
        'title': value['title'],
        'description': value['description'],
        'task_status': value['taskStatus'],
        'due_date': value['dueDate'],
        'created_at': value['createdAt'],
    };
}

