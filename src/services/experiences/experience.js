//experiences routes
import express from "express"
import createError from "http-errors"
import json2csv from "json2csv"
import { experience, profile } from "../../db/db.js"
const Json2CsvParser = json2csv.Parser

const experienceRouter = express.Router()

experienceRouter.route("/:userId/profile").get(async (req, res, next) => {
	try {
		const data = await experience.findAll({
			include: profile,
			where: { profileId: req.params.userId },
		})
		res.send(data)
	} catch (e) {
		console.log(e)
		next(createError(500, "Oops something went wrong, please try again later"))
	}
})
experienceRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await experience.findAll({ include: profile })
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
  .route("/:userId/experiences/csv")
  .post(async (req, res, next) => {
    try {
      const data = await experience.findAll({ userId: req.params.userId })
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
