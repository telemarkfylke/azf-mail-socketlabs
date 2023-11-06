module.exports = {
  SOCKETLABS_SERVER_ID: process.env.SOCKETLABS_SERVER_ID,
  SOCKETLABS_API_KEY: process.env.SOCKETLABS_API_KEY,
  RECEIVER_CHUNK_SIZE: Number(process.env.RECEIVER_CHUNK_SIZE) ?? 300,
  CHUNK_TIMEOUT_MS: Number(process.env.CHUNK_TIMEOUT_MS) ?? 500,
  E18_ENABLED: process.env.E18_URL && process.env.E18_URL.startsWith('https://') || false
}
