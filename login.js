const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 63342;

// Credenciais hardcoded
const users = {
    '1': '1',
    'user2': 'password2',
    'user3': 'password3'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Página inicial (login)
app.get('/', (req, res) => {
    if (req.cookies.currentUser) {
        return res.redirect('/restricted');
    }
    res.sendFile(__dirname + '/login.html');
});

// Página restrita
app.get('/restricted', (req, res) => {
    const username = req.cookies.currentUser;
    if (!username || !users[username]) {
        return res.redirect('/');
    }
    res.send(`<h1>Bem vindo, ${username}. Aqui estão suas informações restritas [...]</h1>
              <a href="/logout">Logout</a>`);
});

// Login
app.post("/login", function (request, response) {
    let login = request.body.username;
    let senha = request.body.password;
    let manter = request.body.rememberMe; // Checkbox "lembrar-me"

    if(users[login] && users[login] === senha){
        response.status(200);
        if(manter === "1"){ // Se o usuário quer ser mantido conectado
            response.cookie('currentUser', login, { maxAge: 72 * 60 * 60 * 1000 });
        } else {
            // Cookie de sessão (é removido quando o navegador é fechado)
            response.cookie('currentUser', login);
        }
        response.redirect('/restricted');
    } else {
        response.status(401).send("Credenciais inválidas");
    }
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('currentUser');  // Corrigido o nome do cookie
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
