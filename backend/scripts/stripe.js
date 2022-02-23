const stripe = require('stripe')('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')
stripe.paymentIntents.update('pi_3KS3bxDnNgAk4A841QhcER5s', { payment_method: 'pm_1KS3blDnNgAk4A843uZZGuJu' }).then(res => console.log(res))

