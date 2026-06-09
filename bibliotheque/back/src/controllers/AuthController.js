class AuthController {
  login(query, body) {
    const { login, password } = body;
    if (login === 'admin' && password === 'password') {
      return { success: true, token: 'admin-token-epita' };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  routes = [
    { url: '/api/login/', handler: this.login.bind(this), method: 'POST' },
  ];
}

module.exports = new AuthController();
