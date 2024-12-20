import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import './paymentConfirmed.css';
import Header from '../../../Header/header';
import Footer from '../../../Footer/footer';

const PaymentConfirmed = () => {
    const { ciphertext } = useParams();
    let rollNumber = '';

    for (let i = ciphertext.length - 1; i >= 0; i--) {
        if (ciphertext[i] === '&') {
            break;
        }
        rollNumber = ciphertext[i] + rollNumber;
        console.log(rollNumber);
        console.log(ciphertext);
      


    }

    useEffect(() => {

        console.log(rollNumber);
        handlePayment(rollNumber);
    }, [rollNumber])

    const baseURL = process.env.NODE_ENV==="production"? "/api" : "http://localhost:3001/api";
    const handlePayment = async (rollNumber) => {
        try {
            const body = JSON.stringify({
                rollNumber,
                paymentStatus: "success" 
            });

            console.log(body);

            const res = await fetch(`${baseURL}/handlePayment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
                
            });

            console.log(res);

            if(res.ok) {
                console.log("Payment successful");
            }

            else {
                console.log("Payment failed");
            }

        } catch(error) {
            console.log(error);
        }
    }

  return (
    <div className="team-verified-container">
      <Header />
      <div className="message">
        <h1>You have successfully paid the registration fees.</h1>
        <p> Kindly check your email for email verification.</p>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default PaymentConfirmed;

// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './paymentConfirmed.css';
// import Header from '../../../Header/header';
// import Footer from '../../../Footer/footer';

// // Define handlePayment outside of the component to prevent function re-creation
// const handlePayment = async (rollNumber, baseURL) => {
//     try {
//         const body = JSON.stringify({
//             rollNumber,
//             paymentStatus: "success"
//         });

//         console.log(body);

//         const res = await fetch(`${baseURL}/handlePayment`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: body
//         });

//         console.log(res);

//         if (res.ok) {
//             console.log("Payment successful");
//         } else {
//             console.log("Payment failed");
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

// const PaymentConfirmed = () => {
//     // const { ciphertext } = useParams();
//     const ciphertext = 'someciphertext&otherdata'; // Replace this with a test string

//     let rollNumber = '';

//     // Extract roll number from ciphertext
//     for (let i = ciphertext.length - 1; i >= 0; i--) {
//         if (ciphertext[i] === '&') {
//             break;
//         }
//         rollNumber = ciphertext[i] + rollNumber;
//         console.log(rollNumber);
//     }


//     // Base URL for API requests
//     const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

//     // useEffect hook with rollNumber as a dependency
//     useEffect(() => {
//         if (rollNumber) {
//             handlePayment(rollNumber, baseURL); // Call handlePayment with rollNumber and baseURL
//         }
//     }, [rollNumber, baseURL]);  // Include baseURL in the dependency array

//     return (
//         <div className="team-verified-container">
//             <Header />
//             <div className="content">
//                 <h1>You have successfully paid the registration fees. Kindly check your email for email verification.</h1>
//             </div>
//             <Footer className="footer" />
//         </div>
//     );
// };

// export default PaymentConfirmed;

