const cron = require('node-cron');
const { Subscription } = require('./models')

cron.schedule("* * * * *", async () => {
    // TODO: subscritpion expiring
    console.log('job running')
    const sub = await Subscription.findAll();

    for await (let i of sub) {
        let date = new Date(sub[i].expires_in);
        if (date <= Date.now()) {
            sub[i].destroy()
        }
    }
})


