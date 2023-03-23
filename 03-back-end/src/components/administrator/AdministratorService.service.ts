import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import AdministratorModel from "./AdministratorModel.model";
import IAddAdministrator from "./dto/IAddAdministrator.dto";
import IEditAdministrator from "./dto/IEditAdministrator.dto";

export class AdministratorAdapterOptions implements IAdapterOptions {
    removePassword: boolean;
}

export const DefaultAdministartorAdapterOptions: AdministratorAdapterOptions = {
    removePassword: false,
}

export default class AdministratorService extends BaseService<AdministratorModel, AdministratorAdapterOptions> {
    tableName(): string {
        return "administrator";
    }
   

    protected async adaptToModel(data: any, options: AdministratorAdapterOptions = DefaultAdministartorAdapterOptions): Promise<AdministratorModel> {
        const administrator = new AdministratorModel();

        administrator.administratorId = +data?.administrator_id;
        administrator.username        = data?.username;
        administrator.passwordHash    = data?.password_hash;
        administrator.createdAt       = data?.created_at;
        administrator.isActive        = +data?.is_active === 1;

        if (options.removePassword) {
            administrator.passwordHash = null;
        }


        return administrator;
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel> {
        return this.baseAdd(data, DefaultAdministartorAdapterOptions);  
    }
   
    public async edit(id: number, data: IEditAdministrator): Promise<AdministratorModel> {
        return this.baseEditById(id, data, {
            removePassword: true,
        })
    }
    baseEditById(id: number, data: IEditAdministrator, arg2: { removePassword: boolean; }): AdministratorModel | PromiseLike<AdministratorModel> {
        throw new Error("Method not implemented.");
    }
}