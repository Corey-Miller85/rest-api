module.exports = (sequelize, DataTypes) => {
	const Course = sequelize.define("Course", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Course title can not be empty, please provide a title"
				},
				notNull: {
					msg: "Course title can not be null, Please provide a title"
				}
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg:
						"Course description can not be empty, please provide a description"
				},
				notNull: {
					msg:
						"Course description can not be null, please provide a description"
				}
			}
		},
		estimatedTime: {
			type: DataTypes.STRING,
			allowNull: true
		},
		materialsNeeded: {
			type: DataTypes.STRING,
			allowNull: true
		}
	});
	Course.associate = models => {
		Course.belongsTo(models.User, { foreignKey: "userId" });
	};
	return Course;
};
