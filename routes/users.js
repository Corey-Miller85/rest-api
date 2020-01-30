"use strict";

const express = require("express");
const { models } = require("../db");
const { User } = models;
const auth = require("basic-auth");
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

//setting up authenticator
const authenticateUser = async (req, res, next) => {
	let message = null;
	const credentials = auth(req);
	if (credentials) {
		// const user = User.find(u => u.emailAddress === credentials.name);
		const user = await User.findOne({
			where: { emailAddress: credentials.name }
		});
		console.log(user);
		if (user) {
			const authenticated = bcryptjs.compareSync(
				credentials.pass,
				user.password
			);
			if (authenticated) {
				console.log(
					`Authentication successful for: ${user.emailAddress}`
				);
				req.currentUser = user;
			} else {
				message = `Could not authenticate ${user.emailAddress}`;
			}
		} else {
			message = `Could not find the username: ${user.emailAddress}`;
		}
	} else {
		message = `Authenticate header not found`;
	}
	if (message) {
		console.warn(message);
		res.status(401).json({ message: "Access denied" });
	} else {
		next();
	}
};

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
	asyncHandler(async (req, res) => {
		const body = req.body;
		const newUser = await User.create({
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
