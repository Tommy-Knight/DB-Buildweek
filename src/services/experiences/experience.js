//experiences routes
import express from "express";
import createError from "http-errors";
import { experience } from "../../db/db.js";
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const experienceRouter = express.Router();
experienceRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findAll();
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await experience.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

experienceRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findByPk(req.params.id);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .put(async (req, res, next) => {
    try {
      const experiences = await experience.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(experiences);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const experiences = await experience.destroy({
        where: { id: req.params.id },
      });
      res.send("Deleted successfully");
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });
export default experienceRouter;
