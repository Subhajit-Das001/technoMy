import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post("/api/reset-password", { token, newPassword });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred.");
    }
  };
  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Submit</button>
      <ToastContainer />
    </div>
  );
};
export default ResetPassword;