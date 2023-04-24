import BaseService from "../../common/BaseService"
import IAdapterOptions from "../../common/IAdapterOptions.interface"
import RecipeModel from "./RecipeModel.model"

export interface IRecipeAdapterOptions extends IAdapterOptions {
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

            resolve(recipe);
        })
    }
    
}