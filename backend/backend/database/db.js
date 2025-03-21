const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite", // sqile e um exemplo de banco de dados ... isso pod ser trocado por outa IDE
	storage: "./database.sqlite", // Arquivo do banco de dados
	logging: false, // Desativa logs do Sequelize
});

module.exports = sequelize;