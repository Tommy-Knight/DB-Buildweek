//posts routes
import express from "express"
import createError from "http-errors"
import { comments, likes, posts, user, profile } from "../../db/db.js"

const postsRouter = express.Router()
postsRouter
	.route("/")
	.get(async (req, res, next) => {
		try {
			const data = await posts.findAll({
				include: [
					{
						model: comments,
						include: { model: user, include: { model: profile } },
					},
					{ model: user, include: { model: profile } },
				],
				order: [["id", "DESC"]],
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
			const data = await posts.findByPk(req.params.id, {
				include: [
					{
						model: comments,
						include: { model: user, include: { model: profile } },
					},
					{ model: user, include: { model: profile } },
				],
				order: [["id", "DESC"]],
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
			const posts = await posts.update(req.body, {
				returning: true,
				where: { id: req.params.id },
			})
			res.send(posts)
		} catch (e) {
			console.log(e)
			next(
				createError(500, "Oops something went wrong, please try again later")
			)
		}
	})
	.delete(async (req, res, next) => {
		try {
			const post = await posts.destroy({
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
