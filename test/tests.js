let chai = require("chai");
let chaiHttp = require("chai-http");
let server=require("../index.js");
let should = chai.should();

chai.use(chaiHttp);

describe("TicketBooking", function(){
    describe ("Create Endpoint", function(){
        var seats = [{
            "seatID": 12,
            "passenger": {
                "name": "Chaman",
                "sex": "M",
                "age": 52,
                "email": "karafasfaa@gmail.com"
            }
        }, {
            "seatID": 19,
            "passenger": {
                "name": "Mr. a Huffle Puff",
                "sex": "M",
                "age": 52,
                "email": "karafafasfssfaa@gmail.com"
            }
        }]

        it("Multiple Creation", (done) => {
            for (var i=0; i<seats.length; i++) {
                console.log(seats[i])
                chai.request(server)
                    .post("/create")
                    .send(seats[i])
                    .end((err, res) => {
                        console.log("Response Body:", res.body);
                    })
            }
            done();
        })
    
        // it ("Should Fecth all the Books", (done)=>{
        //     chai.request(server)
        //         .get("/books/")
        //         .end((err, result)=>{
        //             result.should.have.status(200);
        //             console.log ("Got",result.body.data.length, " docs")
        //             //console.log ("Result Body:", result.body);
                    
        //             done()
        //         })
        // })

        // it ("Should Fetch Particular Book only", (done)=>{
        //     chai.request(server)
        //         .get("/books/"+books[1].isbn)
        //         .end((err, result)=>{                    
        //             result.should.have.status(200)
        //             console.log("Fetched Particlar Book using /GET/BOOKS/:BOOKID ::::", result.body)
        //             done()
        //         })
        // })

        // it ("Should Update Partcular Book Only", (done)=>{
        //     var updatedBook = {
        //         "isbn": "121213",
        //         "title": "Node JS",
        //         "author": "John",
        //         "year": "2017" /// year is changed
        //     }
            
        //     chai.request(server)
        //         .put("/books/"+books[1].isbn)
        //         .send(updatedBook)
        //         .end((err, result)=>{                    
        //             result.should.have.status(200)
        //             console.log("Updated Particlar Book using /GET/BOOKS/:BOOKID ::::", result.body)
        //             done()
        //         })
        // })

        // it ("should check data updated in DB", (done)=>{
        //     chai.request(server)
        //         .get("/books/"+books[1].isbn)
        //         .end((err, result)=>{                    
        //             result.should.have.status(200)                
        //             result.body.data.year.should.eq("2017")
        //             console.log("Fetched Particlar Book using /GET/BOOKS/:BOOKID ::::", result.body)    
        //             done()
        //         })
        // })

        // it("Should Delete Particular Book", (done)=>{
        //     chai.request(server)
        //         .delete("/books/"+books[1].isbn)
        //         .end((err, result)=>{                    
        //             result.should.have.status(200)                
        //             console.log("Deleted Particlar Book using /GET/BOOKS/:BOOKID ::::", result.body)    
        //             done()
        //         })
        // })

        // it("Should confirm delete with number of Docs from DB", (done)=>{
        //     chai.request(server)
        //         .get("/books/")
        //         .end((err, result)=>{
        //             result.should.have.status(200);
        //             result.body.data.length.should.eq(1);
        //             console.log ("Got",result.body.data.length, " docs")
        //             //console.log ("Result Body:", result.body);
        //             done()
        //         })
        // })

    })
})
