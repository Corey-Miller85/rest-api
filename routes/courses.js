"use strict";

const express = require("express");
const { models } = require("../db");
const { User, Course } = models;
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
		const user = await Course.findAll({});
		const list = user.map(course => course.toJSON());
		res.json(list).end();
	})
);

module.exports = router;
