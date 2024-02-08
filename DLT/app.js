const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/getTimeStories', async (req, res) => {
  try {
    const url = 'https://time.com';

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      let html = '';

      response.on('data', (chunk) => {
        html += chunk;
      });

      response.on('end', () => {
        const latestStories = [];
        const regex = /<h3[^>]*>(.*?)<\/h3>.*?<a[^>]*href=["'](https?:\/\/[^"']+)["']/gs;

        let match;
        while ((match = regex.exec(html)) !== null) {
          const title = match[1].trim();
          const link = match[2];

          latestStories.push({
            title,
            link: link.startsWith('http') ? link : `https://time.com${link}`
          });

          if (latestStories.length === 6) {
            break;
          }
        }

        res.json(latestStories);
      });
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    console.log('Request completed.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
