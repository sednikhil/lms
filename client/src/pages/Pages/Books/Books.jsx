import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBook, setNewBook] = useState({
    Title: "",
    Author: "",
    ISBN: "",
    Publisher: "",
    Genre: "",
    ItemCount: "",
  });
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/books");
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  // Add a new book
  const createBook = async () => {
    if (!newBook.Title || !newBook.ISBN) {
      toast.error("Please fill in required fields (Title, ISBN)");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/addBook", newBook);
      setBooks([...books, response.data]);
      setNewBook({ Title: "", Author: "", ISBN: "", Publisher: "", Genre: "", ItemCount: "" });
      toast.success("Book added successfully");
    } catch (error) {
      toast.error("Failed to add book");
    }
  };

  // Update an existing book
  const updateBook = async () => {
    if (!editBook.Title || !editBook.ISBN) {
      toast.error("Please fill in required fields (Title, ISBN)");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/books/${editBook._id}`, editBook);
      setBooks(books.map((book) => (book._id === editBook._id ? response.data : book)));
      setEditBook(null);
      toast.success("Book updated successfully");
    } catch (error) {
      toast.error("Failed to update book");
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
      toast.success("Book deleted successfully");
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  return (
    <div>
      <h1>Books Management</h1>

      {/* Add New Book */}
      <div>
        <h3>Add New Book</h3>
        <input type="text" name="Title" placeholder="Title" value={newBook.Title} onChange={handleInputChange} />
        <input type="text" name="Author" placeholder="Author" value={newBook.Author} onChange={handleInputChange} />
        <input type="text" name="ISBN" placeholder="ISBN" value={newBook.ISBN} onChange={handleInputChange} />
        <input type="text" name="Publisher" placeholder="Publisher" value={newBook.Publisher} onChange={handleInputChange} />
        <input type="text" name="Genre" placeholder="Genre" value={newBook.Genre} onChange={handleInputChange} />
        <input type="number" name="ItemCount" placeholder="Item Count" value={newBook.ItemCount} onChange={handleInputChange} />
        <button onClick={createBook}>Add Book</button>
      </div>

      {/* Display Books */}
      <div>
        <h3>All Books</h3>
        {loading ? (
          <p>Loading books...</p>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} style={{ margin: "1rem 0", border: "1px solid #ccc", padding: "1rem" }}>
              <h4>{book.Title}</h4>
              <p>Author: {book.Author}</p>
              <p>ISBN: {book.ISBN}</p>
              <p>Publisher: {book.Publisher}</p>
              <p>Genre: {book.Genre}</p>
              <p>Item Count: {book.ItemCount}</p>

              <button onClick={() => setEditBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>

      {/* Edit Book */}
      {editBook && (
        <div>
          <h3>Edit Book</h3>
          <input type="text" name="Title" value={editBook.Title} onChange={handleInputChange} />
          <input type="text" name="Author" value={editBook.Author} onChange={handleInputChange} />
          <input type="text" name="ISBN" value={editBook.ISBN} onChange={handleInputChange} />
          <input type="text" name="Publisher" value={editBook.Publisher} onChange={handleInputChange} />
          <input type="text" name="Genre" value={editBook.Genre} onChange={handleInputChange} />
          <input type="number" name="ItemCount" value={editBook.ItemCount} onChange={handleInputChange} />
          <input type="number" name="BibNum" value={editBook.BibNUm} onChange={handleInputChange} />
          <button onClick={updateBook}>Update Book</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Books;
