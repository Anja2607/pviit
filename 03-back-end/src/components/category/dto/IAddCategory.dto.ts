import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddCategory extends IServiceData {
    name: string;
}

interface IAddCategoryServiceDto {
    name: string;
    categoryId: number;
}

const AddCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },
    },
    required: [
        "name",
    ],
    additionalProperties: false,
});


export {AddCategoryValidator, IAddCategoryServiceDto};


 