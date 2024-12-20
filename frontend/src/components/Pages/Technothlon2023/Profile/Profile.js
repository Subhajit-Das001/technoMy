const Profile = () => {
  return (
    <>
      <h1>Profile</h1>
      <div className="profile-container">
        <div className="profile-cards">
          <h2>Profile Details</h2>
          <form>
            <div>
              <label htmlFor="name">Name*:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="name">Email*:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="contact">Contact*:</label>
              <input type="tel" id="contact" name="contact" required />
            </div>
            <div>
              <label htmlFor="address">Address*:</label>
              <textarea name="address" id="address" cols="30" rows="6">
                Enter your address here
              </textarea>
            </div>
            <div>
              <label htmlFor="gender">Gender*:</label>
              <select name="gender" id="gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
          </form>
          <div className="profile-city">City: Hyderabad</div>
          <button>Update Details</button>
        </div>
        <div className="profile-cards-pass">
          <h2>Change Password</h2>
          <form>
            <div>
              <label htmlFor="old-password">Old Password*:</label>
              <input
                type="password"
                id="old-password"
                name="old-password"
                required
              />
            </div>
            <div>
              <label htmlFor="new-password">New Password*:</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password*:</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
              />
            </div>
          </form>
          <button className="pwd-change-btn">Change Password</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
