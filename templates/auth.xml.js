var Template = function(authUri, key, qrcode) {

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <document>
    <descriptiveAlertTemplate>
       <title>Scan this QR code to log in</title>
       <description>
        Or go to ${authUri}/activate
        and enter the key "${key}"
       </description>
       <img width="620" height="620" src="${qrcode}" />
    </descriptiveAlertTemplate>
  </document>`

}