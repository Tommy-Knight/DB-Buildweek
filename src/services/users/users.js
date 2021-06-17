import express from "express"
import createError from "http-errors"
import { user } from "../../db/db.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const userRouter = express.Router()
userRouter
	.route("/")
	.get(async (req, res, next) => {
		try {
			const data = await user.findAll()
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

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: { folder: "db-buildweek" },
})

const upload = multer({
	storage: cloudinaryStorage,
}).single("image")

userRouter.post("/:id/upload", upload, async (req, res, next) => {
	try {
		const data = await user.update(
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

export default userRouter 
