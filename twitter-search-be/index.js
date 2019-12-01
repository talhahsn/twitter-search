const express = require('express');
const axios = require('axios');
const qs = require('query-string');
const cors = require('cors');


const PORT = process.env.PORT || 3001;

const server = express();

server.use(cors());

server.get('/api/accessToken', (req, res) => {
    const options = {
        url: 'https://api.twitter.com/oauth2/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${process.env.Authorization}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            grant_type: 'client_credentials',
        }),
    };

    return axios(options).then(item => res.json({
        error: false,
        items: item.data.access_token,
    })).catch(() => {
        res.json({
            error: true,
            message: 'Something went wrong',
        });
    });
});

server.get('/api/tweets', (req, res) => {
    const q = req.query.q || 'news';

    const params = {
        q,
        include_entities: true,
        count: 100,
    };

    axios({
        url: `https://api.twitter.com/1.1/search/tweets.json?${qs.stringify(
            params,
        )}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${req.query.accessToken}`,
            'Content-Type': 'application/json',
        },
    })
        .then(items => {
            res.json({
                error: false,
                items: items.data.statuses,
            });
        })
        .catch(() => {
            res.json({
                error: true,
                message: 'Something went wrong',
            });
        });
});

server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
});