const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt'; // Asegúrate de agregar esto en tu .env
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.use(express.json());

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar si es un token de Google o JWT
        if (token.startsWith('ya29.')) {
            const ticket = await oAuth2Client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            });
            req.user = ticket.getPayload();
        } else {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Login tradicional
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar credenciales
        const [user] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        
        if (user.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user[0].id, 
                email: user[0].correo,
                role: user[0].rol 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user[0].id,
                email: user[0].correo,
                name: user[0].nombre,
                role: user[0].rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Registro de usuario
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'jugador']
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Login con Google
app.get('/auth/google', (req, res) => {
    const url = oAuth2Client.generateAuthUrl({
        scope: ['profile', 'email'],
        redirect_uri: REDIRECT_URI,
    });
    res.redirect(url);
});

// Callback de Google
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userInfo = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            surname: payload.family_name || '',
        };

        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [userInfo.email]);
        
        let userId;
        if(existingUser.length === 0){
            const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido, correo, rol) VALUES (?, ?, ?, ?)',
            [userInfo.name, userInfo.surname, userInfo.email, 'jugador']);
            userId = result.insertId;
        } else {
            userId = existingUser[0].id;
        }

        res.redirect(`https://backend-canchapro.onrender.com/callback?token=${tokens.access_token}&userId=${userId}`);
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).send('Error en autenticación');
    }
});

// Obtener información del usuario
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email;
        const [user] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({
            id: user[0].id,
            email: user[0].correo,
            name: user[0].nombre,
            role: user[0].rol
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

// Cerrar sesión
app.post('/auth/logout', authenticateToken, async (req, res) => {
    try {
        // Aquí podrías agregar lógica adicional si necesitas invalidar el token
        // Por ejemplo, agregar el token a una lista negra si usas JWT
        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 