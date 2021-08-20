//  An extremely simple express app that demonstrates the capabilities of the bcrypt encryption algorithm

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')


app.use(express.json())
// The users array is a stand in for our database
const users = []

// This route is similar to our vue_do_it application which has a route from which our database is connected
app.get('/users', (req, res) => {
    res.json(users)
})


// A post request that will send a new user with a bcrypt hashed/salted password to the database
// This logic would be utilized as a CREATE NEW USER page
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10) // we could pass the salt above as our second parameter but we can also just pass 10, and the bcrypt.hash() function will do it for us
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send("error")
    }
})

// A post request that authenticates our user using bcrypt's native compare() function, notice that we have a separate login page for this post request
// This would be our actual LOGIN
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name) // searches for the first instance where the req.body.name is equal to the user.name within the users array (our "database") and returns the first instance of it
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send("error")
    }
})

app.listen(3000)