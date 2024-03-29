import * as mysql2 from "mysql2/promise";
import AdministratorService from "../components/administrator/AdministratorService.service";
import CategoryService from "../components/category/CategoryService.service";
import IngredientService from "../components/ingredient/IngredientService.service";
import RecipeService from "../components/recipe/RecipeService.service";

export interface IServices {
    category: CategoryService;
    ingredient: IngredientService;
    administrator: AdministratorService;
    recipe: RecipeService;
}

export default interface IApplicationResources {
    databaseConnection: mysql2.Connection;
    services?: IServices;
}