//profile routes
import express from "express"
import createError from "http-errors"
import { profile, user, experience } from "../../db/db.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { uploadExperienceImage } from "../../utils/index.js"
import { promisify } from "util"
import fs from "fs-extra"
// import { join } from "path"
import { pipeline } from "stream"
// import PdfPrinter from "pdfmake"
import generatePDFStream from "../../helper/pdfout.js"
import { error } from "console"
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const profileRouter = express.Router()
profileRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await profile.findAll({ include: [user, experience] })
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await profile.create(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
profileRouter.post(
  "/:id/experience/:expId/picture",
  uploadExperienceImage,
  async (req, res, next) => {
    try {
      if (experience.findOne({ where: { profileId: req.params.id } })) {
        const experiences = await experience.findOne({
          where: { id: req.params.expId },
        })
        const data = await experience.update(
          { ...experiences, image: req.file.path },
          {
            where: { id: req.params.expId },
            returning: true,
          }
        )
        res.send(data)
      } else {
        next(createError(404, "id is not found"))
      }
    } catch (error) {
      console.log(error)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  }
)
profileRouter.post("/:id/CV", async (req, res, next) => {
  try {
    // if (!isValidObjectId(req.params.id))
    //   next(createError(400, `ID ${req.params.id} is invalid`))
    // else {
    const data = await profile.findByPk(req.params.id)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${req.params.id}.pdf`
    )
    pipeline(await generatePDFStream(data), res, (error) =>
      error ? createError(500, error) : null
    )
  } catch (error) {
    next(createError(500, error))
  }
})

profileRouter
  .route("/:id/experience")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findOne({
        where: { profileId: req.params.id },
      })
      res.send(data)
    } catch (error) {
      console.log(error)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .post(async (req, res, next) => {
    try {
      if (experience.findOne({ where: { profileId: req.params.id } })) {
        const data = await experience.create(req.body)
        res.send(data)
      } else {
        next(createError(404, "id isnot found"))
      }
    } catch (error) {
      console.log(error)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
profileRouter
  .route("/:id/experience/:expId")
  .delete(async (req, res, next) => {
    try {
      if (experience.findOne({ where: { profileId: req.params.id } })) {
        const data = await experience.destroy({
          where: { id: req.params.expId },
        })
        res.send("deleted successfully")
      } else {
        next(createError(404, "id isnot found"))
      }
    } catch (error) {
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .put(async (req, res, next) => {
    try {
      if (experience.findOne({ where: { profileId: req.params.id } })) {
        const data = await experience.update(req.body, {
          returning: true,
          where: { id: req.params.expId },
        })
        res.send(data)
      } else {
        next(createError(404, "id isnot found"))
      }
    } catch (error) {
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
profileRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await profile.findByPk(req.params.id, {
        include: experience,
      })
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
      const profiles = await profile.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send(profiles)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(async (req, res, next) => {
    try {
      const profiles = await profile.destroy({
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
export default profileRouter
