import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const SchoolReg = () => {


    const [school, setSchool] = useState({
        cityCode: "", schoolCode: "", schoolName: "", cityName: ""
    });
    //logic below is to restrict city code and school code to 4 digits
    // const [cityCodeEntered, setCityCodeEntered] = useState('');

    // const handleCityInputChange = (e) => {
    //     const value = e.target.value.replace(/\D/g, '');
    //     if (value <= 9999) {
    //         setCityCodeEntered(value);
    //     }
    // };


    // const [schoolCodeEntered, setSchoolCodeEntered] = useState('');

    // const handleSchoolInputChange = (e) => {
    //     const value = e.target.value.replace(/\D/g, '');
    //     if (value <= 9999) {
    //         setSchoolCodeEntered(value);
    //     }
    // };
    let name, value;
    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setSchool({ ...school, [name]: value });
    };

    const postData = async (e) => {
        e.preventDefault();
        const { cityCode, schoolCode, schoolName, cityName } = school;

        const res = await fetch("/registerschool", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cityCode, schoolCode, schoolName, cityName })
        });

        const data = await res.json();
        if (data.status === 422 || !data) {
            window.alert("Invalid Registration");
            console.log("invalid registration/error occured");
        } else {
            window.alert("Registration successful, now you can register your teams using school code");
            console.log("registration successful");
        }

    };


    return (
        <div className='school-registration-form'>
            <h2 className='form-title'>Register Your School</h2>
            <form method='POST' className='register-form' id='register-form'>
                <div className='form-group'>
                    <label htmlFor='cityCode'>City Code</label>
                    <input type='text' autoComplete='off' name='cityCode' id='cityCode' placeholder='City Code' value={school.cityCode} onChange={handleInput} required />
                </div>

                <div className='form-group'>
                    <label htmlFor='schoolCode'>School Code</label>
                    <input type='text' autoComplete='off' name='schoolCode' id='schoolCode' placeholder='School Code' value={school.schoolCode} onChange={handleInput} required />
                </div>

                <div className='form-group'>
                    <label htmlFor='schoolName'>School Name</label>
                    <input type='text' autoComplete='off' name='schoolName' id='schoolName' placeholder='School Name' size="50" required value={school.schoolName} onChange={handleInput} />
                </div>

                <div className='form-group'>
                    <label htmlFor='cityName'>City Name</label>
                    <input type='text' autoComplete='off' name='cityName' id='cityName' placeholder='City Name' size="50" required value={school.cityName} onChange={handleInput} />
                </div>

                <div className='form-group form-button'>
                    <input type='submit' name='register' id='register' className='form-submit'
                        value='Register'
                        onClick={postData}
                    />
                </div>
            </form>

            <div className='TeamRegButton'>
                <button>
                    <Link to="/teamregister">Add Teams(if school is registered)</Link>
                </button>
            </div>

        </div>



    )
}

export default SchoolReg