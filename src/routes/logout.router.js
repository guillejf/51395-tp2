import express from "express";
export const logoutRouter = express.Router();

logoutRouter.get("/", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error("Error al cerrar sesión:", err);
		}
		res.redirect("/");
	});
});
