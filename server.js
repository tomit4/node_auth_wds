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
        // we could pass the salt above as our second parameter but we can also just pass 10, and the bcrypt.hash() function will do it for us
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user) // send it to the database...obviously far more complicated in a closer to real world application...
        res.status(201).send() // and send the user to a successfully created User html page
    } catch {
        res.status(500).send("error") // this might want to be wrapped in an if statement that checks for exactly WHERE the error occurred
    }
})

// A post request that authenticates our user using bcrypt's native compare() function, notice that we have a separate login page for this post request
// This would be our actual LOGIN
app.post('/users/login', async (req, res) => {
    // I actually hadn't seen the use of Array.prototype.find() method...very useful
    // This searches for the first instance where the req.body.name is equal to the user.name within the users array (our "database") and returns the first instance of it
    const user = users.find(user => user.name = req.body.name)

    if (user == null) { // if however, the users.find() method returned no user
        return res.status(400).send('Cannot find user') // again, this would want to be an html 400 page
    }
    try {
        // note the order of parameters for bcrypt.compare(), it first takes the user's typed password and compares it to the database password, this would be done differently in an SQL style query
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            // This is a 'Password not recognized' message essentially
            res.send('Not Allowed')
        }
    } catch {
        // Otherwise our server/database gave an error...
        res.status(500).send("error")
    }
})

app.listen(3000)