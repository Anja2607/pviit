import IModel from "../../common/IModel.interface";

export interface IRecipeIngredient {
    recipe_ingredient_id: number;
    recipe_id: number;
    ingredient_id: number;
    quantity: number;
}

class IngredientModel implements IModel {
    ingredientId: number;
    name: string;
}

export default IngredientModel;