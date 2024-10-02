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
        searchButton.addEventListener('click', () => this.searchBook());

    }
        
    
    searchBook() {
        // Erabiltzaileak sartutako ISBN-a lortu
        const isbnValue = this.isbn.value.trim();
        if (isbnValue) {
            const url = `${this.search_base}${isbnValue}`;
            console.log("Fetching from URL:", url);

            fetch(url)
            .then(r => r.json())
        .then(data => {
            this.handleSearchData(data);
        });
        } else {
            console.error("Mesedez, sartu ISBN bat.");
        }
    }

    extractBookData = (book) => {
        // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko
            return {
            isbn: book.isbn,
            egilea: book.egilea,
            izenburua: book.izenburua,
            data: book.data,
            filename: book.filename,
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
            const bookData = {
                isbn: data.docs[0].isbn,
                egilea:data.docs[0].author_name,
                izenburua: data.docs[0].title,
                data:data.docs[0].first_publish_year.toString(),
                filename: `${data.docs[0].cover_i}-M.jpg`
            };

            const newIndex = this.addBookToData(bookData, this.data);
            this.index = newIndex;
            
           this.updateView();
        } else {
            console.error("Liburua ez da aurkitu.");
        }
    };

    updateView() {
        // liburuaren datu guztiak bistaratu
        // liburu kopurua bistaratu
        const book = this.data[this.index]; // Egungo liburua lortu
        if (book) {
            this.irudia.src = `${this.base}${book.filename}`; // Irudia eguneratu
            this.egilea.value = book.egilea; // Egilea eguneratu
            this.izenburua.value = book.izenburua; // Izenburua eguneratu
            this.dataElem.value = book.data; // Data eguneratu
            this.isbn.value = book.isbn; // ISBN eguneratu
            this.liburuKopuru.innerText = `${this.index + 1} / ${this.data.length}`; // Liburu kopurua eguneratu
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
