import IngredientModel from "./IngredientModel.model";
import * as mysql2 from "mysql2/promise";
import { resolve } from "path";
import { rejects } from "assert";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddCategoryServiceDto } from "../category/dto/IAddCategory.dto";
import IEditIngredient from "./dto/IEditIngredient.dto";
import { error } from "console";

class IngredientAdapterOptions implements IAdapterOptions {

}

interface RecipeIngredientInterface {
    recipe_ingredient_id: number;
    recipe_id: number;
    ingredient_id: number;
}
class IngredientService extends BaseService<IngredientModel, IngredientAdapterOptions>{
    getAllByCategoryId(categoryId: number, arg1: {}): any {
        throw new Error("Method not implemented.");
    }
    tableName(): string {
        return "ingredient";
    
    }
    protected async adaptToModel(data: any): Promise<IngredientModel> {
        const ingredient: IngredientModel = new IngredientModel();

        ingredient.ingredientId = +data?.ingredientId;
        ingredient.name = data?.name;

        return ingredient;
    }
    public async getAll(): Promise<IngredientModel[]> {
        return new Promise<IngredientModel[]>( 
            (resolve, reject ) => {
                const sql: string = "SELECT * FROM `ingredient` ORDER BY `name`;";

                this.db.execute(sql)
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve([]);
                        }
                        const categories: IngredientModel[] = [];

                        for (const row of rows as mysql2.RowDataPacket[]) {
                            categories.push( await this.adaptToModel(row));
                        }
                        resolve(categories);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } 
        );
    }

    public async getById(ingredientId: number): Promise<IngredientModel | null> {
        return new Promise<IngredientModel> (
            (resolve, reject ) => {
                const sql: string = "SELECT * FROM `ingredient` WHERE ingredient_id = ?;";

                this.db.execute(sql, [ ingredientId ])
                this.db.execute(sql)
                    .then( async ( [ rows ] ) => {
                        if(rows === undefined) {
                            return resolve(null);
                        }
                        if (Array.isArray(rows) && rows.length === 0) {
                            return resolve(null);
                        }
                        resolve(await this.adaptToModel(rows[0]));
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        );
    }

    public async add(data: IAddCategoryServiceDto): Promise<IngredientModel> {
        return this.baseAdd(data, {});
    }

    public async editById(ingredientId: number, data: IEditIngredient): Promise<IngredientModel> {
       return this.editById(ingredientId, data);
    }

    public async deleteById(ingredientId: number, data: IEditIngredient): Promise<IngredientModel> {
        return this.deleteById(ingredientId, data);
    }

     public async getAllByRecipeId(recipeId: number, options: IngredientAdapterOptions = {}): Promise<IngredientModel[]> {
        return new Promise((resolve, reject) => {
            this.getAllFromTableByFieldNameAnValue<RecipeIngredientInterface>("recipe_ingredient", "recipe_id", recipeId)
            .then( async result => {
                const ingredientIds = result.map(ii => ii.ingredient_id);

                const ingredients: IngredientModel[] = [];

                for (let ingredientId of ingredientIds) {
                    const ingredient = await this.getById(ingredientId);
                    ingredients.push(ingredient);
                }

                resolve(ingredients);
            })
            .catch(error => {
                reject(error);
            });
        });   
    }
 }
export default IngredientService; 