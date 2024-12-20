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

    const faq=[
      { question: 'What is Technothlon?', answer: 'Technothlon is an annual international school championship for classes 9th to 12th conducted and organized by the student fraternity of IIT Guwahati. It consists of two level prelims and mains. Prelims is an offline exam based on which teams are selected for the mains held at IIT Guwahati in which various events are held and prizes are given to the top three teams.' },
      { question: 'What is the Registration Fee this year?', answer: 'You can register online for Technothlon 2024 Prelims for a fee of <strong>Rs.200/-</strong> through our registration portal <a href="https://technothlon.techniche.org.in/register">Register!</a>' },
      { question: 'What is Techniche?', answer: 'Techniche is the annual techno-management festival of IIT Guwahati. It is one of the largest techno-management festivals in India. A large number of events are held during Techniche such as the Lecture Series in which lectures are delivered by various eminent personalities (Walter Bender, George Kourounis, Roger Hunter, Dr. Samuel Chand). Other events include Funniche, Industrial Conclave, Escalade, Rush Hour, Marathon. Various exhibitions and workshops are also held during the festival.' },
      { question: 'How to register for Technothlon 2023?', answer: 'You can register online through technothlon’s website, or you can contact the Heads/City Representatives of your respective zone/city to register through offline mode.' },
      { question: 'What are the requirements to give this exam?', answer: 'The participant must be studying in class 9th/10th in the session 2024-25 for appearing in the JUNIORS squad, and in class 11th/12th in the session 2024-25 for appearing in the HAUTS squad.No pre-requisite knowledge on definite topics in science or elsewhere is required.' },
      { question: 'What is the syllabus for the prelims?', answer: 'Technothlon is an exam filled with intriguing questions that test your logical thinking and presence of mind. If you think your analytical abilities are sharp and your logic is clear, then just sit for the exam and you are sure to crack it!' },
      { question: 'Where will the examination be held?', answer: 'The prelims will be conducted in schools which will be fixed as centres in 200+ cities all over India. To see the list of cities where the exam will be held, go to the centers page . You will be informed of the centres allocated for your city well in advance of the exam. For KVs, JNVs, APSs, the exam will be conducted in your schools itself.' },
      { question: 'What kind of questions can I expect in the paper?', answer: 'No questions in the paper will require prior knowledge of facts, formulae, etc. Questions will be both objective and subjective and will demand basic common sense, logic and presence of mind. Previous years papers are here.' },
      { question:"What will be the mode of conduction of Technothlon this year?" , answer:"This year, Prelims round of technothlon will be held on 14th July 2024 in offline mode, while the mains round will be held in Offline mode during the first week of September."},
      { question:"My partner fell ill and can’t give the exam. Can I give the exam alone?", answer:"No, individual participation is not allowed."},
      { question:"When will I get my result?" ,answer:"The results of the Technothlon prelims will be declared in the Last week of August to give the selected students ample time for booking their tickets."},  
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