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
		const newUser = await Course.create({
			title: "Opeth is good",
			description: "My course description",
			userId: 1
		});
		//set status to 201
		// res.status(201);
		//set location header to '/'
		// res.location("/");
		res.end();
	})
);

//PUT route for /courses/:id updates course
router.put(
	"/:id",
	authenticateUser,
	asyncHandler(async (req, res) => {
		const found_course = await Course.findByPk(req.params.id);
		await found_course.update(req.body);
		res.status(204).end();
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
