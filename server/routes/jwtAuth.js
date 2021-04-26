const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator')
const validInfo = require('../middleware/validInfo')
const authorization = require('../middleware/authorization')

router.post('/register', validInfo, async (req, res) => {
    try {
        //1. destructure req.body (name, emai, password)

        const { name, email, password } = req.body;

        //2. check if user exists (if user exists then throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length !== 0) {
            return res.status(401).send('User already exists');
        };

        //3. Bcrypt the user PASSWORD
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const bcryptPassword = await bcrypt.hash(password, salt);
        
        //4. Enter the user inside database
        
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [
            name, email, bcryptPassword
        ]);

        //5. generating jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token })

    } catch (error) {
        console.error('error.message');
        res.status(500).send('Server Error');
    };
});

router.post('/login', validInfo, async (req, res) => {
    const { email, password } = req.body
    
    try {
     
        //2. check if user doesnt exist (if not throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect")
        };

        //3. check if incoming password is the same as database password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect")
        };

        //4. give them jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    };
});

router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

module.exports = router;