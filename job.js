const cron = require('node-cron');
const { Subscription } = require('./models')

cron.schedule("00 00 00 * * *", async () => {
    // TODO: subscritpion expiring
    console.log('job running')
    const sub = await Subscription.findAll();

    if (sub) {
        for await (let i of sub) {
            let date1 = new Date(i.expires_in);
            let date2 = new Date();

            if (date1.getTime() < date2.getTime()) {
                i.destroy()
            }
        }
    }
}, {
    scheduled: true,
    timezone: "Africa/Lagos"
})


