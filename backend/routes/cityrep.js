const express = require('express');
const router = express.Router();
const CityRep = require('../models/cityRep')

router.get('/:zone', async (req, res) => {
    const { zone } = req.params;
    try {
      const cityReps = await CityRep.find({ zone }, 'cityRepID name contact zone');
      if (cityReps.length === 0) {
        return res.status(404).json({ message: `No representatives found for ${zone} zone.` });
      }
      res.status(200).json(cityReps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching city representatives.' });
    }
  });

// Route to dynamically add a new city representative
router.post('/', async (req, res) => {
  const { cityRepID, name, contact, zone } = req.body; // Extract data from the request body
  if (!cityRepID || !name || !contact || !zone) {
    return res.status(400).json({ message: 'Please provide cityRepID, name, contact, and zone.' });
  }
  try {
    const newCityRep = new CityRep({ cityRepID, name, contact, zone });
    await newCityRep.save();
    res.status(201).json({ message: 'City representative added successfully.', cityRep: newCityRep });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the city representative.' });
  }
});


// db.cityreps.find({ zone: "North" }).pretty();


// async function insertCityReps() {

//   const cityReps = [
//     { cityRepID: "CR001", name: "Sree Vaishnava Harshith", contact: "7816016891", zone: "South" },
//     { cityRepID: "CR002", name: "Vennapusa Hasini", contact: "9550776617", zone: "South" },
//     { cityRepID: "CR003", name: "P.Yuva Sai Harshith", contact: "6300406027", zone: "South" },
//     { cityRepID: "CR004", name: "Jahnavi", contact: "6303271509", zone: "South" },
//     { cityRepID: "CR005", name: "Jyothirmayi Chunduru", contact: "8073806682", zone: "South" },
//     { cityRepID: "CR006", name: "Tanmay", contact: "6003476812", zone: "South" },
//     { cityRepID: "CR007", name: "Debarghya Das", contact: "8296202692", zone: "South" },
//     { cityRepID: "CR008", name: "Dhanunjay", contact: "7483853865", zone: "South" },
//     { cityRepID: "CR009", name: "Sanchit Pendharkar", contact: "6363679144", zone: "South" },
//     { cityRepID: "CR010", name: "Tanushree Rao Inna", contact: "6364342775", zone: "South" },
//     { cityRepID: "CR011", name: "Rohit Siva Shankar", contact: "9490761562", zone: "South" },
//     { cityRepID: "CR012", name: "Battula Uday Kiran", contact: "8978909914", zone: "South" },
//     { cityRepID: "CR013", name: "Kummari Premaja", contact: "8985359440", zone: "South" },
//     { cityRepID: "CR014", name: "Pruthvi S Haleholi", contact: "9686514772", zone: "South" },
//     { cityRepID: "CR015", name: "Dhanyatha Marlapalli", contact: "9381939382", zone: "South" },
//     { cityRepID: "CR016", name: "Bharath B Sundar", contact: "7012713235", zone: "South" },
//     { cityRepID: "CR017", name: "Vaddepally Sathwik Goud", contact: "8500018188", zone: "South" },
//     { cityRepID: "CR018", name: "Kunchit Pujari", contact: "8688520864", zone: "South" },
//     { cityRepID: "CR019", name: "Sandyapogu Swetha", contact: "8639567066", zone: "South" },
//     { cityRepID: "CR020", name: "Deepesh Potharaju", contact: "7207459849", zone: "South" },
//     { cityRepID: "CR021", name: "Gugaloth Anuroop Singh", contact: "8317640680", zone: "South" },
//     { cityRepID: "CR022", name: "Adith", contact: "7893813014", zone: "South" },
//     { cityRepID: "CR023", name: "Ananya Madarapu", contact: "9121066648", zone: "South" },
//     { cityRepID: "CR024", name: "Shubha Sravya", contact: "9440351385", zone: "South" },
//     { cityRepID: "CR025", name: "Adith Jayakrishnan", contact: "8848926350", zone: "South" },
//     { cityRepID: "CR026", name: "Jathin Prakash U", contact: "7593994194", zone: "South" },
//     { cityRepID: "CR027", name: "Mourya Krishne Gowda", contact: "8088676846", zone: "South" },
//     { cityRepID: "CR028", name: "Harini Bomma", contact: "9347329598", zone: "South" },
//     { cityRepID: "CR029", name: "Karthik Macherla", contact: "7671895234", zone: "South" },
//     { cityRepID: "CR030", name: "B. Srishanth", contact: "9030916413", zone: "South" },
//     { cityRepID: "CR031", name: "Nandini", contact: "9133710061", zone: "South" },
//     { cityRepID: "CR032", name: "Hari", contact: "9676031970", zone: "South" },
//     { cityRepID: "CR033", name: "Harika Marrapu", contact: "9182486711", zone: "South" },
//     { cityRepID: "CR034", name: "Megha Shyam", contact: "8328233683", zone: "South" },
//     { cityRepID: "CR035", name: "Chintapalli Jahnavi", contact: "9100191255", zone: "South" },
//     { cityRepID: "CR036", name: "Sri Krishna Chaitanya", contact: "8247443593", zone: "South" },
//     { cityRepID: "CR037", name: "Shyamm Kisshore Kolli", contact: "9705242179", zone: "South" },
//     { cityRepID: "CR038", name: "Thanuj Silla", contact: "9121630806", zone: "South" },
//     { cityRepID: "CR039", name: "Jesswin George", contact: "8891902062", zone: "South" },
//     { cityRepID: "CR040", name: "Tejitha Chowdary", contact: "9963505509", zone: "South" },
//     { cityRepID: "CR041", name: "Akshitha", contact: "9063709211", zone: "South" },
//     { cityRepID: "CR042", name: "Vishnu Nandan", contact: "9849669329", zone: "South" },
//     { cityRepID: "CR043", name: "Snikitha Ankam", contact: "7680897158", zone: "South" },
//     { cityRepID: "CR044", name: "Chinta Chetana Sree", contact: "6281548991", zone: "South" },
//     { cityRepID: "CR045", name: "Ram Tej Duvvuri", contact: "9392731091", zone: "South" },
//     { cityRepID: "CR046", name: "Sreeharsh", contact: "7736732292", zone: "South" },
//     { cityRepID: "CR047", name: "Divyamsh", contact: "6283261339", zone: "North" },
//   { cityRepID: "CR048", name: "Pakhi Debnath", contact: "7009059723", zone: "North" },
//   { cityRepID: "CR049", name: "Ridhima Gupta", contact: "7087500534", zone: "North" },
//   { cityRepID: "CR050", name: "Naman Goyal", contact: "8283938869", zone: "North" },
//   { cityRepID: "CR051", name: "Arsh Bhatia", contact: "7018025927", zone: "North" },
//   { cityRepID: "CR052", name: "Janhvi Mittal", contact: "8708566502", zone: "North" },
//   { cityRepID: "CR053", name: "Gurchet Singh Thind", contact: "9872499055", zone: "North" },
//   { cityRepID: "CR054", name: "Aditya Marwaha", contact: "9988777490", zone: "North" },
//   { cityRepID: "CR055", name: "Anuj Kumar", contact: "8433034127", zone: "North" },
//   { cityRepID: "CR056", name: "Ashish Kumar Yadav", contact: "9559913600", zone: "North" },
//   { cityRepID: "CR057", name: "Vansh Yadav", contact: "7206120179", zone: "North" },
//   { cityRepID: "CR058", name: "Dhairya", contact: "9478714630", zone: "North" },
//   { cityRepID: "CR059", name: "Niket Garg", contact: "7814673523", zone: "North" },
//   { cityRepID: "CR060", name: "Amogh Anant", contact: "7068896075", zone: "North" },
//   { cityRepID: "CR061", name: "Amaan Farooq", contact: "8493944242", zone: "North" },
//   { cityRepID: "CR062", name: "Kabya Ranjan Chaubey", contact: "6307043498", zone: "North" },
//   { cityRepID: "CR063", name: "Shreshtha Rastogi", contact: "7233951978", zone: "North" },
//   { cityRepID: "CR064", name: "Yogita Basu Deo", contact: "7057357386", zone: "North" },
//   { cityRepID: "CR065", name: "Anshul Verma", contact: "9555974250", zone: "North" },
//   { cityRepID: "CR066", name: "Rishi Gupta", contact: "7905023313", zone: "North" },
//   { cityRepID: "CR067", name: "Prakhar Gupta", contact: "9235527628", zone: "North" },
//   { cityRepID: "CR068", name: "Ayush Tiwari", contact: "9045338646", zone: "North" },
//   { cityRepID: "CR069", name: "Shlok Pratap Singh", contact: "9997001125", zone: "North" },
//   { cityRepID: "CR070", name: "Rudra Yadav", contact: "6394475616", zone: "North" },
//   { cityRepID: "CR071", name: "Riya Kumari", contact: "9695932630", zone: "North" },
//   { cityRepID: "CR072", name: "Alok Raj", contact: "7209178511", zone: "North" },
//   { cityRepID: "CR073", name: "Ayush Yadav", contact: "7668596497", zone: "North" },
//   { cityRepID: "CR074", name: "Abhniav Rai", contact: "7004772095", zone: "North" },
//   { cityRepID: "CR075", name: "Jahnavi Priya", contact: "9693785594", zone: "North" },
//   { cityRepID: "CR076", name: "Uday Kumar", contact: "9199805738", zone: "North" },
//   { cityRepID: "CR077", name: "Manish Sharma", contact: "8873438863", zone: "North" },
//   { cityRepID: "CR078", name: "Aryan Anjan", contact: "9113110832", zone: "North" },
//   { cityRepID: "CR079", name: "Ankit Vidyarthi", contact: "9341087727", zone: "North" },
//   { cityRepID: "CR080", name: "Anirudha Pratap Singh", contact: "9569402133", zone: "North" },
//   { cityRepID: "CR081", name: "Rishav Kumar", contact: "7023315765", zone: "West" },
//   { cityRepID: "CR082", name: "Deep Rajesh Shah", contact: "8511107997", zone: "West" },
//   { cityRepID: "CR083", name: "Rajvardhan Sonavadekar", contact: "7038523844", zone: "West" },
//   { cityRepID: "CR084", name: "Sujal Mulewa", contact: "9343376019", zone: "West" },
//   { cityRepID: "CR085", name: "Muskan", contact: "8619271515", zone: "West" },
//   { cityRepID: "CR086", name: "Amogh Anand Kahalekar", contact: "7620789341", zone: "West" },
//   { cityRepID: "CR087", name: "Rahul Jangid", contact: "9079479169", zone: "West" },
//   { cityRepID: "CR088", name: "Animesh Datir", contact: "9529856874", zone: "West" },
//   { cityRepID: "CR089", name: "Aayush Rathi", contact: "9023942652", zone: "West" },
//   { cityRepID: "CR090", name: "Aneesh Bhate", contact: "9607227534", zone: "West" },
//   { cityRepID: "CR091", name: "Raghav Awadh Sahu", contact: "8770482642", zone: "West" },
//   { cityRepID: "CR092", name: "Yash Jaiswal", contact: "7771020162", zone: "West" },
//   { cityRepID: "CR093", name: "Tarun Gupta", contact: "6378887527", zone: "West" },
//   { cityRepID: "CR094", name: "Kushagra Singhal", contact: "9414502406", zone: "West" },
//   { cityRepID: "CR095", name: "Apurva Ambike", contact: "9423759774", zone: "West" },
//   { cityRepID: "CR096", name: "Ananya Dongsarwar", contact: "9022938803", zone: "West" },
//   { cityRepID: "CR097", name: "Ayush Mangal", contact: "7357578070", zone: "West" },
//   { cityRepID: "CR098", name: "Manthankumar Bagade", contact: "8160988491", zone: "West" },
//   { cityRepID: "CR099", name: "Arjun Rathod", contact: "8999848045", zone: "West" },
//   { cityRepID: "CR100", name: "Piyush Mehra", contact: "9329606730", zone: "West" },
//   { cityRepID: "CR101", name: "Praveen Suthar", contact: "8233913098", zone: "West" },
//   { cityRepID: "CR102", name: "Pushpam Mishra", contact: "7738987732", zone: "West" },
//   { cityRepID: "CR103", name: "Shikhar Jindal", contact: "9829863827", zone: "West" },
//   { cityRepID: "CR104", name: "Sanjay Saini", contact: "7877783454", zone: "West" },
//   { cityRepID: "CR105", name: "Nishant", contact: "9374716508", zone: "West" },
//   { cityRepID: "CR106", name: "Nihira Patwardhan", contact: "9977678139", zone: "West" },
//   { cityRepID: "CR107", name: "Ruchir Sharma", contact: "7878091872", zone: "West" },
//   { cityRepID: "CR108", name: "Ved Himmatbhai Jani", contact: "9106424705", zone: "West" },
//   { cityRepID: "CR109", name: "Abhishek Tyagi", contact: "7489511821", zone: "West" },
//   { cityRepID: "CR110", name: "Anshul Merotha", contact: "6376841287", zone: "West" },
//   { cityRepID: "CR111", name: "Jayansh Khandelwal", contact: "8279234990", zone: "West" },
//   { cityRepID: "CR112", name: "Shreyansh Kumar", contact: "9835398200", zone: "East" },
//   { cityRepID: "CR113", name: "Ronik Hazra", contact: "9002864776", zone: "East" },
//   { cityRepID: "CR114", name: "Ritik Raj", contact: "6200716689", zone: "East" },
//   { cityRepID: "CR115", name: "Poulomi Chakraborty", contact: "9954704388", zone: "East" },
//   { cityRepID: "CR116", name: "Harsha Chandak", contact: "8822350266", zone: "East" },
//   { cityRepID: "CR117", name: "Abdullah Alom", contact: "9863480552", zone: "East" },
//   { cityRepID: "CR118", name: "Annway Samal", contact: "7478255987", zone: "East" },
//   { cityRepID: "CR119", name: "Sudipto Ghosh", contact: "9932115340", zone: "East" }
//   ];
  
  
//     await CityRep.insertMany(cityReps);
//     console.log('City reps inserted!');
//   }
  
//   insertCityReps().catch(err => console.log(err));

module.exports = router;
