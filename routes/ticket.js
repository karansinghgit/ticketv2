//MODULE IMPORTS
const express = require('express')

//MODEL IMPORTS
const { Ticket } = require('../models/ticket')
const { Passenger } = require('../models/passenger');

//ROUTER OBJECT INIT
const router = express.Router();

//CREATE A TICKET {POST}
router.post('/create', async (req, res) => {
    data = await req.body
    try { 
        for(var i=0; i< data.length; i++) {
            obj = data[i]
            try {
                //Check if seatID is valid
                if (parseInt(obj.seatID) > 40) {
                    return res.status(400).send("Invalid SeatID. There are only 40 seats in the Bus!");
                }

                //Check if seat is already booked.
                let exists = await Ticket.findOne({
                    isBooked: true,
                    seatID: obj.seatID
                });
                
                if (exists) {
                    return res.status(400).send("The seat you are looking for is already booked");
                }
                //Save Passenger to Atlas Cluster
                const passenger = new Passenger(obj.passenger);
                const passengerData = await passenger.save();

                if (passengerData) {
                    //If passenger was saved, save a ticket entry, corresponding to the passenger
                    const ticket = new Ticket()
                    ticket.seatID = obj.seatID
                    ticket.isBooked = true
                    ticket.passengerObj = passenger._id;
                    const ticketData = await ticket.save();
                    if (ticketData) {
                        res.status(200).send(ticketData);
                    }
                }

            } catch (err) {
                // console.log("ERROR:: ", err)
                return res.status(403).send(err);
            }
        }
        
    } catch (err) {
        console.log("ERROR:: ", err)
        return res.status(403).send(err);
    }
});

//VIEW ALL OPEN TICKETS {GET}
router.get('/viewOpen', async (req, res) => {
    try {
        //Fetch all open tickets
        const data = await Ticket.find({
            isBooked: false
        });
        return res.status(200).send(data);
    } catch {
        console.log("ERROR:: ", err)
        return res.status(403).send("Unknown Error!");
    }
})

//VIEW ALL CLOSED TICKETS {GET}
router.get('/viewClosed', async (req, res) => {
    try {
        //Fetch all closed tickets
        const data = await Ticket.find({
            isBooked: true
        });
        return res.status(200).send(data);
    } catch {
        console.log("ERROR:: ", err)
        return res.status(403).send("Unknown Error!");
    }
})

//VIEW TICKET STATUS {GET}
router.get('/:ticketId', async (req, res) => {
    try {
        //Get the ticketId from parameters
        const { ticketId } = req.params;
        //Find the ticket using ticketId in the Atlas Cluster
        const ticketData = await Ticket.findById(ticketId);
        //Return status of the booked ticket if found
        if (ticketData) {
            return res.status(200).json({
                isBooked: ticketData.isBooked
            });
        }
        else{
            return res.status(404).json({
                "message": "Ticket ID is incorrect!"
            })
        }
    } catch (err) {
        console.log("ERROR:: ", err)
        return res.status(403).send("Unknown Error!");
    }
})

//UPDATE TICKET STATUS {PUT}
router.put('/:ticketId', async (req, res) => {
    try {
        //Get the ticketId from parameters
        const { ticketId } = req.params;
        //Find the ticket using ticketId in the Atlas Cluster and update it's status
        const ticketData = await Ticket.findByIdAndUpdate(ticketId, {
            $set: { isBooked: req.body.isBooked }},
            {new: true}
        );
        if(!ticketData){
            return res.status(404).json({
                "message": "Ticket ID is incorrect!"
            })
        }
        //Get PassengerID from ticket and update passenger details
        const passengerId = ticketData.passengerObj
        await Passenger.findByIdAndUpdate(passengerId, 
            { $set: req.body.passenger }, 
            { new: true }, 
        );
        res.json({
            "message":"Successfully Updated Details!"
        })
    } catch (err) {
        console.log("ERROR:: ", err)
        return res.status(403).send("Unknown Error!");
    }
});

module.exports = router;