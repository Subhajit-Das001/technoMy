import React, {useState,useEffect} from 'react';
import './main.css'
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
import Slider from "react-slick";



const Mains=()=>{
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
      };
 return(
    
    <div className="App">
        <Header/>
        <div className="mains-container">

        <div className="main-heading">
            <h2> Technothlon Mains</h2>
            <p> It is an event based competition which is conducted at IIT Guwahati, among the top 25 teams from each squad.</p>
            </div>
           <div className="mains-content">
<div className="mains 23">
    <div className="slider-container">
      <Slider {...settings}>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
        <div className='cont'>
          <h3>1</h3>
        </div>
       
      </Slider>
  </div>

    
</div>
<div className="mains 22">
    <h2 className="h2">Technothlon'22</h2>
    <div className="cont-container"><div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    </div>
    
</div>
<div className="mains 21">
    <h2 className="h2">Technothlon'21</h2>
    <div className="cont-container"><div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
  </div>
</div>
<div className="mains 20">
    <h2 className="h2">Technothlon'20</h2>
    <div className="cont-container"><div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    </div>
</div>
<div className="mains 19">
    <h2 className="h2">Technothlon'19</h2>
    <div className="cont-container"><div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    </div>
</div>
<div className="mains 18">
    <h2 className="h2">Technothlon'18</h2>
    <div className="cont-container"><div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    <div className="cont"><a href=''></a></div>
    </div>
</div>
            </div> 
        </div>
        <Footer/>
    </div>
    )
}
export default Mains;