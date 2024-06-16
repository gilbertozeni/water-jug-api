import WaterJugService from "../../services/WaterJugService";
import { body } from "express-validator";
import { controller, httpPost, BaseHttpController, request, response } from "inversify-express-utils";
import { inject } from "inversify";
import { ValidationMiddleware } from "../../middleware/ValidationMiddleware";
import * as express from "express";

@controller("/api/v1/water-jug")
class WaterJugController extends BaseHttpController {

    @inject("WaterJugService") private readonly waterJugService!: WaterJugService;

    @httpPost("/solve", 
        body("x_capacity").notEmpty().withMessage("x_capacity is required")
                            .isInt().withMessage("x_capacity must be an integer"),
        body("y_capacity").notEmpty().withMessage("y_capacity is required")
                            .isInt().withMessage("y_capacity must be an integer"),
        body("z_amount_wanted").notEmpty().withMessage("z_amount_wanted is required")
                            .isInt().withMessage("z_amount_wanted must be an integer"),
        ValidationMiddleware )
    public async solve(@request() req: express.Request, @response() res: express.Response) {
        const { x_capacity, y_capacity, z_amount_wanted } = req.body;

        return await this.waterJugService.solve(+x_capacity, +y_capacity, +z_amount_wanted)
                .then((steps) => {
                    return this.json(steps, 200);
                }).catch((error) => {
                    return this.json({ message: "No solution" }, 422)
                });
    }
}

export default WaterJugController;