import baseController from "./base.controller";
import controlerInterface from "../interfaces/controller.interface";
import express = require("express");
import { historyTypeEnum } from "../enum/history.enum";

class infoController
    extends baseController
    implements controlerInterface {

    constructor() {
        super(historyTypeEnum.fence);
    }

    setRouter(router: express.Router): void {
        router.get(this.createRestrictedEndpoint('info/api'), this.api);
    }

    private api = async (req: express.Request, res: express.Response) => {
        let result = {
            version: global.config.version
        }

        res.json(result);
    }

}

export default infoController;