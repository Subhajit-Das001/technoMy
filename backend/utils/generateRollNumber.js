const cityToID = require('./cityToID.json');

// Generate roll number based on squad, language, and city
function generateRollNumber(squad, language, city, studentCount) {


    const medium = (language === "Hindi") ? "H" : "E";
    const squadCode = (squad === "Hauts") ? "HE" : "JR";
    const year =25;
    const cityID = cityToID[city];
    const mode="N";
    // Format student count to always have 4 digits
    const paddedStudentCount = String(studentCount).padStart(5, '0');

    // Pad the city ID to be always 3 digits long
    const paddedCityID = String(cityID).padStart(3, '0');

    // Concatenate components to generate roll number
    const rollNumber = `${squadCode}${year}${mode}${medium}${paddedCityID}${paddedStudentCount}`; //(1+2+1+1+1+3+5=14)

    return rollNumber;
}

module.exports = generateRollNumber;