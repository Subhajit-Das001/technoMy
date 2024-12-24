import './aboutus.css';
import Header from "../../Header/header"; 
import Footer from "../../Footer/footer";
import Button from '../../Assets/Button/button';

function AboutUs() {

      function handleClick() {
            console.log("button clicked")
      };

    return (
      <div className="app">
        <div className="header">
            <Header/>
        </div>
        <div className="violet">
              <h1>About Us</h1>
              <p>We are the largest school based examination conducted by a student fraternity all over India.</p>
        </div>
        <div className="desc">
        <div className="description-1">
              <h2>
                What is Technothlon?
              </h2>
              <p>
              {/* Technothlon is an international school championship organized by the student fraternity of IIT Guwahati. Technothlon began in 2004 in a small room with an aim to "Inspire Young Minds" . Starting on our journey with a participation of 200 students confined to the city of Guwahati, over the past 20 years we have expanded our reach to over 400 cities all over India and various centers abroad. Now Technothlon spans its wings in 30+ countries internationally. Technothlon is not just an exam but it is an enthralling journey on the path of logic which will test your logical and creative thinking to its limit.The championship is organized over 2 rounds: Prelims and Mains. */}
              Technothlon is an international school championship and one of the flagship events of Techniche, the Techno-Management festival of IIT Guwahati, organized entirely by its student community. Its journey began in 2004 with just 200 students with a simple motto: to inspire young minds. This has been achieved continuously every year since then. Over the past 21 years, Technothlon has spread its wings to over 450 cities all over India and various centers abroad. 
              </p>
              <p>Technothlon is not just an exam but an enthralling journey on the path of logic that tests your logical and creative thinking to its limits. The championship is organized over 2 rounds: Prelims and Mains.

</p>
        </div>
        <div className="sep"></div>
        <div className="description-2">
              <h2>What makes our paper so special?
              </h2>
              {/* <p>No prerequisites are required for the exam i.e. you don't need to go through any special preparation for this exam. The exam aims for developing critical thinking and analytical skills among students. According to us, the beauty of the creative and analytical process involved in solving a puzzle can be enjoyed the best.
              </p> */}
              <p>Unlike most competitive exams, Technothlon doesn’t require any prerequisites —i.e., you don’t need any prior knowledge or specialized knowledge to participate. This exam aims to develop critical thinking and analytical skills among students. After all, the beauty of solving puzzles through innate creativity and analytical processes is truly unmatched.  
              </p>
        </div>
        <div className="sep"></div>
        <div className="description-3"> 
              <p><b className='b'> Prelims:</b> 
              </p>
              <p>It is a written examination that the participants can give from their hometown. Each year, various schools across India serve as exam centers, enabling students to attempt this exam conveniently. It requires no prerequisites or general knowledge and can be attempted purely by using logical and analytical thinking skills. The question paper is for 2 hours. 
              </p>
              <p>What makes it different from the rest? Two aspects stand out - its unique marking scheme and ‘Theme’. Technothlon’s prelims round is known for its distinctive and dynamic marking scheme, which changes every year and is given at the start of the question paper. 
</p>
<p>The theme of the question paper is another exceptional feature of Technothlon. Have you ever taken an exam that follows a storyline? Well, you can experience that with Technothlon! Each year the paper is centered around a certain theme, with questions framed to immerse the participants in a world of adventure, making the exam a truly unforgettable experience. For example, last year’s themes were The Incredibles and Coco. Curious? Take the exam and experience it for yourself! 

</p>

              <p><b className='b'> Mains:</b> 
              </p>
              <p>It is an event-based competition held during Techniche, North-East India’s largest techno-management festival organized at IIT Guwahati. The Top 25 teams of each squad from Prelims compete against each other in challenging events designed to test their innovation, creativity, and imagination. These events do not require any prerequisites, and any needed extra knowledge is taught to the students by us. The winners of Technothlon are finalized based on their performance in these events. In addition to this, students are also free to attend numerous competitions, lectures, workshops, and music performances in Techniche. 
              </p>
        </div>
        </div>
        
        < div className="voilet-main">
        <div className="l-violet">
              <h1>Exam Structure</h1>
              {/* <p>This year students will participate in Teams of two. There are two squads:</p> */}
              <p>
The Prelims are conducted in two examination sets, referred to as Squads. Students are separated into two squads as follows -
</p>
              <p><b>1. Junior-Squad:</b> Students of classes 9th and 10th
              </p>
              <p><b>2. Hauts-Squad:</b> Students of classes 11th and 12th
              </p>
              <p>
This exam is given in teams of two. Two students from the same squad can write the Prelims exam together. They will also appear together for the Mains event. 

</p>
              <h1>Modes of Registration </h1>
              <h4>There are 2 modes of registration - Online and Offline. The interested students can register themselves for the examination online or offline.</h4>
              <p><b>1. Offline -</b> Technothlon is conducted over various cities and centers with the help of city representatives. The city representatives are responsible to collect the registrations offline. Participating schools can collect the registration details themselves and then send the details to heads .</p>
              <p><b>2. Online -</b> Registration has now opened!</p>
              <div className="gap"></div>

              <div className="reg-button">
              {/* <Button color= "#00E86B" text="Register Online" onClick={() => {window.location.href="/teamregister"}} /> */}
              </div>
              
              </div>
             
             <Footer/>

             
            
        
        </div>
        
        
      </div>
    );
  }
  
  export default AboutUs;