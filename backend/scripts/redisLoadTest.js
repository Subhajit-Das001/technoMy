const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_URL = 'http://localhost:3001/api/cos_portal/upload'; 
const COOKIE = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY2hvb2xfaWQiOiJJSVRHXzAwMSIsImJyYW5jaF9pZCI6IklJVEdfMDAxNzIxMiIsInNvdXJjZSI6IkNPUyIsImlhdCI6MTc4MDA4MjQ4NCwiZXhwIjoxNzgwMTA3Njg0fQ.4kivFOuOQceTuvUIgkVNwQdshd_E1r_7zcSx89LM_rI'; // <--- PASTE TOKEN HERE
const NUM_REQUESTS = 998; // We will fire 10 concurrent uploads

// Helper: Generates a unique CSV so the file hash check passes
function generateUniqueCSV(index) {
    const filename = `./temp_loadtest_${index}.csv`;
    const header = "name1,dob1,email1,contact1,class1,name2,dob2,email2,contact2,class2,squad,language\n";
    let content = header;
    
    // Generate 50 rows per file with unique emails
    for (let i = 1; i <= 199; i++) {
        content += `StudentA${i},15/08/2010,school${index}_A${i}@test.com,9876543210,10,StudentB${i},16/09/2010,school${index}_B${i}@test.com,9876543211,10,Juniors,English\n`;
    }
    fs.writeFileSync(filename, content);
    return filename;
}

async function runLoadTest() {
    console.log(`🚀 Generating ${NUM_REQUESTS} unique CSVs and firing them simultaneously...\n`);

    const requests = Array.from({ length: NUM_REQUESTS }).map(async (_, i) => {
        const filePath = generateUniqueCSV(i);
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        try {
            const response = await axios.post(API_URL, form, {
                headers: { ...form.getHeaders(), Cookie: COOKIE }
            });
            fs.unlinkSync(filePath); // Clean up temp file
            return `✅ Request ${i}: SUCCESS - Job ID: ${response.data.jobId}`;
        } catch (error) {
            fs.unlinkSync(filePath);
            return `❌ Request ${i}: FAILED - ${error.response?.status || error.message}`;
        }
    });

    const results = await Promise.all(requests);
    console.log('\n📊 --- EXPRESS GATEWAY RESULTS ---');
    results.forEach(res => console.log(res));
}

runLoadTest();