import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Assets/css/userprofile.css";

const Profile = ({ user }) => {
  const dateStr = user.createdAt;
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const [data, setData] = useState({
    name: user.name,
    username: user.username,
    phone: user.phone,
    address: user.address,
    uniqueId: user.uniqueId,
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Fetch Borrowed Books
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/borrowedBooks", {
          params: { username: user.username },
        });
        if (response.status === 200) {
          setBorrowedBooks(response.data);
        } else {
          toast.warn(response.data.msg || "No borrowed books found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch borrowed books");
      }
    };

    fetchBorrowedBooks();
  }, [user.username]);

  const handleInputs = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/updateUser`, data);
      const message = response.data.msg;
      const status = response.status;

      if (status === 200) {
        toast.success(`${message}`, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      } else if (status === 202) {
        toast.warn(`${message}`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const returnBook = async (isbn) => {
    try {
      const response = await axios.post(`http://localhost:5000/returnBooks`, {
        uniqueId: user.uniqueId,
        isbn: isbn,
      });

      if (response.status === 200) {
        toast.success("Book returned successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setBorrowedBooks((prev) => prev.filter((book) => book.isbn !== isbn));
      } else {
        toast.warn(response.data.msg || "Failed to return book");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to return book");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        {/* Profile Information */}
        <div className="profile-image">
          <img
            src="https://api.multiavatar.com/Starcrasher.png?apikey=dIwKHchoCn6x9k"
            alt="avatar"
          />
        </div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>UID: {user.uniqueId}</p>
          <p>Email: {user.username}</p>
          <p>Phone: {user.phone}</p>
          <p>Joined on: {formattedDate}</p>
        </div>
      </div>

      {/* Edit Profile and Borrowed Books */}
      <div className="profile-edit">
        <div className="edit-profile">
          <h2>Edit Your Profile</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={handleInputs}
          />
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={data.username}
            onChange={handleInputs}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={data.phone}
            onChange={handleInputs}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={data.address}
            onChange={handleInputs}
          />
          <button className="submit-btn" onClick={submitForm}>Update</button>
        </div>

        <div className="borrowed-books">
          <h2>Borrowed Books</h2>
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div key={book.isbn} className="borrowed-book">
                <p><strong>{book.title}</strong> (ISBN: {book.isbn})</p>
                <p>Taken Date: {book.takenDate}</p>
                <button onClick={() => returnBook(book.isbn)}>Return</button>
              </div>
            ))
          ) : (
            <p>No books borrowed</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
