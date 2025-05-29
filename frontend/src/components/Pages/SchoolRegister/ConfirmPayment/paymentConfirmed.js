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
        </div>
      <Footer className="footer" />
    </div>
  );
};

export default PaymentConfirmed;