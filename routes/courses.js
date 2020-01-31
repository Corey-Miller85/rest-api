"use strict";

const express = require("express");
const db = require("../db");
const { User, Course } = db;
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res);
		} catch (err) {
			if (
				err.name === "SequelizeValidationError" ||
				err.name === "SequelizeUniqueConstraintError"
			) {
				const errorMessage = err.errors.map(
					errorMessage => errorMessage.message
				);
				res.status(400).json(errorMessage);
			} else {
				res.status(500);
				next(err);
			}
		}
	};
}

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const user = await Course.findAll({
			include: [{ model: User }]
		});
		const list = user.map(course => course.toJSON());
		res.status(200)
			.json(list)
			.end();
	})
);

//GET route for /courses/:ID returns single Course
router.get("/:id", async (req, res) => {
	const course = await Course.findByPk(req.params.id, {
		include: [
			{
				model: User
			}
		]
	});
	res.status(200).json(course);
});

//POST route for /courses creates course
router.post(
	"/",
	authenticateUser,
	asyncHandler(async (req, res) => {
		//create a course
		const newUser = await Course.create(req.body);
		// set status to 201
		// set location header to '/'
		res.status(201)
			.location("/")
			.end();
	})
);

//PUT route for /courses/:id updates course
router.put(
	"/:id",
	authenticateUser,
	asyncHandler(async (req, res) => {
		const coursePK = req.params.id;
		const course = await Course.findByPk(coursePK);
		console.log(course);
		if (course) {
			if (req.body.title && req.body.description) {
				await Course.update(req.body);
				res.status(204).end();
			} else {
				res.status(400).json(
					"Please provide a title and description in request"
				);
			}
		} else {
			res.status(404).json("Course Not Found.");
		}
	})
);
//DELETE route for /courses/:id destorys course

router.delete(
	"/:id",
	authenticateUser,
	asyncHandler(async (req, res) => {
		const found_course = await Course.findByPk(req.params.id);
		await found_course.destroy();
		res.status(204).end();
	})
);

module.exports = router;
