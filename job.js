const cron = require('node-cron');
const { Subscription } = require('./models')

cron.schedule("* * * * *", async () => {
    // TODO: subscritpion expiring
    console.log('job running')
    const sub = await Subscription.findAll();

    for await (let i of sub) {
        console.log(i)
        let date1 = new Date(i.expires_in);
        let date2 = new Date()
        console.log(date1)
        console.log(date2)
        if (date1.getTime() < date2.getTime()) {
            i.destroy()
        }
    }
})


