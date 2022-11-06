const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const secondName = req.body.secondName
    const email = req.body.email
    console.log(firstName, secondName, email)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    }
    const JsonData = JSON.stringify(data)

    const url = 'https://us21.api.mailchimp.com/3.0/lists/af4fafd9f5'
    const option = {
        method: 'POST',
        auth: 'akachukwu:0928ba9ae5cd8ba2cc29ea493d088b45-us21'
    }

    const request = https.request(url, option, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        } else {
            res.sendFile(`${__dirname}/failure.html`)
        }
        response.on('data', (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(JsonData)
    request.end()
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => console.log('Server started on port 3000'))

// API KEY
// 0928ba9ae5cd8ba2cc29ea493d088b45-us21
// LIST ID
// af4fafd9f5

// us21.api.mailchimp.com/3.0/lists/af4fafd9f5