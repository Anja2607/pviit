import * as express from "express";
import * as cors from "cors";   
import IConfig from "./common/IConfig.interface";
import { DevConfig } from "./configs";
import CategoryService from "./components/category/CategoryService.service";
import CategoryController from "./components/category/CategoryController.controller";
import * as fs from "fs";
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import { error } from "console";
import IngredientModel from "./components/ingredient/IngredientModel.model";
import IngredientService from "./components/ingredient/IngredientService.service";
import AdministratorService from "./components/administrator/AdministratorService.service";
import RecipeService from "./components/recipe/RecipeService.service";
;


async function main() {
    const config: IConfig = DevConfig;

fs.mkdirSync(config.logging.path, {
    mode: 777,
    recursive: true,
});

const db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    charset: config.database.charset,
    timezone: config.database.timezone,
});

const applicationRecourses: IApplicationResources = {
    databaseConnection: db,
    services: {
        category: null,
        ingredient: null,
        administrator: null,
        recipe: null,
    }
};

applicationRecourses.services.category      =  new CategoryService(applicationRecourses),
applicationRecourses.services.ingredient    =  new IngredientService(applicationRecourses),      
applicationRecourses.services.administrator =  new AdministratorService(applicationRecourses),        
applicationRecourses.services.recipe        =  new RecipeService(applicationRecourses)
        
    

const application: express.Application = express();

application.use(morgan(config.logging.format, {
    stream: fs.createWriteStream(config.logging.path + "/" + config.logging.filename, { flags: "a"}),
}));

application.use(cors());
application.use(express.json());


application.use(config.server.static.route, express.static(config.server.static.path, {
    index: config.server.static.index,
    dotfiles: config.server.static.dotfiles,
    cacheControl: config.server.static.cacheControl,
    etag: config.server.static.etag,
    maxAge: config.server.static.maxAge,

}));

for (const router of config.routers) {
    router.setupRoutes(application, applicationRecourses);
}



application.use((req, res) => {
    res.sendStatus(404);
});

application.listen(config.server.port);
}

process.on('uncaughtException', error => {
    console.error('ERROR', error);
});

main();