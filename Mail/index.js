const validateInput = require('../lib/validate-input')
const generateMail = require('../lib/generate-mail')
const sendMail = require('../lib/send-mail')
const response = require('../lib/get-response-object')
const { RECEIVER_CHUNK_SIZE, CHUNK_TIMEOUT_MS } = require('../config')

module.exports = async function (context, req) {
  const message = req.body
  const { validationMatched, validationError, validationMessage } = validateInput(context, message)
  if (!validationMatched) {
    return response({
      message: validationMessage,
      error: validationError || ''
    }, 400)
  }

  // If bulk message - all recipients gets the email, but only to themselves as recipient (they will not see other recipients)
  if (message.type === 'bulk') {
    const receiverChunks = []
    const chunkSize = RECEIVER_CHUNK_SIZE
    for (let i = 0; i < message.to.length; i += chunkSize) {
      const chunk = message.to.slice(i, i + chunkSize)
      receiverChunks.push(chunk)
    }

    const res = {
      success: [],
      failed: []
    }
    let receiverIndex = 0
    for (const receivers of receiverChunks) {
      const mail = generateMail({ ...message, to: receivers })

      try {
        await sendMail(context, mail)
        res.success.push(mail)
      } catch (error) {
        res.failed.push({
          error: error.responseMessage || error,
          mail
        })
      }
      receiverIndex++
      if (receiverIndex !== receiverChunks.length) await new Promise(resolve => setTimeout(resolve, CHUNK_TIMEOUT_MS))
    }

    return { status: 200, body: res }
  } else {
    const mail = generateMail(message)
    try {
      await sendMail(context, mail)
      return response(mail)
    } catch (error) {
      return response({
        error: error.responseMessage || error,
        mail
      }, 500)
    }
  }
}
