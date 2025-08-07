const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BASE_URL = 'https://api.stackexchange.com/2.3/questions';
const PAGE_SIZE = 100;
const MAX_PAGES = 20;

const OUTPUT_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'stackoverflow-questions.json');

async function fetchQuestions() {
    let allQuestions = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
        const { data } = await axios.get(BASE_URL, {
            params: {
                site: 'stackoverflow',
                pagesize: PAGE_SIZE,
                page,
                order: 'desc',
                sort: 'activity',
                filter: 'withbody'
            }
        });

        allQuestions.push(...data.items);

        console.log(`Fetched page ${page}, total so far: ${allQuestions.length}`);

        if (!data.has_more) break;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuestions, null, 2));
    console.log(`✅ Saved to ${OUTPUT_FILE}`);
}

fetchQuestions().catch(console.error);
