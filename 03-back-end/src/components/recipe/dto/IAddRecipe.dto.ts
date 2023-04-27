import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
export interface IAddDto {
    name: string;
    decsription: string;
    ingredientIds: number[];
}

export default interface IAddRecipe extends IServiceData {
    ingredientIds: any;
    name: string;
    description: string;
    category_id: number;
}

export interface IRecipeIngredient extends IServiceData {
    recipe_id: number;
    ingredient_id: number;
}

const AddRecipeValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 8,
            maxLength: 124,
        },
        description: {
            type: "string",
            minLength: 32,
            maxLength: 500,
        },
        ingredientIds: {
            type: "array",
            minLength: 0,
            uniqueRecipe: true,
            recipe: {
                type: "intiger"
            }
        }
    },
    required: [
        "name",
        "description",
        "ingredientIds",
    ],
    additionalProperties: false,
});


export {AddRecipeValidator};