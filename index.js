const Express = require('express');
const Cors = require('cors');
const Helmet = require('helmet');
const Fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const App = Express();
const PORT = 300;

App.use(Cors);

App.use(
    Helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            connectSrc: ["'self'", "*"],
        },
    })
);

App.use(Express.json());

App.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

App.post('/send', async (req, res) => {
    const {token, content, channel} = req.body;

    if (!token || !content) {
        return res.status(400).json({error: `Token and content are required`});
    }

    try {
        const Request = await Fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {
            method: 'POST',
            headers: {
                "Authorization": token,
                "Accept": `application/json`,
                "Content-Type": `application/json`,
            },
            body: JSON.stringify({
                content: content,
            }),
        });

        if (!response.ok) {
            const Response = await Request.json();
            throw new Error(`API error: ${Response.message}`);
        }

        const JSON = await response.json();
        res.status(200).json(JSON);
    } catch (Error) {
        console.error('Error sending message: ', Error.message);
        res.status(500).json({error: `Failed to send message`});
    }
});