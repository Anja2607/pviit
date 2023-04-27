import { resolve } from "path";
import BaseService from "../../common/BaseService"
import IAdapterOptions from "../../common/IAdapterOptions.interface"
import { IRecipeIngredient } from "../ingredient/IngredientModel.model";
import RecipeModel from "./RecipeModel.model"
import IAddRecipe from "./dto/IAddRecipe.dto";

export interface IRecipeAdapterOptions extends IAdapterOptions {
    loadCategory: boolean;
    loadIngredient: boolean;
}
export class DefaultRecipeAdapterOptions implements IRecipeAdapterOptions {
    loadCategory: false;
    loadIngredient: false;
}

export default class RecipeService extends BaseService<RecipeModel, IRecipeAdapterOptions> {
    tableName(): string {
        return "recipe";
    }
    protected adaptToModel(data: any, options: IRecipeAdapterOptions): Promise<RecipeModel> {
        return new Promise(async (resolve) => {
            const recipe = new RecipeModel();

            recipe.recipeId = +data?.recipe_id;
            recipe.name = data?.name;
            recipe.description = data?.description;
            recipe.categoryId = +data?.category_id;
            recipe.isActive = +data?.is_active === 1;

            if (options.loadCategory) {
                recipe.category = await this.services.category.getById(recipe.categoryId, {
                    loadIngredients: true,
                });
            }

            if (options.loadIngredient) {
                recipe.ingredients = await this.services.ingredient.getAllByRecipeId(recipe.recipeId);    
            }  

            resolve(recipe);
        })
    }  

    async getAllByCategoryId(categoryId: number, options: IRecipeAdapterOptions) {
        return this.getAllByFieldNameAnValue("category_id", categoryId, options);
    }

    async add(data: IAddRecipe): Promise<RecipeModel> {
        return this.baseAdd(data, {
            loadCategory: false,
            loadIngredient: false,
        });
    }

    async addRecipeIngredient(data: IRecipeIngredient): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql: string = "INSERT item_ingredient SET item_id = , ingredient_id = ?;";

            this.db.execute(sql, [ data.recipe_id, data.ingredient_id])
            .then(async result => {
                const info: any = result;
    
                const newRecipeIngredientId = +(info[0]?.insertId);
    
                resolve(newRecipeIngredientId);
    
            })
            .catch(error => {
                reject(error);
            });
        })
    }
}