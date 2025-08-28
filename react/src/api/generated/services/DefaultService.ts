/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Retrieve a list of logs
     * Retrieve a list of logs with pagination.
     * @param page The page number to retrieve.
     * @param limit The number of logs to retrieve per page.
     * @param severity Filter logs by severity.
     * @returns any A list of logs.
     * @throws ApiError
     */
    public static getLogs(
        page?: number,
        limit?: number,
        severity?: string,
    ): CancelablePromise<{
        logs?: Array<{
            id?: number;
            json?: Record<string, any>;
            inserted_at?: string;
        }>;
        totalPages?: number;
        currentPage?: number;
        totalLogs?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/logs',
            query: {
                'page': page,
                'limit': limit,
                'severity': severity,
            },
            errors: {
                500: `Internal server error.`,
            },
        });
    }
    /**
     * Create a new log
     * Create a new log entry.
     * @param requestBody
     * @returns any The created log.
     * @throws ApiError
     */
    public static postLogs(
        requestBody: {
            jsonData?: {
                message?: string;
                severity?: string;
            };
        },
    ): CancelablePromise<{
        id?: number;
        json?: Record<string, any>;
        inserted_at?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/logs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request. jsonData is required.`,
                500: `Internal server error.`,
            },
        });
    }
}
