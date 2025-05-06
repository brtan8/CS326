class _InMemoryLoginModel {
    static LoginId = 1;

    constructor() {
      this.Logins = {};
    }

    async create(Login) {
      this.Logins[_InMemoryLoginModel.LoginId] = Login;
      _InMemoryLoginModel.LoginId++;
      return Login;
    }

    async read(id = null) {
      if (id) {
        return Object.values(this.Logins).find((Login) => Login.id === id);
      }

      return this.Logins;
    }

    async delete(id) {
      if (id && id.id) {
        delete this.Logins[id.id];
      } else {
        this.Logins = {};  // Clear everything
        _InMemoryLoginModel.LoginId = 1; // Reset ID counter
      }
    }
  }

const InMemoryLoginModel = new _InMemoryLoginModel();

InMemoryLoginModel.create({ email: 'test@example.com', password: 'test12345', uid: 1 });

export default InMemoryLoginModel;