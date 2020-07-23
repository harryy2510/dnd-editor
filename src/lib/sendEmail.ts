declare var Email: any
const sendEmail = (emails: string = '', body: string = '') => {
    const promises = emails
        .split(',')
        .map((email) => email.trim())
        .map((To) => ({
            Host: 'in-v3.mailjet.com',
            Username: 'efcd814bec8d79c110b0fd1a010a54dc',
            Password: '4debc870750857180f6df758b651f6aa',
            To,
            From: 'test@appointy.tech',
            Subject: 'Test Email',
            Body: body
        }))
        .map((email) => Email.send(email))
    return Promise.all(promises)
}

export default sendEmail
