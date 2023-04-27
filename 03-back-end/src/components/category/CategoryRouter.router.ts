import CategoryController from "./CategoryController.controller";
import CategoryService from "./CategoryService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";

class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        const categoryController: CategoryController = new CategoryController(resources.services);

        application.get("/api/category",     categoryController.getAll.bind(categoryController));
        application.get("/api/category/:id", categoryController.getById.bind(categoryController));
        application.post("/api/category", categoryController.add.bind(categoryController));
        application.get("api/category/:cid/recipe", categoryController.getAllRecipesByCategoryId.bind(categoryController));
        application.get("api/category/:cid/recipe/:iid", categoryController.getRecipeById.bind(categoryController));
 
    }
}   

export default CategoryRouter;