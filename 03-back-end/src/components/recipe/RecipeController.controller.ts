import { Request, Response, response } from "express";
import BaseController from "../../common/BaseController";
import IAddRecipe, { AddRecipeValidator } from "./dto/IAddRecipe.dto";
import IAddRecipeDto from "./dto/IAddRecipe.dto";
import { mkdirSync, readFileSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import { extname, basename } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";

export default class RecipeController extends BaseController {
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
        });
    }

    async add(req: Request, res: Response) {
        const categoryId: number = +req.params?.cid;
        const data = req.body as IAddRecipeDto;

        if (!AddRecipeValidator(data)) {
            return res.status(400).send(AddRecipeValidator.errors);
        }
        this.services.category.getById(categoryId, { loadIngredients: true})
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found");
            }

            const availableIngredientIds: number[] = result.ingredients?.map(ingredient => ingredient.ingredientId);

            for (let givenIngredientId of data.ingredientIds) {
                if (!availableIngredientIds.includes(givenIngredientId)) {
                    return res.status(404).send(`Ingredient ${givenIngredientId} not found i this category`);
                }
            }

            this.services.recipe.add({
                name: data.name,
                category_id: categoryId,
                description: data.description,
                ingredientIds: undefined
            })
            .then(newRecipe => {
                for (let givenIngredientId of data.ingredientIds) {
                    this.services.recipe.addRecipeIngredient({
                        recipe_id: newRecipe.recipeId,
                        ingredient_id: givenIngredientId,
                        recipe_ingredient_id: 0,
                        quantity: 0
                    })
                    .catch(error => {
                        res.status(500).send(error?.message)
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error?.message)
            });

        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    async uploadPhoto(req: Request, res: Response) {

        const categoryId: number = +req.params?.cid;
        const recipeId: number = +req.params?.rid

        this.services.category.getById(categoryId, {loadIngredients: false})
        .then(result => {
            if (result === null) {
                return res.status(404).send("Category not found");
            }
            

            this.services.recipe.getById(recipeId, {
                loadCategory: false,
                loadIngredient: false,  
            })
            .then(result => {
                if (result === null) {
                    return res.status(404).send("Recipe not found");
                }

                if (result.categoryId !== categoryId) {
                    return res.status(404).send("Recipe not found in this category");
                }
                
               const uploadedFiles = this.doFileUpload(req, response);

               if (uploadedFiles === null) {
                return;
               }

               for (let singleFile of uploadedFiles) {
                    const filename = basename(singleFile);
               }
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
        })
        .catch(error => {
            res.status(500).send(error?.message);
        });
    }

    private doFileUpload(req: Request, res: Response): string[] | null {

        if (!req.files || Object.keys(req.files).length === 0) {
             res.status(400).send("No files were uploaded");
             return null;
        }

        
        const fileFieldNames = Object.keys(req.files);

        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");

        const uploadDestinationRoot = "./static/";
        const destinationDirectory = "uploads/" + year + "/" + month + "/";

        mkdirSync(uploadDestinationRoot + destinationDirectory, {
            recursive: true,
            mode: "755",
        });

        const uploadedFiles = [];

        for (let fileFiledName of fileFieldNames) {
            const file = req.files[fileFiledName] as UploadedFile;


            const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

            if (![ "png", "jpg "].includes(type)) {
                 res.status(415).send(`File ${fileFiledName} - type is not supported`);
            }

            const declaredExtension = extname(file.name);

            if (! [ ".jpg", ".png" ].includes(declaredExtension)) {
                 res.status(415).send("File extension is not supported");
            }

            const size = sizeOf(file.tempFilePath);

            if (size.width < 320 || size.width > 1920) {
               res.status(415).send("Image width is not supported");
            }

            if (size.height < 240 || size.height > 1080) {
                 res.status(415).send("Image height is not supported");
            }

            const fileNameRandomPart = uuid.v4();

            const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

            file.mv(fileDestinationPath, error => {
                return res.status(500).send(error);
            });
            
                uploadedFiles.push(fileDestinationPath + fileNameRandomPart + "-" + file.name);
        }

        res.send(uploadedFiles);
    }

}