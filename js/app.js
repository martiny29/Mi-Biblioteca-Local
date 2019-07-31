// Book Class: Represents a Book
class Book {
    constructor(titulo, autor, isbn) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#lista-libros');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.titulo}</td>
            <td>${book.autor}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Eliminar</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(mensaje, clase) {
        const div = document.createElement('div');
        div.className = `alert alert-${clase}`;
        div.appendChild(document.createTextNode(mensaje));
        const container = document.querySelector('.container');
        const form = document.querySelector('#form-libros');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add Book
document.querySelector('#form-libros').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // GET form values
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (titulo === '' || autor === '' || isbn === '') {
        UI.showAlert('Todos los campos son obligatorios', 'danger');
    } else {
        // Instatiate Book
        const book = new Book(titulo, autor, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show Success message
        UI.showAlert('Se agregó el libro con éxito', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#lista-libros').addEventListener('click', (e) =>{
    // Remove book from UI
    UI.deleteBook(e.target);
    // Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Libro eliminado', 'warning');
});