import express from "express"
import createError from "http-errors"
import { user, comments, likes, experience } from "../../db/db.js"

// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const userRouter = express.Router()
userRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await user.findAll({
        include: [comments, likes, experience],
      })
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
      const data = await user.create(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })

userRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await user.findByPk(req.params.id)
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
      const users = await user.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send(users)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(async (req, res, next) => {
    try {
      const users = await user.destroy({
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
export default userRouter
