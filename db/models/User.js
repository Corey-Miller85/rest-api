"use strict";
const Sequelize = require("sequelize");

module.exports = sequelize => {
	class User extends Sequelize.Model {}
	User.init(
		{
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			//Check to see that email is a string, is not null,  and does not exsist in DB already.
			emailAddress: {
				type: Sequelize.STRING,
				allowNull: false,
				isUnique: true
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			}
		},
		{ sequelize }
	);

	User.associate = models => {
		User.hasMany(models.Course, { foreignKey: "userId" });
	};
	return User;
};
