'use strict'

const path = require('path')
const config = require(path.join(__dirname, '/../config'))

const Notification = function (mailAgent) {
  this.mailAgent = mailAgent
}

Notification.prototype._buildMessage = function (fields, options, data) {
  return `
  <html>
    <body>
      Dear Commenter,<br>
      <br>
      There was a new comment by ${fields.name} on <a href="${options.origin}">${options.origin}</a>:<br>
      <pre style="margin: 30px">${fields.message}</pre>
      <a href="${options.origin}#comment-${options.id}">View it on ${data.siteName}</a><br>
      <br>
      If you do not wish to receive any further notifications for this thread, <a href="%mailing_list_unsubscribe_url%">unsubscribe</a>.<br>
      <br>
      Best regards,<br>
      Average Linux User<br>
      <br>
      --<br>
      Tutorials on how install, configure and use Linux.<br>
      YouTube: <a href="https://www.youtube.com/AverageLinuxUser">https://www.youtube.com/AverageLinuxUser</a><br>
      Website: <a href="https://averagelinuxuser.com/">https://AverageLinuxUser.com</a><br>
      Facebook: <a href="https://www.facebook.com/AverageLinuxUser">https://www.facebook.com/AverageLinuxUser</a><br>
      Twitter: <a href="https://twitter.com/AVGLinuxUser">https://twitter.com/AVGLinuxUser</a><br>
    </body>
  </html>
  `
}

Notification.prototype.send = function (to, fields, options, data) {
  const subject = data.siteName ? `New reply on "${data.siteName}"` : 'New reply'

  return new Promise((resolve, reject) => {
    this.mailAgent.messages().send({
      from: `Average Linux User <${config.get('email.fromAddress')}>`,
      to,
      subject,
      html: this._buildMessage(fields, options, data)
    }, (err, res) => {
      if (err) {
        return reject(err)
      }

      return resolve(res)
    })
  })
}

module.exports = Notification
