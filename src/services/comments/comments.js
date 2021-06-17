//profile routes
import express from "express";
import createError from "http-errors";
import { posts, profile, user } from "../../db/db.js";
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { comments } from "../../db/db.js"

const commentsRouter = express.Router()
commentsRouter
  .route("/")

  .get(async (req, res, next) => {
    try {
      const data = await comments.findAll({
				include: { model: posts, include: { model: comments, include: {model : user, includer: {model : profile}} } },
				order: [["id", "ASC"]],
			})
      res.send(data);
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  
  .post(async (req, res, next) => {
    try {
      const data = await comments.create(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

commentsRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await comments.findByPk(req.params.id)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .put(async (req, res, next) => {
    try {
      const comments = await comments.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send(comments)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(async (req, res, next) => {
    try {
      const comment = await comments.destroy({
        where: { id: req.params.id },
      })
      res.send("Deleted successfully")
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "db-buildweek" },
})

const upload = multer({
  storage: cloudinaryStorage,
}).single("image")

// profileRouter.post("/:id/upload", upload, async (req, res, next) => {
//   try {
//     const data = await profile.update(
//       { imageUrl: req.file.path },
//       {
//         where: { _id: req.params.id },
//         returning: true,
//       }
//     )

//     if (data[0] === 1) res.send(data[1][0])
//     else res.status(404).send("ID not found")
//   } catch (error) {
//     next(error.message)
//   }
// })

export default commentsRouter
