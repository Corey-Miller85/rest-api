"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const db = {};

let sequelize;
sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "fsjstd-restapi.db"
});

sequelize
	.authenticate()
	.then(function(err) {
		console.log("Connection has been established successfully.");
	})
	.catch(function(err) {
		console.log("Unable to connect to the database:", err);
	});

fs.readdirSync(path.join(__dirname, "models")).forEach(file => {
	console.info(`Importing database model from file: ${file}`);
	const model = sequelize.import(path.join(__dirname, "models", file));
	db[model.name] = model;
});

// If available, call method to create associations.
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
