//profile routes
import express from "express";
import createError from "http-errors";
import { profile } from "../../db/db.js";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
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

  const cloudinaryStorage = new CloudinaryStorage({
		cloudinary,
		params: { folder: "db-buildweek" },
	})

	const upload = multer({
		storage: cloudinaryStorage,
	}).single("image")

	profileRouter.post("/:id/upload", upload, async (req, res, next) => {
		try {
			const data = await profile.update(
				{ imageUrl: req.file.path },
				{
					where: { _id: req.params.id },
					returning: true,
				}
			)

			if (data[0] === 1) res.send(data[1][0])
			else res.status(404).send("ID not found")
		} catch (error) {
			next(error.message)
		}
	})


export default profileRouter;
