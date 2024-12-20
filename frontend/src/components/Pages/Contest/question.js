import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Question() {
  const { contestId, questionId } = useParams();
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/contests/${contestId}/questions`);
        setQuestion(response.data[questionId] || "Question not found.");
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [contestId, questionId]);

  return (
    <div>
      <h1>Contest {contestId} - Question {questionId}</h1>
      <p>{question}</p>
    </div>
  );
}

export default Question;
