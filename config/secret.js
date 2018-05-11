module.exports = {

  database: process.env.DATABASE || 'mongodb://saadie:saadie@ds119820.mlab.com:19820/fiverr-clone',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'fiverclone-123',

}
