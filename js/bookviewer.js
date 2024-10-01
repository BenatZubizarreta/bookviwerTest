export class BookViewer {

    constructor(data, base) {
        this.base = base;
        this.search_base = 'https://openlibrary.org/search.json?isbn=';
        this.data = data;
        this.index = 0;

        this.irudia = document.getElementById("irudia");
        this.egilea = document.getElementById("egilea");
        this.izenburua = document.getElementById("izenburua");
        this.dataElem = document.getElementById("data");
        this.isbn = document.getElementById("isbn");
        this.liburuKopuru = document.getElementById("liburuKopuru");

        this.initButtons();
        this.updateView();
    }

    initButtons() {
        // aurrera, atzera eta bilatu botoiak hasieratu
        // bilatu botoia sakatzean, erabiltzaileak sartu duen isbn-a duen liburua lortu
        // eta handleSearchData funtzioa exekutatu
        const nextButton = document.getElementById("aurrera");
        const prevButton = document.getElementById("atzera");
        const searchButton = document.getElementById("bilatu");
        nextButton.addEventListener("click", () => this.nextBook());
        prevButton.addEventListener("click", () => this.prevBook());
        searchButton.addEventListener("click", () => {
            const isbn = this.isbn.value.trim();
            if (isbn) {
                this.handleSearchData(isbn);
            }
        });
        
    }

    extractBookData = (book) => {
        // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko
        return {
            title: book.title || "N/A",
            author: book.author_name ? book.author_name.join(", ") : "N/A",
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : "placeholder.jpg",
            publish_date: book.first_publish_year || "N/A",
            isbn: book.isbn ? book.isbn.join(", ") : "N/A",
        };
      };
      
    addBookToData = (book, data) => {
        // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
        data.push(book);
        return data.length - 1; 
    };

    handleSearchData = (data) => {
        // lortu liburua data objektutik
        // extractBookData eta addBookToData funtzioak erabili, indizea berria lortuz
        // updateView funtzioa erabili, liburu berria bistaratzeko
        if (data && data.docs && data.docs.length > 0) {
            const book = data.docs[0];
            const extractedData = this.extractBookData(book);
            this.index = this.addBookToData(extractedData, this.data);
            this.updateView();
        } else {
            console.error("No book found with that ISBN.");
        }
    };

    updateView() {
        // liburuaren datu guztiak bistaratu
        // liburu kopurua bistaratu
        const currentBook = this.data[this.index];
        if (currentBook) {
            this.irudia.src = currentBook.cover;
            this.egilea.textContent = currentBook.author;
            this.izenburua.textContent = currentBook.title;
            this.dataElem.textContent = currentBook.publish_date;
            this.liburuKopuru.textContent = `Book ${this.index + 1} of ${this.data.length}`;
        }
    }

    nextBook() {
        // Hurrengo indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu liburu kopurua gainditu
        if (this.index < this.data.length - 1) {
            this.index++;
            this.updateView();
        }
    }

    prevBook() {
        // Aurreko indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu 0 indizea gainditu
        if (this.index > 0) {
            this.index--;
            this.updateView();
        }
    }
}
