const cron = require('node-cron');
const { Subscription } = require('./models')

cron.schedule("* * * * *", async () => {
    // TODO: subscritpion expiring
    console.log('job running')
    const sub = await Subscription.findAll();

    for await (let i of sub) {
        let date1 = new Date(sub[i].expires_in);
        let date2 = Date.now()
        if (date1.getTime() < date2.getTime()) {
            sub[i].destroy()
        }
    }
})


