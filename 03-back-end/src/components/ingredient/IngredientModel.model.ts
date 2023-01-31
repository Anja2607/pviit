import IModel from "../../common/IModel.interface";

class IngredientModel implements IModel {
    ingredientId: number;
    name: string;
}

export default IngredientModel;