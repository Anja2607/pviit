import CategoryModel from "./CategoryModel.model";
import * as mysql2 from "mysql2/promise";
import { resolve } from "path";
import { rejects } from "assert";
import IAddCategory from "./dto/IAddCategory.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IngredientService from "../ingredient/IngredientService.service";
import BaseService from "../../common/BaseService";


interface IAddCategoryAdapterOptions extends IAdapterOptions {
    loadIngredients: boolean;
}

const DefaultCategoryAdapterOptions: IAddCategoryAdapterOptions = {
    loadIngredients: false,
}

class CategoryService extends BaseService<CategoryModel, IAddCategoryAdapterOptions>{
    tableName(): string {
        return "category";
    }
   

    protected async adaptToModel(data: any, options: IAddCategoryAdapterOptions = DefaultCategoryAdapterOptions): Promise<CategoryModel> {
        const category: CategoryModel = new CategoryModel();

        category.categoryId = +data?.categoryId;
        category.name = data?.name;

        if (options.loadIngredients) {
            const ingredientService: IngredientService = new IngredientService(this.db);

        }

        return category;
    }

    public async add(data: IAddCategory): Promise<CategoryModel> {
        return this.baseAdd(data, DefaultCategoryAdapterOptions);
    }

}


export default CategoryService;
export {DefaultCategoryAdapterOptions};

