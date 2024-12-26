import React, { useState } from 'react';
import './faqs.css'; 
import Header from "../../Header/header"
import Footer from "../../Footer/footer"
import down from '../../Assets/img/down.png'

function FAQ() {
    const [answersVisible, setAnswersVisible] = useState(Array(9).fill(false));
    const [rotated, setRotated] = useState(Array(9).fill(false));

    const toggleAnswer = (index) => {
        setAnswersVisible(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const Rotate = (index) => {
        setRotated(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const faq = [
        { question: 'What is Technothlon?', answer: 'Technothlon is an annual international school championship for classes 9th to 12th conducted and organized by the student fraternity of IIT Guwahati. It consists of two level prelims and mains. Prelims is an offline exam based on which teams are selected for the mains held at IIT Guwahati in which various events are held and prizes are given to the top three teams.' },
        {
            question: "What is Techniche?",
            answer: "Techniche is the Annual Techno-Management Festival of IIT Guwahati. It is the largest of its kind in North-East India and one of the largest across India. Every year, Techniche hosts a variety of engaging events like Lecture Series, Workshops, RoboWars, Industrial Conclave, and many more, many of which are accessible to the Mains participants of Technothlon. Various eminent personalities visit IIT Guwahati and deliver lectures as a part of the Lecture Series event. Walter Bender, George Kourounis, Roger Hunter, and Dr. Samuel Chand have taken part in this event in the past. Various exhibitions are also held during the festival.",
          },
          {
            question: "Who is eligible to write this exam?",
            answer: "The students participating must be studying either in 9th/10th grade (Juniors Squad) or in 11th/12th grade (Hauts Squad) according to the academic year of 2025-26.",
          },
          {
            question: "How do I register for Technothlon 2025?",
            answer: "You can either register Online through our Registration portal on this website <strong> <a href='https://technothlon.techniche.org.in/TeamRegistration'>[Click here to register!]</a> </strong> or Offline by contacting the City Representative of your city.",
          },
        
          {
            question: "What is the Registration Fee this year?",
            answer: "It is 200/- per team of two. You can register either Online through our website portal or Offline through our City representatives. <strong> <a href='https://technothlon.techniche.org.in/TeamRegistration'>[Click here to register!]</a>  </strong>",
          },
       
       
        
        {
          question: "What is the syllabus of Prelims examination?",
          answer: "No prerequisites are required as the exam is completely logic-based. However, if one feels the need for practice, PYQs are readily available on our website. We also have monthly quizzes and test modules to help you prepare.",
        },
        {
          question: "Do we need any extra knowledge for coming to the Mains event at IIT Guwahati?",
          answer: "No prerequisites are needed. Any extra knowledge required to participate in the events will be taught by us.",
        },
        {
          question: "Where will the examination be held?",
          answer: "The prelims will be conducted in schools designated as centers in 450+ cities all over India. To see the list of cities where the exam will be held, visit the Centers page. You will be notified of the centers allocated for your city well in advance of the exam. For KVs and JNVs, the exam will be conducted in your schools.",
        },
        {
          question: "What kind of questions can I expect in the paper?",
          answer: "No question in the paper will require prior knowledge of facts, formulae, etc. Questions will be both objective and subjective and will demand basic common sense, logic, and presence of mind. You can go through the previous papers for reference.   <strong> <a href='https://technothlon.techniche.org.in/pyp'>[Click here to view PYQ's !]</a> </strong> ",
        },
        {
          question: "What will be the mode of conduction of Technothlon this year?",
          answer: "This year, the Prelims round of Technothlon will be held on 13th July 2025 in offline mode, while the Mains round will be held in Offline mode during the last week of August.",
        },
        {
          question: "When will I get my result?",
          answer: "The results of the Technothlon Prelims will be declared in the first week of August. This gives the selected students ample time to book their tickets.",
        },
      ];
      

    return (
        <div className="App">
            <div className="header">
                <Header />
            </div>
            <div className="faq-main">
                <div className="faq-head">
                    <h1>FAQs</h1>
                    <p>Need some help? Browse through these FAQs to find answers to commonly raised questions.</p>
                </div>
                <div className="faqs-q">
                    {faq.map((item, index) => (
                        <div className="faq-item" key={index}>
                            <div className="faq-question" onClick={() => toggleAnswer(index)}>
                                {item.question}
                                <img src={down} alt="" className={rotated[index] ? "rotated" : ""} 
                                    onClick={() => Rotate(index)} />
                            </div>
                            {answersVisible[index] && (
                                <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.answer }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
}

export default FAQ;