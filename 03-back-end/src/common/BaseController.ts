import { IServices } from "./IApplicationResources.interface";

export default abstract class BaseController {
    private serviceInstance : IServices;

    constructor(services: IServices) {
        this.serviceInstance = services;
    }

    protected get services(): IServices {
        return this.serviceInstance;
    }
}