// Initialize Variables
const formValue = document.querySelector("#book-form");
const list = document.getElementById("book-list");

// Define Class book
class Book {
    constructor(title, author, isbn) {
        this.bookTitle = title;
        this.bookAuthor = author;
        this.bookIsbn = isbn;
    }
}

// UI Module
class UI {
    constructor() { }

    addBookToList(newBook) {
        const row = document.createElement('tr');

        row.innerHTML = `
    <td>${newBook.bookTitle}</td>
    <td>${newBook.bookAuthor}</td>
    <td>${newBook.bookIsbn}</td>
    <td><a href = "#" class = "delete"> X</a></td>
    `;
        list.appendChild(row)
    }

    clearField() {
        const title = document.getElementById('book-title').value = "";
        const author = document.getElementById('book-author').value = "";
        const isbn = document.getElementById('book-isbn').value = "";
    }

    showAlert(message, className) {
        const msg = document.createElement('p');
        msg.textContent = message;
        const msg_holder = document.getElementById('msg-content')
        msg_holder.appendChild(msg)
        msg.classList.add(className);
        setTimeout(() => {
            msg.remove();
        }, 1000);
    }

    deleteBook(target) {
        //event delecation
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

}

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;
            ui.addBookToList(book);
        });
    }

    static removeBook(title){
      const books = Store.getBooks();
      books.forEach(function(book, index){
          if(book.bookTitle === title){
              //remove book object from local storage
              books.splice(index, 1);
          }
      });

      localStorage.setItem('books', JSON.stringify(books));
    }
}

//Dom load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Code Module
formValue.addEventListener('submit', function (e) {
    //form variable
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const isbn = document.getElementById('book-isbn').value;

    //Instantiate UI
    const ui = new UI();
   
    //validation
    if (title != "" && author != "" && isbn != "") {
        //Instantiate Book
        const book = new Book(title, author, isbn)

        //success msg
        ui.showAlert('Book Added!', 'success')

        //add book to list
        ui.addBookToList(book)

        //Add to local stroage
        Store.addBooks(book);

        //clear all form field
        ui.clearField();
    }
    else {
        //Erorr msg
        ui.showAlert('Please fill in all fields', 'error')
    }

    e.preventDefault();
});

//Delete Event
list.addEventListener('click', function (e) {
    const ui = new UI();
    //delete book
    ui.deleteBook(e.target);

    //delete from local stroage
    Store.removeBook(e.target.parentElement.parentElement.firstElementChild.textContent)

    //book removed msg
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
})
