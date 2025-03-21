const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sequelize = require("./database/db");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rota de usuários
app.use("/users", userRoutes);

// Rota de login
app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ where: { username } });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.json({ success: false });
	}

	res.json({ success: true, role: user.role });
});

// Função para criar o usuário admin inicial
const createAdminUser = async () => {
	const adminExists = await User.findOne({ where: { username: "admin" } });
	if (!adminExists) {
		const hashedPassword = await bcrypt.hash("1234", 10); // Criptografa a senha
		await User.create({
			fullName: "Administrador",
			username: "admin",
			password: hashedPassword,
			role: "admin",
		});
		console.log("Usuário admin criado com sucesso!");
	}
};

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync()
	.then(() => {
		// Cria o usuário admin ao iniciar o servidor
		createAdminUser().then(() => {
			app.listen(port, () => {
				console.log(`Servidor rodando em http://localhost:${port}`);
			});
		});
	})
	.catch(err => {
		console.error("Erro ao sincronizar o banco de dados:", err);
	});