class book{
    constructor(title, author, price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    show(){
        console.log(`Title: ${this.title}, Author: ${this.author}, Price: $${this.price}`);
    }
}