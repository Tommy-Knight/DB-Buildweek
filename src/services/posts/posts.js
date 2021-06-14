//posts routes
import express from "express"
import createError from "http-errors"
import { posts } from "../../db/db.js"
// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const postsRouter = express.Router()
postsRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await posts.findAll()
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
      const data = await posts.create(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

postsRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await posts.findByPk(req.params.id)
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
      const postss = await posts.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send(postss)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(async (req, res, next) => {
    try {
      const postss = await posts.destroy({
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
export default postsRouter
