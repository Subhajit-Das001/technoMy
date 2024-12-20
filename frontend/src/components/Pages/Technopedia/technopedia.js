import './technopedia.css';
import Header from '../../Header/header';
import Footer from '../../Footer/footer';

function Technopedia() {
  const redirectUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://technothlon.techniche.org.in/login'
      : 'http://localhost:3000/login';

  return (
    <div className="App">
      <div className="header">
        <Header />
      </div>
      <div className="technopedia-main">
        <div className="blue">
          <h1>Technopedia</h1>
          <p>Experience Technothlon before you actually attempt it!</p>
        </div>
        <div className="descriptionn">
          <p>
            Technopedia is the online module of Technothlon providing its students with an ultimate
            experience of the prelims beforehand. With the monthly quizzes, Technopedia aims at
            keeping the young minds involved in brainstorming questions and helping them prepare for
            the prelims. Only the students who have registered for Technothlon may log into
            Technopedia using either their email id or their roll number and password.
            <a href={redirectUrl}><b>Click here!</b></a>
          </p>
        </div>
        {/* Additional components or sections can be added here */}
        <div className="l-blue">
        <h1>Logic Week</h1>
        <p>In addition to these, we have another interesting series called Logic Week. </p>
</div>
<div className="descriptionn">
          <p>
          During Logic Week, a few intriguing questions will be released on our Instagram page for participants to solve. There will be two Logic Weeks in June. The top 3 winners will be disclosed the following week and will be awarded exciting prizes.

          </p>
        </div>

<div className="l-blue1">

          <h1>Techno Coup D'oeil</h1>
          <p>Techno Coup D'oeil is our weekly question series running on social media Facebook and Instagram.</p>
          
        </div>

      </div>
      <div className="descriptionn1">
          <p>
          This particular initiative of Technothlon is a series of questions released on our social media handles each month. In each series, a set of two questions will be released, both of similar patterns in which Prelims questions are made.
          </p>
          <p>Please note that these contests and prizes are available exclusively for the registered participants only. Technopedia and Techno Coup D’oeil can be easily accessed by logging into your user profile using your email ID or Roll number and password. [Click             <a href={redirectUrl}><b>Click here!</b></a>
            to log in to Technopedia and Techno Coup D’oeil ]
          </p>
          {/* <p>In addition to these, we have another interesting series called Logic Lullaby. Head over to our Instagram page to check that out!
</p> */}
        </div>
      <div className="footer">
            <Footer />
          </div>
    </div>
  );
}

export default Technopedia;
