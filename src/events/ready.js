const { ActivityType } = require('discord.js');

const statusArray = [
    { content: '/commands | CJSBot', type: ActivityType.Listening, status: 'online' },
    { content: '/help | CJSBot', type: ActivityType.Listening, status: 'online' },
    { content: '/quotes | CJSBot', type: ActivityType.Listening, status: 'online' },
    { content: '/tickets | CJSBot', type: ActivityType.Watching, status: 'online' }
];

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online.`);

        let index = 0; // Start with the first presence in the array

        // Function to set the next presence
        async function setNextPresence() {
            try {
                const currentStatus = statusArray[index];
                console.log('Setting presence to:', currentStatus);
                
                await client.user.setPresence({
                    activities: [
                        {
                            name: currentStatus.content,
                            type: currentStatus.type,
                        },
                    ],
                    status: currentStatus.status
                });

                // Increment index to move to the next status
                index = (index + 1) % statusArray.length; // Wraps around to 0 after reaching the end

            } catch (error) {
                console.error('Error setting presence:', error);
            }
        }

        // Rotate presence every 5 minutes
        setInterval(setNextPresence, 5 * 60 * 1000);

        // Set initial presence
        try {
            await setNextPresence();
        } catch (error) {
            console.error('Error during initial presence setup:', error);
        }
    },
};
