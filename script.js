const apiUrl = "https://openlibrary.org/search.json";
let topSearchedBooks = [];

function searchBooks() {
    const query = document.getElementById("search-input").value;
    if (!query) {
        alert("Please enter a book title or author.");
        return;
    }

    fetch(`${apiUrl}?q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayBooks(data.docs);
            addToTopSearched(query);
        })
        .catch(error => console.error('Error fetching data: ', error));
}

function displayBooks(books) {
    const booksList = document.getElementById("books-list");
    booksList.innerHTML = ""; // Clear previous results

    if (books.length === 0) {
        booksList.innerHTML = "<p>No books found. Try a different search.</p>";
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        const coverImage = book.cover_i ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="Book Cover">` : '';
        const title = book.title || "No title available";
        const author = book.author_name ? book.author_name.join(', ') : "Unknown author";
        const year = book.first_publish_year || "Unknown year";
        const bookUrl = `https://openlibrary.org${book.key}`;

        bookCard.innerHTML = `
            ${coverImage}
            <h3>${title}</h3>
            <p>Author: ${author}</p>
            <p>First Published: ${year}</p>
            <a href="${bookUrl}" target="_blank">View Book</a>
        `;

        booksList.appendChild(bookCard);
    });
}

function addToTopSearched(query) {
    // Check if the book is already in the top searched list
    if (!topSearchedBooks.includes(query)) {
        topSearchedBooks.push(query);
        updateTopSearchedBooks();
    }
}

function updateTopSearchedBooks() {
    const topBooksList = document.getElementById("top-searched-books");
    topBooksList.innerHTML = ""; // Clear the list

    // Display the top searched books
    topSearchedBooks.slice(-5).forEach((bookQuery, index) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-card");
        bookItem.innerHTML = `<h3>${index + 1}. ${bookQuery}</h3>`;
        topBooksList.appendChild(bookItem);
    });
}

// Open Registration Form in a New Tab
function openRegistration() {
    window.open("registration.html", "_blank", "width=600,height=500");
}

// Open Login Form in a New Tab
function openLogin() {
    window.open("login.html", "_blank", "width=600,height=500");
}
async function fetchTopRatedBooks() {
    try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&printType=books&maxResults=6');
        if (!response.ok) {
            throw new Error(`Error fetching books: ${response.status}`);
        }
        const data = await response.json();
        displayTopRatedBooks(data.items || []);
    } catch (error) {
        console.error('Failed to fetch top-rated books:', error);
        document.getElementById('top-rated-books').innerHTML = `<p>Unable to load top-rated books at the moment.</p>`;
    }
}

function displayTopRatedBooks(books) {
    const topRatedBooksList = document.getElementById('top-rated-books');
    topRatedBooksList.innerHTML = '';

    if (books.length === 0) {
        topRatedBooksList.innerHTML = `<p>No top-rated books available at the moment.</p>`;
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const coverImage = book.volumeInfo.imageLinks?.thumbnail
            ? `<img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Book Cover">`
            : `<div class="no-image">No Image</div>`;
        const title = book.volumeInfo.title || 'No title available';
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown author';
        const rating = book.volumeInfo.averageRating
            ? `<p class="rating">⭐ ${book.volumeInfo.averageRating}</p>`
            : `<p class="rating">No rating available</p>`;

        bookCard.innerHTML = `
            ${coverImage}
            <h3>${title}</h3>
            <p>Author: ${author}</p>
            ${rating}
        `;

        topRatedBooksList.appendChild(bookCard);
    });
}

// Fetch top-rated books when the page loads
document.addEventListener('DOMContentLoaded', fetchTopRatedBooks);
