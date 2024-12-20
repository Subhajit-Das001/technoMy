import React from 'react';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';
import './videos.css'

const Videos = () => {
    return (
        <div className="App">
            <div className="header">
                <Header/>
            </div>
            <div className="videos-main">
            <div className="vid-rec">
            <iframe width="800" height="550" src="https://www.youtube.com/embed/s9n_fhcBaaM?si=MBOiOqtrw70LEVNi" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  allowfullscreen></iframe>
<p>Technothlon Official Curtain Raiser 2024</p>
            </div>
            <div className="vid-past">
                <div className="video">
                <div  className='vid'>
                <iframe width="300" height="250" src="https://www.youtube.com/embed/_P0SMFzvYl4?modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>Technothlon Official Curtain Raiser 2023</p>
                </div>
                <div className='vid'>
                <iframe width="300" height="250" src="https://www.youtube.com/embed/Vb2w-d0bwko?si=zTmMAhR580iD-aNB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>Technothlon Official Curtain Raiser 2022</p>
                </div>
                <div className='vid'><iframe width="300" height="250" src="https://www.youtube.com/embed/fPTxLFld4ks?si=-XOA2-hSarnxhsic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>Technothlon Official Curtain Raiser 2021</p></div>
                
                </div>
               <div className="video">
               <div className='vid'><iframe width="300" height="250" src="https://www.youtube.com/embed/UsucYJ8eiVM?si=Ej038Uk3zFsAY6Hf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
               <p>Technothlon Official Curtain Raiser 2020</p>
               </div>
                
                <div className='vid'><iframe width="300" height="250" src="https://www.youtube.com/embed/NtGIcalIeuk?si=_35H77LmSmzcDWxw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>Technothlon Official Curtain Raiser 2019</p></div>
                <div className='vid'><iframe width="300" height="250" src="https://www.youtube.com/embed/EMuqPrpzdGo?si=LDRg-NbwCzr6-Kcs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  allowfullscreen></iframe>
                <p>Talk With Sir H.C.Verma</p></div>
               </div>
                
            </div>
            </div>
            <div className="footer">
                <Footer/>
            </div>
        </div>
    );
}

export default Videos;

// import React, { useState, useEffect } from 'react';

// const Videos=()=>{
//     return(
//         <div className="App">
//             <div id="top"></div>
// <div class="separator"></div>

// <div class="parent" style="background: #FAFAFA;">
//   <div class="col">
//     <div class="video col"> 
//     <iframe width="100%" height="100%" src="https://www.youtube.com/embed/_P0SMFzvYl4?si=QkLyfvNAnRKBqITm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
//       <div class="page-text" id="vid-name" style="font-family: poppins; margin-bottom: 0px; text-align: left;">Technothlon Official Curtain Raiser 2023</div>
//       <div class="page-text" id="vid-date" style="font-family: poppins; color:#5E6A75; text-align: left;">6 June 2023</div>
//     </div>
//   </div>
// </div>

// <div class="separator"></div>

//   <div class="parent col">
//       <div class="page-heading">Videos</div>
//       <div class="heading">
//         <hr>
//       </div>
//   </div>
//   <div class="separator"></div>
//   <div class="parent col"> 
//     <div class="row" style="max-width: 100%;">
//       {/* {{-- https://img.youtube.com/vi/Vb2w-d0bwko/maxresdefault.jpg --}} */}
//     <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//       <div class="video-container" style="max-width: 100%;">
//         <div class="img" id="https://www.youtube.com/embed/Vb2w-d0bwko">
//           <div class="row" style="max-width: 100%;">
//             <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//             <img src="" style="max-height: 100%; max-width: 100%;">
//             </a>
//             <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Technothlon Official Curtain Raiser 2022</div>
//           </div>
//           <div id="date-vid" style="display:none">14 Jan 2021</div>
//         </div>
//       </div>  
//     </div>

//     <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//           <div class="img" id="https://www.youtube.com/embed/fPTxLFld4ks">
//             <div class="row" style="max-width: 100%;">
//               <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//               <img src="" style="max-height: 100%; max-width: 100%;">
//               </a>
//               <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Technothlon Official Curtain Raiser 2021</div>
//             </div>
//             <div id="date-vid" style="display:none">14 Jan 2021</div>
//           </div>
//         </div>  
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//           <div class="img" id="https://www.youtube.com/embed/UsucYJ8eiVM">
//             <div class="row" style="max-width: 100%;">
//               <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//               <img src="" style="max-height: 100%; max-width: 100%;">
//               </a>
//               <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Technothlon Official Curtain Raiser 2020</div>
//             </div>
//             <div id="date-vid" style="display:none">15 Nov 2019</div>
//           </div>
//         </div>  
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//           <div class="img" id="https://www.youtube.com/embed/NtGIcalIeuk">
//            <div class="row" style="max-width: 100%;">
//             <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//             <img src="" style="max-height: 100%; max-width: 100%;">
//             </a>
//             <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Technothlon Official Curtain Raiser 2019</div>
//             <div id="date-vid" style="display:none">03 Apr 2019</div>
//           </div>
//           </div>
//         </div>
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//             <div class="img" id="https://www.youtube.com/embed/HPmSk_TTh-g">
//               <div class="row" style="max-width: 100%;">
//                 <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//                 <img src="" style="max-height: 100%; max-width: 100%;">
//                 </a>
//                 <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Technothlon Official Curtain Raiser 2018</div>
//               </div>
//               <div id="date-vid" style="display:none">03 Nov 2017</div>
//             </div>
//         </div>  
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//           <div class="img" id="https://www.youtube.com/embed/obOBPiM9Y2c">
//             <div class="row" style="max-width: 100%;">
//               <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//               <img src="" style="max-height: 100%; max-width: 100%;">
//               </a>
//               <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Blow the ball challenge!</div>
//             </div>
//             <div id="date-vid" style="display:none">14 Mar 2015</div>
//           </div>  
//         </div>
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//           <div class="video-container" style="max-width: 100%;">
//             <div class="img" id="https://www.youtube.com/embed/EMuqPrpzdGo">
//               <div class="row" style="max-width: 100%;">
//                 <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//                 <img src="" style="max-height: 100%; max-width: 100%;">
//                 </a>
//                 <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">Tête-à-Tête With HC Verma</div>
//               </div>
//               <div id="date-vid" style="display:none">26 Apr 2014</div>
//             </div>
//           </div>  
//       </div>

//       <div class="col col-md-4 col-sm-6 col-xs-12" style="margin: 20px 0;">
//         <div class="video-container" style="max-width: 100%;">
//               <div class="img" id="https://www.youtube.com/embed/P9YjIthmfa0">
//                 <div class="row" style="max-width: 100%;">
//                   <a href="#top" class="col-sm-12 col-xs-8" style="text-align: left;">
//                   <img src="" style="max-height: 100%; max-width: 100%;">
//                   </a>
//                   <div class="page-text name-float col-sm-12 col-xs-4" id="name-vid" style="padding:0;">International Mother Language Day</div>
//                 </div>
//                 <div id="date-vid" style="display:none">20 Feb 2014</div>
//               </div>
//           </div>  
//       </div>
//     </div>

//   </div>

//   <div class="separator"></div>
//         </div>
//     )
// }