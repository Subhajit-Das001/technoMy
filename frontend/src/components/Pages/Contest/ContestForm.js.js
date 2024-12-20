// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import './ContestForm.css'; // Import the CSS file

// function ContestForm() {
//   const [contestId, setContestId] = useState("");  // Contest ID input
//   const [questions, setQuestions] = useState({});  // Store questions
//   const [answerA, setAnswerA] = useState("");  // Answer for question A
//   const [answerB, setAnswerB] = useState("");  // Answer for question B
//   const [score, setScore] = useState(null);  // Store score after submission

//   // Fetch questions when the contestId changes
//   useEffect(() => {
//     if (contestId) {
//       axios.get(`/api/contest/${contestId}`)
//         .then((response) => {
//           setQuestions(response.data);  // Set questions from the backend
//         })
//         .catch((error) => console.error("Error fetching contest:", error));
//     }
//   }, [contestId]);

//   // Handle submit
//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post(`/api/contest/${contestId}/submit`, {
//         answerA: answerA,
//         answerB: answerB
//       });
//       setScore(response.data.score);  // Set the score returned from backend
//     } catch (error) {
//       console.error("Error submitting contest:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Technothlon Contest</h1>
//       <input
//         type="text"
//         value={contestId}
//         onChange={(e) => setContestId(e.target.value)}
//         placeholder="Enter Contest ID"
//       />
//       <div>
//         {questions.questionA && (
//           <div className="question">
//             <p>{questions.questionA}</p>
//             <input
//               type="text"
//               value={answerA}
//               onChange={(e) => setAnswerA(e.target.value)}
//               placeholder="Your Answer for Question A"
//             />
//           </div>
//         )}
//         {questions.questionB && (
//           <div className="question">
//             <p>{questions.questionB}</p>
//             <input
//               type="text"
//               value={answerB}
//               onChange={(e) => setAnswerB(e.target.value)}
//               placeholder="Your Answer for Question B"
//             />
//           </div>
//         )}
//       </div>
//       <button onClick={handleSubmit}>Submit</button>
//       {score !== null && <h3>Your Score: {score}</h3>}
//     </div>
//   );
// }

// export default ContestForm;
