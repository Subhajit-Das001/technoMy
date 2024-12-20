import React, { useState } from 'react';
import './RegisteredSchool.css';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
    
    const RegisteredSchool = () => {
        const schoolNames = [
            "ALLEN Career Institute Ahmedabad",
            "ALLEN Career Institute Alwar",
            "ALLEN Career Institute Amritsar",
            "ALLEN Career Institute Bengaluru",
            "ALLEN Career Institute Bhilwara",
            "ALLEN Career Institute Bhopal",
            "ALLEN Career Institute Bhubaneswar",
            "ALLEN Career Institute Burhanpur",
            "ALLEN Career Institute Chandigarh",
            "ALLEN Career Institute Chennai",
            "ALLEN Career Institute Churu Taranagar",
            "ALLEN Career Institute Coimbatore",
            "ALLEN Career Institute Dehradun",
            "ALLEN Career Institute Delhi NCR",
            "ALLEN Career Institute Durgapur",
            "ALLEN Career Institute Faridabad",
            "ALLEN Career Institute Ghazibad",
            "ALLEN Career Institute Guwahati",
            "ALLEN Career Institute Gwalior",
            "ALLEN Career Institute Hisar",
            "ALLEN Career Institute Hubballi",
            "ALLEN Career Institute Indore",
            "ALLEN Career Institute Jaipur",
            "ALLEN Career Institute Kanwartara",
            "ALLEN Career Institute Kochi",
            "ALLEN Career Institute Kolkata",
            "ALLEN Career Institute Kota",
            "ALLEN Career Institute Latur",
            "ALLEN Career Institute Lucknow",
            "ALLEN Career Institute Mangalore",
            "ALLEN Career Institute Mhow",
            "ALLEN Career Institute Mumbai",
            "ALLEN Career Institute Mysuru",
            "ALLEN Career Institute Nagpur",
            "ALLEN Career Institute Namakkal",
            "ALLEN Career Institute Nashik",
            "ALLEN Career Institute Pondicherry",
            "ALLEN Career Institute Raipur",
            "ALLEN Career Institute Rajkot",
            "ALLEN Career Institute Ranchi",
            "ALLEN Career Institute Rawatbhata",
            "ALLEN Career Institute Rohtak",
            "ALLEN Career Institute Sikar",
            "ALLEN Career Institute Siliguri",
            "ALLEN Career Institute Surat",
            "ALLEN Career Institute Tirupati",
            "ALLEN Career Institute Udaipur",
            "ALLEN Career Institute Ujjain",
            "ALLEN Career Institute Vadodara",
            "Sri Sathya Sai Vidya Vihar Indore",
            "Odisha Adarsha Vidyalaya Sambalpur",
            "Oshonic Higher Secondary School Tikamgarh",
            "Knowledge Public High School Timarni",
            "RSA Coaching Academy Khandwa",
            "Gurukul Public High School Khetia",
            "Physics Wallah JP Nagar Branch Bangalore",
            "Sri Prakash Vidya Niketan Rajamundry",
            "Sri Abhyasa English Medium School Kovvur",
            "Harvest International School Bangalore",
            "Tirumala School Bhimavaram",
            "Sai Krupa Junior College Girls Dharmavaram",
            "Quest Anantapur",
            "Nalagonda Public School Nalagonda",
            "Narayana College Secunderabad",
            "Teja Vidyalaya Kodad",
            "KSR Akshara Academy Namakkal",
            "The Cauldron High School LB Nagar Hyderabad",
            "St. Andrew's School Kompally Hyderabad",
            "Mount Basil High School Mahabubnagar",
            "SR Prime Hanamkonda",
            "Learner's Land High School Hanamkonda",
            "Sree Valmeeke School Kadiri",
            "Sai Vijetha School Tadipatri",
            "GMR Varalakshmi DAV Public School Vijayanagaram",
            "Akshaya Foundation School Chanda Nagar Hyderabad",
            "Shloka School Jadcherla",
            "Bibi Kaulan Ji Sr Sec Public School Amritsar",
            "Yaduvanshi Shiksha Niketan Sector 92 Gurugram",
            "Neena Thapa Inter College Gorakhpur",
            "KCM World School Palwal",
            "Shreeji Baba School Mathura",
            "Ryan International School Greater Noida",
            "Ednite Institute For Success Chandigarh",
            "Polytechnic English School Gaya",
            "Mishra Maths Patna",
            "Vivekananda Kendra Vidyalaya Nirjuli",
            "HBCSE Sakchi Centre Jamshedpur",
            "North East Public School Guwahati",
            "Sishu Pathsala HS School Dhubri",
            "Bhargav Academy Nanded",
            "PP Savani Vidhyabhavan Surat",
            "Amity School Bharuch",
            "Saint Paul's School Rajkot",
            "Vinayak School Sikar",
            "Esteller Academy Goa",
            "RG Academy Ajmer"];    

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredSchools = schoolNames.filter(school => 
        school.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='App'>
            <div className="header">
                <Header />
            </div>
            <div className="center-main">
                <div className="center-head">
                    <h2>Centers</h2>
                   
                </div>
                <input style={{marginTop:"5%",
                    borderColor: '#007bff',
    outline: 'none',
    borderRadius:'5px',
    boxShadow: "0px 2px 4px rgba(0, 123, 255, 0.5)"}}
                        type="text" 
                        placeholder="Search by city" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                <div className="center-content">
                    <ul>
                        {filteredSchools.map((school, index) => (
                            <li key={index}>{school}</li>
                        ))}
                    </ul>
                </div>
                
            </div>
            <Footer />
        </div>
    );
};

export default RegisteredSchool;
