"use strict";

const express = require("express");
const db = require("../db");
const { User } = db;
// const { User } = db;
// const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");

// Get references to our models.
// const { User } = models;
const router = express.Router();

// Helper function to catch errors
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
		const users = await User.findAll();
		res.status(200).json(users);
	})
);

router.post(
	"/",
	asyncHandler(async (req, res) => {
		const body = req.body;
		await User.create({
			firstName: body.firstName,
			lastName: body.lastName,
			emailAddress: body.emailAddress,
			password: bcryptjs.hashSync(req.body.password)
		});
		res.status(201)
			.location("/")
			.end();
	})
);
module.exports = router;
