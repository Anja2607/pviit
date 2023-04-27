import CategoryController from "./CategoryController.controller";
import CategoryService from "./CategoryService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import RecipeController from "../recipe/RecipeController.controller";

class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        const categoryController: CategoryController = new CategoryController(resources.services);
        const recipeController: RecipeController = new RecipeController(resources.services);

        application.get("/api/category",     categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id", categoryController.getById.bind(categoryController));
        application.post("/api/category", categoryController.add.bind(categoryController));
        application.get("api/category/:cid/recipe", recipeController.getAllRecipesByCategoryId.bind(recipeController));
        application.post("api/category/:cid/recipe/:iid/photo", recipeController.uploadPhoto.bind(recipeController));
        application.post("api/category/:cid/recipe", recipeController.add.bind(recipeController));
        application.get("api/category/:cid/recipe/:iid", recipeController.getRecipeById.bind(recipeController));
 
    }
}   

export default CategoryRouter;  