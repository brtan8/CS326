import LoginModel from "../model/LoginFactory.js";

class LoginController {
  constructor() {
    this.model = LoginModel.getModel();
  }

  async getAllLogins(request, result) {
    const Logins = await this.model.read();
    result.json(Logins);
  }

  async addLogin(request, result) {
    try {
      if (!request.body) {
        return result.status(400).json({ error: "error." });
      }

      const Login = await this.model.create(request.body);

      const file = request.body.file
        ? `with file: ${request.body.filename}`
        : "without file";

      return result.status(201).json(Login);
    } catch (error) {
      console.error("Error adding Login:", error);
      return result
        .status(500)
        .json({ error: "Failed to add Login. Please try again." });
    }
  }

  async clearLogins(request, result) {
    await this.model.delete(request.query);
    result.json(await this.model.read());
  }
}

export default new LoginController();