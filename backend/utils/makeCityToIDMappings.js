const fs = require('fs');
const csvParser = require('csv-parser');

const cityToID = {};

fs.createReadStream('ids.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    cityToID[row.city] = row.id;
  })
  .on('end', () => {
    // Save the extracted data to a JSON file
    fs.writeFileSync('cityToID.json', JSON.stringify(cityToID));
    console.log('City to ID mapping extracted and saved to cityToID.json');
  });