// const cron = require('node-cron');
// const { Subscription } = require('./models')

// cron.schedule("*/5 * * * * *", async() => {
//     // TODO: subscritpion expiring
//     // console.log('job running')
//   const sub = await Subscription.findAll({ where: { status: true } });
  
//   for await(let i of sub) {
//     if (sub[i].expires_in == Date.now()) {
//       sub[i].status = false;
//       sub[i].save()
//     }
//   }
// })


