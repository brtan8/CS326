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

    async delete(identifier) {
      if (typeof identifier === 'string') {
        // Delete by email
        const keyToDelete = Object.keys(this.Logins).find(
          key => this.Logins[key].email === identifier
        );
        if (keyToDelete !== undefined) {
          delete this.Logins[keyToDelete];
        }
      } else if (identifier && identifier.id !== undefined) {
        // Delete by ID
        delete this.Logins[identifier.id];
      }
    }
  }

const InMemoryLoginModel = new _InMemoryLoginModel();

InMemoryLoginModel.create({ email: 'test@example.com', password: 'test12345', uid: 1 });

export default InMemoryLoginModel;