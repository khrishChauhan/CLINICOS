const fs = require('fs');
const html = fs.readFileSync('EMR_Schema.html', 'utf8');
const text = html.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n');
fs.writeFileSync('EMR_Schema.md', text);
