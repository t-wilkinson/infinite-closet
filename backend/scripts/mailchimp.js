const mailchimp = require('@mailchimp/mailchimp_marketing')

mailchimp.setConfig({
  apiKey: '7689fa4da0c6233b920f5b9079ee4f81-us19',
  server: 'us19', // TODO: should change this to london but I can't find any nearby (https://status.mailchimp.com/)
})

async function run() {
  let res

  // const remove = [
  //   // '75910866206ffa3',
  //   // 'f65f2e0c02427d6',
  //   // '0600a1c8e1f0',
  //   // 'e54d3f06674f963',
  //   // 'infinite_closet_dev',
  // ]
  // res = await Promise.all(remove.map(id => mailchimp.connectedSites.remove(id)))

  // res = await mailchimp.connectedSites.remove('226630bac60be80')
  // console.log(res)
  // res = await mailchimp.connectedSites.list()
  // console.log(res)
}

run()
