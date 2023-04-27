import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import PhotoModel from "./PhotoModel.model";

export interface IPhotoAdapterOptions extends IAdapterOptions{
    
}

export default class PhotoService extends BaseService<PhotoModel, {}> {
    tableName(): string {
        throw new Error("Method not implemented.");
    }
    protected adaptToModel(data: any, options: {}): Promise<PhotoModel> {
        const photo = new PhotoModel();

        return photo;
    }

}