//profile routes
import express from "express";
import createError from "http-errors";
import { profile } from "../../db/db.js";
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const profileRouter = express.Router();
profileRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await profile.findAll();
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
      const data = await profile.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  });

profileRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await profile.findByPk(req.params.id);
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
      const profiles = await profile.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      });
      res.send(profiles);
    } catch (e) {
      console.log(e);
      next(
        createError(500, "Oops something went wrong, please try again later")
      );
    }
  })
  .delete(async (req, res, next) => {
    try {
      const profiles = await profile.destroy({
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
export default profileRouter;
