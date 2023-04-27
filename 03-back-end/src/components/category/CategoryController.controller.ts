import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultCategoryAdapterOptions } from "./CategoryService.service";
import IAddCategory, { AddCategoryValidator } from "./dto/IAddCategory.dto";


class CategoryController extends BaseController{
    

    async getAll(req: Request, res: Response): Promise<void> {
        this.services.category.getAll(DefaultCategoryAdapterOptions)
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
        
    }

    async getById(req: Request, res: Response) {
        if (!req.params) {
            return res.sendStatus(400);
        }

        const id: number = +req.params?.id;

        this.services.category.getById(id, DefaultCategoryAdapterOptions)
            .then(result => {
                if (result === null) {
                    return res.sendStatus(404);
                }

                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
       
    }

    async add(req: Request, res: Response) {
        const data = req.body as IAddCategory;

        if (!AddCategoryValidator(data)) {
            return res.status(400).send(AddCategoryValidator.errors);
        }

        this.services.category.add(data)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(400).send(error?.message);
            });
    }

    async getAllRecipesByCategoryId(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;

        this.services.category.getById(categoryId, {loadIngredients: false})
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found");
            }
            

            this.services.recipe.getAllByCategoryId(categoryId, {
                loadCategory: false,
                loadIngredient: false,  
            })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        })
    }

    async getRecipeById(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const recipeId: number = +req.params?.rid

        this.services.category.getById(categoryId, {loadIngredients: false})
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found");
            }
            

            this.services.recipe.getById(recipeId, {
                loadCategory: true,
                loadIngredient: true,  
            })
            .then(result => {
                if (result === null) {
                    return res.status(404).send("Recipe not found");
                }

                if (result.categoryId !== categoryId) {
                    return res.status(404).send("Recipe not found in this category");
                }
                
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        })
    }
}

export default CategoryController;