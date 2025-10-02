const buses = [
    {id:1, name:"Express Line", from:"Sattur", to:"Coimbatore", time:"10:00 AM", price:600},
    {id:2, name:"Sky Travels", from:"Chennai", to:"Sattur", time:"2:00 PM", price:1500},
    {id:3, name:"Royal Bus", from:"Madurai", to:"Trichy", time:"6:00 PM", price:600},
];

let selectedBus = null;
let selectedSeats = [];
let occupiedSeats = {1:[1,4,7], 2:[2,5,8], 3:[3,6,9]};

function searchBuses() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    const filtered = buses.filter(bus => bus.from===from && bus.to===to);

    if(filtered.length===0) resultsDiv.innerHTML="<p>No buses found.</p>";
    else {
        filtered.forEach(bus => {
            resultsDiv.innerHTML += `<p>${bus.name} | ${bus.from} → ${bus.to} | ${bus.time} | ₹${bus.price} 
            <button onclick="selectBus(${bus.id})">Select</button></p>`;
        });
    }
}

function selectBus(busId){
    selectedBus = buses.find(b => b.id===busId);
    selectedSeats = [];
    updateSummary();
    document.getElementById("busTitle").innerText=`${selectedBus.name} | ${selectedBus.from} → ${selectedBus.to} | ${selectedBus.time}`;
    document.getElementById("seatSelection").style.display="block";
    
    const busLayout = document.getElementById("busLayout");
    busLayout.innerHTML="";

    for(let i=1;i<=16;i++){
        const seat=document.createElement("div");
        seat.className="seat";

        if(i%4===1 || i%4===0) seat.classList.add("window");
        else seat.classList.add("aisle");

        if(occupiedSeats[busId] && occupiedSeats[busId].includes(i)) seat.classList.add("occupied");

        seat.innerText=i;
        seat.onclick=()=>toggleSeat(seat,i);
        busLayout.appendChild(seat);
    }
}

function toggleSeat(seatDiv, seatNumber){
    if(seatDiv.classList.contains("occupied")) return;

    if(selectedSeats.includes(seatNumber)){
        selectedSeats = selectedSeats.filter(s=>s!==seatNumber);
        seatDiv.classList.remove("selected");
    } else {
        selectedSeats.push(seatNumber);
        seatDiv.classList.add("selected");
    }
    updateSummary();
}

function updateSummary(){
    document.getElementById("selectedSeats").innerText=selectedSeats.length>0?selectedSeats.join(", "):"None";
    document.getElementById("totalPrice").innerText=selectedSeats.length>0?selectedSeats.length*selectedBus.price:0;
}

function confirmBooking(){
    if(selectedSeats.length===0){ alert("Select at least one seat!"); return; }

    if(!occupiedSeats[selectedBus.id]) occupiedSeats[selectedBus.id]=[];
    occupiedSeats[selectedBus.id]=[...occupiedSeats[selectedBus.id], ...selectedSeats];

    // Fill bill slip details
    document.getElementById("billBusName").innerText = selectedBus.name;
    document.getElementById("billRoute").innerText = `${selectedBus.from} → ${selectedBus.to}`;
    document.getElementById("billTime").innerText = selectedBus.time;
    document.getElementById("billDate").innerText = document.getElementById("date").value || "N/A";
    document.getElementById("billSeats").innerText = selectedSeats.join(", ");
    document.getElementById("billPrice").innerText = selectedBus.price;
    document.getElementById("billTotal").innerText = selectedSeats.length * selectedBus.price;

    // Show bill slip
    document.getElementById("billSlip").style.display = "block";

    // Reset seat selection
    selectedSeats = [];
    updateSummary();
    document.getElementById("seatSelection").style.display="none";
}

// Function to close the bill slip
function closeBill(){
    document.getElementById("billSlip").style.display = "none";
}