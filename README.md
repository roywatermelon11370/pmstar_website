2018 - 2019 流音之星
===

網站連結： https://www.pmstar.com.tw

---

## 使用這份程式碼

```bash
git clone https://github.com/t510599/pmstar_website.git

cd pmstar_website

npm install

mkdir upload

vim model/reCAPTCHA.js #(你需要先去reCAPTCHA註冊)

npm start
```

`model/reCAPTCHA.js`:  
```javascript
var reCAPTCHA = require('recaptcha2');

recaptcha = new reCAPTCHA({
    siteKey: 'sitekey here',
    secretKey: 'secretkey here'
});

function isValid(req, res, next) {
    recaptcha.validateRequest(req)
        .then(function() {
            next();
        }).catch(function() {
            req.flash('error', "reCAPTCHA驗證錯誤");
            res.redirect("/admin");
        });
}

module.exports = isValid;

```