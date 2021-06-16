//experiences routes
import express from "express"
import createError from "http-errors"
import json2csv from "json2csv"
import { experience, user } from "../../db/db.js"
const Json2CsvParser = json2csv.Parser

// import ReviewModel from "./schema.js"
// import ProductModel from "../products/schema.js"
// import q2m from "query-to-mongo"

const experienceRouter = express.Router()
experienceRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findAll({ include: user })
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
      const data = await experience.create(req.body)
      res.send(data)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
experienceRouter
  .route("/:username/experiences/csv")
  .post(async (req, res, next) => {
    try {
      const data = await experience.findAll({ username: req.params.username })
      // console.log(username);
      console.log(data)
      const jsonData = JSON.parse(JSON.stringify(data))
      const csvFields = [
        "id",
        "role",
        "company",
        "startDate",
        "endDate",
        "description",
        "area",
        "image",
        "username",
        "createdAt",
        "updatedAt",
      ]
      const json2csv = new Json2CsvParser({ csvFields })
      const csvData = json2csv.parse(jsonData)
      res.setHeader(
        "Content-disposition",
        "attachment; filename=experiences.csv"
      )
      res.set("Content-Type", "text/csv")
      res.status(200).send(csvData)
    } catch (error) {
      console.log(error)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
experienceRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findByPk(req.params.id)
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
      const experiences = await experience.update(req.body, {
        returning: true,
        where: { id: req.params.id },
      })
      res.send(experiences)
    } catch (e) {
      console.log(e)
      next(
        createError(500, "Oops something went wrong, please try again later")
      )
    }
  })
  .delete(async (req, res, next) => {
    try {
      const experiences = await experience.destroy({
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
export default experienceRouter
