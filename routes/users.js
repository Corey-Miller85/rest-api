"use strict";

const express = require("express");
const db = require("../db");
const { User } = db;
const { check, validationResult } = require("express-validator/check");
const authenticateUser = require("../middleware/authenticateUser");
const bcryptjs = require("bcryptjs");

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

const nameValidationChain = check("firstName")
	.exists({
		checkNull: true,
		checkFalsy: true
	})
	.withMessage("Please provide a value for 'firstName'");
const lastNameValidationChain = check("lastName")
	.exists({ checkNull: true, checkFalsy: true })
	.withMessage("Please enter a value for 'lastName'");

const emailValidationChain = check("emailAddress")
	.exists({ checkNull: true, checkFalsy: true })
	.withMessage("Please enter a value for 'emailAddress'");

const passwordValidationChain = check("password")
	.exists({ checkNull: true, checkFalsy: true })
	.withMessage("Please enter a value for 'password'");

router.get(
	"/",
	authenticateUser,
	asyncHandler(async (req, res) => {
		const users = await User.findAll();
		res.status(200).json(users);
	})
);

router.post(
	"/",
	nameValidationChain,
	lastNameValidationChain,
	emailValidationChain,
	passwordValidationChain,
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map(error => error.msg);
			res.status(400).json({ errors: errorMessages });
		} else {
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
		}
	})
);
module.exports = router;
