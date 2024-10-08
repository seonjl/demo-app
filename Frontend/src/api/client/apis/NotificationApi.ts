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


import * as runtime from '../runtime';
import type {
  ListNotifications200ResponseInner,
  V1AuthGoogleRevokePost200Response,
} from '../models/index';
import {
    ListNotifications200ResponseInnerFromJSON,
    ListNotifications200ResponseInnerToJSON,
    V1AuthGoogleRevokePost200ResponseFromJSON,
    V1AuthGoogleRevokePost200ResponseToJSON,
} from '../models/index';

export interface ReadNotificationRequest {
    notificationId: string;
    requestBody: { [key: string]: any; };
}

/**
 * 
 */
export class NotificationApi extends runtime.BaseAPI {

    /**
     * list a notification
     * Notification.list
     */
    async listNotificationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ListNotifications200ResponseInner>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/v1/notifications`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ListNotifications200ResponseInnerFromJSON));
    }

    /**
     * list a notification
     * Notification.list
     */
    async listNotifications(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ListNotifications200ResponseInner>> {
        const response = await this.listNotificationsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Read a notification
     * Notification.read
     */
    async readNotificationRaw(requestParameters: ReadNotificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<V1AuthGoogleRevokePost200Response>> {
        if (requestParameters['notificationId'] == null) {
            throw new runtime.RequiredError(
                'notificationId',
                'Required parameter "notificationId" was null or undefined when calling readNotification().'
            );
        }

        if (requestParameters['requestBody'] == null) {
            throw new runtime.RequiredError(
                'requestBody',
                'Required parameter "requestBody" was null or undefined when calling readNotification().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/v1/notifications/{notificationId}/read`.replace(`{${"notificationId"}}`, encodeURIComponent(String(requestParameters['notificationId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['requestBody'],
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => V1AuthGoogleRevokePost200ResponseFromJSON(jsonValue));
    }

    /**
     * Read a notification
     * Notification.read
     */
    async readNotification(requestParameters: ReadNotificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<V1AuthGoogleRevokePost200Response> {
        const response = await this.readNotificationRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
