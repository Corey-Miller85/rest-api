module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: "First name cannot be empty"
				}
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: "Last name can not be empty"
				}
			}
		},
		emailAddress: {
			type: DataTypes.STRING,
			unique: {
				args: true,
				msg: "Email address already exists"
			},
			allowNull: false,
			validate: {
				notNull: {
					msg: "E-mail cannot be empty"
				},
				isEmail: {
					args: true,
					msg:
						"The email you entered is invalid or is already in our system."
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: "Password can not be empty"
				}
			}
		}
	});
	User.associate = models => {
		User.hasMany(models.Course, {
			foreignKey: "userId"
		});
	};
	return User;
};
