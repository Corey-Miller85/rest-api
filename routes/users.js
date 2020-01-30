"use strict";

const express = require("express");
const { models } = require("../db");
const { User } = models;
const auth = require("basic-auth");

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
const authenticateUser = (req, res, next) => {
	let message = null;

	// Parse the user's credentials from the Authorization header.
	const credentials = auth(req);

	// If the user's credentials are available...
	if (credentials) {
		// Attempt to retrieve the user from the data store
		// by their username (i.e. the user's "key"
		// from the Authorization header).
		const user = users.find(u => u.username === credentials.name);

		// If a user was successfully retrieved from the data store...
		if (user) {
			// Use the bcryptjs npm package to compare the user's password
			// (from the Authorization header) to the user's password
			// that was retrieved from the data store.
			const authenticated = bcryptjs.compareSync(
				credentials.pass,
				user.password
			);

			// If the passwords match...
			if (authenticated) {
				console.log(
					`Authentication successful for username: ${user.username}`
				);

				// Then store the retrieved user object on the request object
				// so any middleware functions that follow this middleware function
				// will have access to the user's information.
				req.currentUser = user;
			} else {
				message = `Authentication failure for username: ${user.username}`;
			}
		} else {
			message = `User not found for username: ${credentials.name}`;
		}
	} else {
		message = "Auth header not found";
	}

	// If user authentication failed...
	if (message) {
		console.warn(message);

		// Return a response with a 401 Unauthorized HTTP status code.
		res.status(401).json({ message: "Access Denied" });
	} else {
		// Or if user authentication succeeded...
		// Call the next() method.
		next();
	}
};

router.get("/", authenticateUser, (req, res) => {
	res.send("Hello there");
});

router.post(
	"/",
	asyncHandler(async (req, res) => {
		const body = req.body;
		const newUser = await User.create({
			firstName: body.firstName,
			lastName: body.lastName,
			emailAddress: body.emailAddress,
			password: body.password
		});
		res.send("done");

		// const checker = await User.findOne({
		// 	where: {
		// 		emailAddress: body.emailAddress
		// 	}
		// });
		// if (checker) {
		// 	res.status(300).send("Already an account with that email");
		// } else {
		// 	const newUser = await User.create({
		// 		firstName: body.firstName,
		// 		lastName: body.lastName,
		// 		emailAddress: body.emailAddress,
		// 		password: body.password
		// 	});
		// 	res.status(201)
		// 		.location("/")
		// 		.end();
		// }
	})
);
module.exports = router;
