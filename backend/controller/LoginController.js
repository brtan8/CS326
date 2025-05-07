import ModelFactory from "../model/LoginFactory.js";

class LoginController {
  constructor() {
    ModelFactory.getModel().then((model) => {
      this.model = model;
    });
  }

  async getAllLogins(req, res) {
    const Login = await this.model.read();
    res.json({ Login });
  }

  async addLogin(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Login description is required." });
      }

      const Login = await this.model.create(req.body);

      const file = req.body.file
        ? `with file: ${req.body.filename}`
        : "without file";

      return res.status(201).json(Login);
    } catch (error) {
      console.error("Error adding Login:", error);
      return res
        .status(500)
        .json({ error: "Failed to add Login. Please try again." });
    }
  }

  async clearLogins(req, res) {
    await this.model.delete(req.query);
    res.json(await this.model.read());
  }
}

export default new LoginController();