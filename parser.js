require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(proccess.env.SENDGRID_API_KEY)
// proccess.env.SENDGRID_API_KEY 

const nightmare = require('nightmare')()
// priceblock_ourprice
// https://www.amazon.com/EVGA-GeForce-Technology-Backplate-24G-P5-3987-KR/dp/B08J5F3G18

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]
checkPrice()

async function checkPrice() {
    try {
        const priceString = await nightmare.goto("https://www.amazon.com/MSI-RTX-3080-Architecture-10G/dp/B08QW8BKDV")
                                        .wait("#priceblock_ourprice")
                                        .evaluate(() => document.getElementById('priceblock_ourprice').innerText)
                                        .end()
    
    // const priceNumber = parseInt(priceString.replace('$', ''))
    const priceNumber = parseInt(priceString.replace(/[^0-9\.]+/g, ""))
    
    if(priceNumber < 1500) {
        sendEmail('Price is Low', 
        `The price on ${url} has dropped below ${minPrice}`
        )
    } 
    } catch(e) {
        sendEmail('Amazon price checker error', e.message)
        throw e
    }
     
}

function sendEmail(subject, body) {
    const email = {
        to: 'picire2970@186site.com',
        from: 'some-email@email.com',
        subject: subject,
        text: body,
        html: body
    }
    return sgMail.send(email)
}