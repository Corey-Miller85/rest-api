const Sequelize = require("sequelize");

module.exports = sequelize => {
	class Course extends Sequelize.Model {}
	Course.init(
		{
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			userId: {
				type: Sequelize.STRING
			},
			title: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.TEXT
			},
			estimatedTime: {
				type: Sequelize.STRING,
				allowNull: true
			},
			materialsNeeded: {
				type: Sequelize.STRING,
				allowNull: true
			}
		},
		{ sequelize }
	);
	Course.associate = models => {
		Course.belongsTo(models.User, { foreignKey: "userId" });
	};
	return Course;
};
