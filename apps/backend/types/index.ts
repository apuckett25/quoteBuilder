import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request extends ExpressRequest {
    // Custom properties can be added here
}

export interface Response extends ExpressResponse {
    // Custom properties can be added here
}