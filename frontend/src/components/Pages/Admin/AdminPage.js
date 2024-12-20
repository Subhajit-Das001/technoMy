import React, { useState } from "react";
import axios from "axios";
import './AdminPage.css'; // Optional CSS for styling

function AdminPage() {
  const [contestId, setContestId] = useState(""); // Contest ID
  const [questionA, setQuestionA] = useState(""); // Question A
  const [questionB, setQuestionB] = useState(""); // Question B
  const [answerA, setAnswerA] = useState(""); // Answer for Question A
  const [answerB, setAnswerB] = useState(""); // Answer for Question B
  const [message, setMessage] = useState(""); // Success/Error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const contestData = {
      contestId,
      questionA,
      questionB,
      answerA,
      answerB
    };

    try {
      // Send a POST request to your backend API to create a new contest
      const response = await axios.post('/api/contest', contestData);
      setMessage("Contest Created Successfully!");
      setContestId("");
      setQuestionA("");
      setQuestionB("");
      setAnswerA("");
      setAnswerB("");
    } catch (error) {
      setMessage("Error creating contest. Please try again.");
      console.error("Error submitting contest:", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Create New Contest</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Contest ID</label>
          <input
            type="text"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            placeholder="Enter Contest ID"
            required
          />
        </div>
        <div className="form-group">
          <label>Question A</label>
          <input
            type="text"
            value={questionA}
            onChange={(e) => setQuestionA(e.target.value)}
            placeholder="Enter Question A"
            required
          />
        </div>
        <div className="form-group">
          <label>Answer A</label>
          <input
            type="text"
            value={answerA}
            onChange={(e) => setAnswerA(e.target.value)}
            placeholder="Enter Answer for Question A"
            required
          />
        </div>
        <div className="form-group">
          <label>Question B</label>
          <input
            type="text"
            value={questionB}
            onChange={(e) => setQuestionB(e.target.value)}
            placeholder="Enter Question B"
            required
          />
        </div>
        <div className="form-group">
          <label>Answer B</label>
          <input
            type="text"
            value={answerB}
            onChange={(e) => setAnswerB(e.target.value)}
            placeholder="Enter Answer for Question B"
            required
          />
        </div>
        <button type="submit">Create Contest</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminPage;
