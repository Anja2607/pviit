import IModel from "../../common/IModel.interface";
import CategoryModel from "../category/CategoryModel.model";
import IngredientModel from "../ingredient/IngredientModel.model";

export default class RecipeModel implements IModel {
    recipeId: number;
    name: string;
    description: string;
    categoryId: number;
    isActive: boolean;

    category?: CategoryModel = null;
    ingredients?: IngredientModel[] = [];
    recipe: IngredientModel;
    
}