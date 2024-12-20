import React, {useState,useEffect} from 'react';
import Header from "../../Header/header"
import Footer from "../../Footer/footer"

import './kvjnv.css';

const KV_JNV=()=>{
 return(
    <div className="App">
        <div>
        <Header/>
        </div>
        
               <div className="kv-main">
            <div className="kv-main-head">
             <h1 className='kv-main-heading'>KVs & JNVs</h1>
             <p className='kv-main-headings'>Technothlon conducts its examination free of cost for all the KVs & JNVs across the nation and overseas.</p>
            </div>
            <div className="kv-content">
                <div className="kv-stud">
                    <h1 className='kv-student'>For Students</h1>
                    <p className='kv-stud-para'>The examination will take place on 14th July 2024, in Offline Mode. If you wish to participate, contact your principal.</p>
                </div>
                <div className="kv-principal">
                    <h1 >For Principals/Teachers</h1>
                    <p> An official mail containing all the required information & procedure has already been sent to all the regional headquarters as well as all the individual KVs & JNVs. If you haven't recieved the email, please send us a mail at technothlon.kv@gmail.com through your official email-id and we'll provide you with all the necessary details. There is no limit on the number of registrations!</p>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
    )
}
export default KV_JNV;