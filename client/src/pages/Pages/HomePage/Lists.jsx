import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../Assets/css/Lists.css';  // Import external CSS file for styling

const Lists = ({ user }) => {
  const [data, setData] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ search: "-" });

  const handleInputs = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const addToCart = async () => {
    const books = selectedBooks;
    const username = user.username;
    const send = { books: books, username: username };
    await axios
      .post(`http://localhost:5000/addToCart`, send)
      .then((response) => {
        console.log(response);
      });
    setTimeout(() => {
      window.location.href = "/cart";
    }, 500);
  };

  const fetchData = async () => {
    let search = filter.search;
    if (search.length === 0) {
      search = "-";
    }

    const response = await axios.get(`http://localhost:5000/search/${search}`);
    if (response.data.length === 0) {
      response = await axios.get(`http://localhost:5000/allBook`);
    }
    setData(response.data.books);
  };

  useEffect(() => {
    let delayTimer;
    const handleFilterChange = () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(fetchData, 1500);
    };

    handleFilterChange();

    return () => {
      clearTimeout(delayTimer);
    };
  }, [filter]);

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedBooks((prevSelectedBooks) => [...prevSelectedBooks, id]);
    } else {
      setSelectedBooks((prevSelectedBooks) =>
        prevSelectedBooks.filter((bookId) => bookId !== id)
      );
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="lists-container">
      {data.length > 0 ? (
        <>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Books"
              name="search"
              onChange={handleInputs}
            />
          </div>

          <table className="table">
            <thead className="table-header">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Publisher</th>
                <th>Genre</th>
                <th>Item Count</th>
                <th>Add To Cart</th>
              </tr>
            </thead>
            <tbody>
              {records.map((d, i) => (
                <tr key={i}>
                  <td>{(currentPage - 1) * 10 + i + 1}</td>
                  <td onClick={() => handleBookClick(d.ISBN)}>{d.Title}</td>
                  <td>{d.Author}</td>
                  <td>{d.Genre}</td>
                  <td>{d.ItemCount || 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(e, d.ISBN)}
                      checked={selectedBooks.includes(d.ISBN)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button className="page-button" onClick={prevPage}>
              PREV
            </button>
            <span className="current-page">{currentPage}</span>
            <button className="page-button" onClick={nextPage}>
              NEXT
            </button>
          </div>

          <div className="checkout-container">
            <button className="checkout-button" onClick={addToCart}>
              PROCEED TO CHECKOUT
            </button>
            <div className="checkout-text">
              Save Selected Items To Cart And Proceed To Checkout
            </div>
          </div>
        </>
      ) : (
        <div className="loading-indicator">
          <div className="loading-item"></div>
          <div className="loading-item"></div>
          <div className="loading-item"></div>
        </div>
      )}
    </div>
  );
};

export default Lists;
