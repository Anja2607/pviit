import { rejects } from "assert";
import * as mysql2 from "mysql2/promise";
import { resolve } from "path";
import IAdapterOptions from "./IAdapterOptions.interface";
import IApplicationResources, { IServices } from "./IApplicationResources.interface";
import IModel from "./IModel.interface";
import IServiceData from "./IServiceData.interface";

export default abstract class BaseService<ReturnModel extends IModel, AdapterOptions extends IAdapterOptions> {
    private database: mysql2.Connection;
    private serviceInstances: IServices;

    constructor(resources: IApplicationResources) {
        this.database = resources.databaseConnection;
        this.serviceInstances = resources.services;
    }

    protected get db(): mysql2.Connection {
        return this.database;
    }

    protected get services(): IServices {
        return this.serviceInstances;
    }
    
    abstract tableName(): string;

    protected abstract adaptToModel(data: any, options: AdapterOptions): Promise<ReturnModel>;

    public getAll(options: AdapterOptions): Promise<ReturnModel[]> {
        const tableName = this.tableName();
        return new Promise<ReturnModel[]>( 
            (resolve, reject ) => {


                const sql: string = `SELECT * FROM \`${tableName}\`;`;

                this.db.execute(sql)
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve([]);
                        }

                        const items: ReturnModel[] = [];

                        for (const row of rows as mysql2.RowDataPacket[]) {
                            items.push( 
                                await this.adaptToModel(row, options)
                                );
                        }

                        resolve(items);

                    })
                    .catch(error => {
                        reject(error);
                    });
            } 
        );
    };
    
    public getById(id: number, options: AdapterOptions): Promise<ReturnModel|null> {
        const tableName = this.tableName();
        return new Promise<ReturnModel> (
            (resolve, reject ) => {
                const sql: string = `SELECT * FROM \`${tableName}\` WHERE ${tableName}_id = ?;`;

                this.db.execute(sql, [ id ])
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve(null);
                        }

                        if (Array.isArray(rows) && rows.length === 0) {
                            return resolve(null);
                        }

                        resolve(await this.adaptToModel(
                            rows[0],
                            options
                            )
                            );

                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        );
    }

    protected async getAllByFieldNameAnValue( fieldName: string, value: any, options: AdapterOptions): Promise<ReturnModel[]> {
        const tableName = this.tableName();
        return new Promise(
            (resolve, reject ) => {
                const sql = `SELECT * FROM \`${ tableName } \` WHERE \`${ fieldName } \` = ?;`;  
                this.db.execute(sql, [ value ])
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve([]);
                        }
                        
                        const recipes: ReturnModel[] = [];
                        for (const row of rows as mysql2.RowDataPacket[]) {
                            recipes.push(row as ReturnModel);
                        }

                        resolve(recipes);
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        )
    }

    protected async getAllFromTableByFieldNameAnValue<OwnReturnType>(tableName: string, fieldName: string, value: any): Promise<OwnReturnType[]> {
       
        return new Promise(
            (resolve, reject ) => {
                const sql = `SELECT * FROM \`${tableName}\` WHERE \`  ${fieldName} \` = ?;`;

                this.db.execute(sql, [ value ])
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve([]);
                        }
                        
                        const recipes: OwnReturnType[] = [];
                        for (const row of rows as mysql2.RowDataPacket[]) {
                            recipes.push(row as OwnReturnType);
                        }

                        resolve(recipes);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
    }


    protected async baseAdd(data: IServiceData, options: AdapterOptions): Promise<ReturnModel> {
        const tableName = this.tableName();

        return new Promise((resolve, reject) => {
            const properties = Object.getOwnPropertyNames(data);
            const sqlPairs = properties.map(property => "`" + property + "` = ?").join(", ");
            const values = properties.map(property => data[property]);

            const sql: string = "INSERT `" + tableName + "` SET " + sqlPairs + ";";

            this.db.execute(sql, values)
                .then(async result => {
                    const info: any = result;

                    const newRecipeId = +(info[0]?.insertId);
                    const newItem: ReturnModel|null = await this.getById(newRecipeId, options); 

                    if(newItem === null) {
                        return reject({ message: 'Could not add a new item into the ' + tableName + ' table!', });
                    }

                    resolve(newItem);
                })
                .catch(error => {
                    reject(error);
                });

        });
    }

    

}