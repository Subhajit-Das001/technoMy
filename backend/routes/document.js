const fs = require('fs');
const path = require('path');

// Helper function to get base64 from file
const base64Encode = (file) => {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
};

// Paths to your images
const iitgLogoPath = path.join(__dirname, 'IITGlogo.png');
const technoLogoPath = path.join(__dirname, 'TechnoLogo.png');
const technicheLogoPath = path.join(__dirname, 'TechnicheLogo.png');
const owlbertImagePath = path.join(__dirname, 'owlbert.png');
const convSignPath = path.join(__dirname, 'Sign.png');

// Base64 encoded images
const iitgLogoBase64 = base64Encode(iitgLogoPath);
const technoLogoBase64 = base64Encode(technoLogoPath);
const technicheLogoBase64 = base64Encode(technicheLogoPath);
const owlbertImageBase64 = base64Encode(owlbertImagePath);
const SignImageBase64 = base64Encode(convSignPath);

module.exports = ({ name1, name2, roll,centre }) => {
    return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Admit Card</title>
    <style>
        body {
            font-family: "Trebuchet MS", Tahoma, sans-serif;
        }
    </style>
</head>
<body>
    <div class="main" style="margin:0;">
        <div class="header" style="width: 100%; display: flex; flex-direction: row; justify-content: space-around; align-items: center; margin-bottom: 20px; padding-bottom: 30px; box-sizing: border-box; background-color: #E35428;">
            <img class="img1" src="data:image/png;base64,${iitgLogoBase64}" alt="IITG Logo" style="width: 100px; height: 100px; margin-bottom: 30px;margin-right:240px;margin-left:40px;margin-top:30px;">
            <img class="img2" src="data:image/png;base64,${technoLogoBase64}" alt="Techno Logo" style="width: 350px; height: 85px; margin-bottom: 30px;margin-right:200px;margin-top:30px;">
            <img class="img3" src="data:image/png;base64,${technicheLogoBase64}" alt="Techniche Logo" style="width: 170px; height: 54px; margin-bottom: 45px;margin-top:30px;">
        </div>
        <div style="width:100%; display: flex; justify-content: center;">
            <div class="card" style="font-size: 50px; font-weight: bold;margin-top:40px;padding-bottom:10px; margin-bottom: 40px; margin-right: 50px;margin-left:50px;border-bottom: 5px solid black;">Admit Card</div>
            <table style="width: 1170px; border-collapse: collapse;">
                <tr>
                    <td style="width:350px;padding: 20px; border: none;">
                        <div class="heading" style="display: flex; flex-direction: column; align-items: center; box-sizing: border-box;margin-left:80px;margin-right:80px;">
                            <div class="img"><img src="data:image/png;base64,${owlbertImageBase64}" alt="Owlbert" style="width: 300px; height: 430px; margin-bottom: 20px;margin-left:40px;"></div>
                        </div>
                    </td>
                    <td style="width:700px;padding: 20px; border: none;margin-left:0px;">
                        <div class="details" style="margin-bottom:30px;margin-left:0px;">
                            <div class="date" style="font-size: 28px; margin-top:10px;margin-bottom:10px;">Date Of Exam: 14th July, 2024</div>
                            <div class="time" style="font-size: 28px; margin-top:10px;margin-bottom:10px;">
                                Reporting Time: 10:00 am <br>
                                Time of exam: 11:00 am - 1:00 pm
                            </div>
                            <div class="name1" style="font-size: 28px;margin-top:10px;margin-bottom:10px;">Name 1: ${name1}</div>
                            <div class="name2" style="font-size: 28px;margin-top:10px;margin-bottom:10px;">Name 2: ${name2}</div>
                            <div class="roll" style="font-size: 28px; margin-top:10px;margin-bottom:10px;">Roll Number: ${roll}</div>
                            <div class="centername" style="font-size: 28px; margin-top:10px;margin-bottom:10px;">Exam Center: ${centre}</div>
                        </div>
                    </td>
                </tr>
            </table>
            <div class="instructions" style="font-size:24px;margin-left:50px;margin-right:40px;">
                <h2 style="margin-top:30px;">INSTRUCTIONS FOR PRELIMS</h2>
                <ol style="margin-top:15px;">
                    <li style="margin-top:10px;margin-bottom:5px;">All registered candidates are required to download and carry a printed copy of the Admit Card on the day of the examination along with an Original Id Proof( Aadhar card/School Id card).</li>
                    <li style="margin-top:10px;margin-bottom:5px;">The Examination will be of 2 hours duration from 11 a.m. to 1 p.m.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Reporting time: 10 a.m. Final entry in the examination centre will be at 10:30 a.m. Participants are expected to settle down by 10:30 a.m.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Candidates must carry an original id proof of themselves like Aadhar Card or School Id Card.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Candidates will not be allowed to leave the examination hall before 1 p.m.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Candidates are required to bring a BLACK BALL POINT PEN with them.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Blank papers, clipboards, log tables, slide rulers, calculators, cellular phones, pagers and any other electronic gadgets are not allowed. Any such objects must be deposited with the invigilator/city representative before the start of the examination and can be collected after the completion of the examination.</li>
                    <li style="margin-top:10px;margin-bottom:5px;">Use of any sort of unfair means is contrary to the spirit of the examination and will lead to immediate disqualification.</li>
                </ol>
            </div>
            <div class="conv-sign" style="margin-top: 30px;margin-bottom:0px; text-align: right;margin-right:100px;font-size:20px;">
                <img src="data:image/png;base64,${SignImageBase64}" alt="Signature Placeholder" style="width: 150px;height:60px; margin-right:0px;">
                <br>Samyak Sharma<br>Convener<br>Techniche 2024
            </div>
        </div>
    </div>
</body>
</html>

    `;
};
