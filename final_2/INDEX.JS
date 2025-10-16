/* ===== Product Data ===== */
const products = [
    {name:"Munch", stock:15, price:10, selected:0, img:"pic/munch-removebg-preview.png"},
    {name:"Lays", stock:20, price:10, selected:0,img:"pic/lays-removebg-preview.png"},
    {name:"Kitkat", stock:10, price:10, selected:0,img:"pic/kitkat-removebg-preview.png"},
    {name:"Cococola", stock:15, price:40, selected:0,img:"pic/coco-removebg-preview.png"},
    {name:"Sprite", stock:15, price:50, selected:0,img:"pic/sprite-removebg-preview.png"},
    {name:"Bourborn",stock:20, price:20, selected:0,img:"pic/bour-removebg-preview.png"},
    {name:"Hide & Seek Fab",stock:20, price:15, selected:0,img:"pic/hide-removebg-preview.png"},
    {name:"Snickers",stock:10, price:10, selected:0,img:"pic/sn-removebg-preview.png"},
    {name:"Perk",stock:5, price:30, selected:0,img:"pic/perk-removebg-preview.png"},
    {name:"Bingo",stock:20, price:10, selected:0,img:"pic/0031625_bingo-mad-angles-chips-mmmm-masala-33g-pouch_510-removebg-preview.png"},
    {name:"Doritos",stock:20, price:20, selected:0,img:"pic/doritos-removebg-preview.png"},
    {name:"Pringles",stock:10, price:50, selected:0,img:"pic/pringles-removebg-preview.png"},
    {name:"Haldiram’s Bhujia",stock:20, price:10, selected:0,img:"pic/bhujia-removebg-preview.png"},
    {name:"Mirinda",stock:15, price:45, selected:0,img:"pic/mirinda-removebg-preview.png"},
    {name:"Good Day",stock:20, price:30, selected:0,img:"pic/good_day-removebg-preview.png"},
    {name:"Treat",stock:20, price:10, selected:0,img:"pic/treat-removebg-preview.png"}
];

const VALID_DISCOUNT = "NAND111";
const DEFAULT_PIN = "010128"; // Card PIN
let currentSubtotal = 0;
let currentDiscount = 0;
let isPaid = false;

/* ===== Render Products ===== */
const productsDiv = document.getElementById("products");

function renderProducts() {
    productsDiv.innerHTML = "";
    products.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>Stock: <span id="stock-${idx}">${p.stock}</span></p>
            <p>Price: ₹${p.price}</p>
            <input type="number" min="1" id="qty-${idx}" placeholder="Qty">
            <button id="add-${idx}">Add</button>
            <button id="reset-${idx}">Reset</button>
            <p>Selected: <span id="selected-${idx}">${p.selected}</span> — Subtotal: ₹<span id="sub-${idx}">${p.selected * p.price}</span></p>
        `;
        productsDiv.appendChild(card);

        document.getElementById(`add-${idx}`).addEventListener("click", () => addProduct(idx));
        document.getElementById(`reset-${idx}`).addEventListener("click", () => resetProduct(idx));
    });
}

/*  Add / Reset Product*/
function addProduct(idx) {
    const p = products[idx];
    const qty = Number(document.getElementById(`qty-${idx}`).value);
    if (!qty || qty <= 0) { alert("Enter valid quantity!"); return; }
    if (qty > p.stock) { alert("Not enough stock!"); return; }

    p.selected += qty;
    p.stock -= qty;

    document.getElementById(`selected-${idx}`).innerText = p.selected;
    document.getElementById(`sub-${idx}`).innerText = p.selected * p.price;
    document.getElementById(`stock-${idx}`).innerText = p.stock;
    document.getElementById(`qty-${idx}`).value = "";
}

function resetProduct(idx) {
    const p = products[idx];
    p.stock += p.selected;
    p.selected = 0;

    document.getElementById(`selected-${idx}`).innerText = 0;
    document.getElementById(`sub-${idx}`).innerText = 0;
    document.getElementById(`stock-${idx}`).innerText = p.stock;
}

/* ===== Submit / Bill ===== */
const submitBtn = document.getElementById("submitBtn");
const billItems = document.getElementById("billItems");
const subtotalVal = document.getElementById("subtotalVal");
const discountVal = document.getElementById("discountVal");
const totalVal = document.getElementById("totalVal");

submitBtn.addEventListener("click", () => {
    

    billItems.innerHTML = "";
    currentSubtotal = 0;

    products.forEach(p => {
        if (p.selected > 0) {
            billItems.innerHTML += `<p>${p.name} × ${p.selected} = ₹${p.selected * p.price}</p>`;
            currentSubtotal += p.selected * p.price;
        }
    });

    subtotalVal.innerText = currentSubtotal;
    discountVal.innerText = currentDiscount;
    totalVal.innerText = currentSubtotal - currentDiscount;

    if (currentSubtotal > 0) {
        showDiscountInput();
        document.getElementById("bill").style.display = "block";
    }
});

/* ===== Discount Logic ===== */
function showDiscountInput() {
    let discountDiv = document.getElementById("discountContainer");
    if (!discountDiv) {
        discountDiv = document.createElement("div");
        discountDiv.id = "discountContainer";
        discountDiv.innerHTML = `
            <p>Enter Discount Code:</p>
            <input type="text" id="discountInput" placeholder="Enter code">
            <button id="applyDiscountBtn">Apply Discount</button>
        `;
        billItems.appendChild(discountDiv);
    }

    document.getElementById("applyDiscountBtn").addEventListener("click", () => {
        const code = document.getElementById("discountInput").value.trim().toUpperCase();
        if (code === VALID_DISCOUNT) {
            currentDiscount = Math.round(currentSubtotal * 0.1);
            alert("Discount applied!");
        } else {
            currentDiscount = 0;
            alert("Invalid code!");
        }

        discountVal.innerText = currentDiscount;
        totalVal.innerText = currentSubtotal - currentDiscount;

        showPaymentOptions();
    });
}

/* ===== Payment Options ===== */
function showPaymentOptions() {
  

    let old = document.getElementById("paymentOptions");
    if (old) old.remove();

    const paymentDiv = document.createElement("div");
    paymentDiv.id = "paymentOptions";
    paymentDiv.innerHTML = `
        <h3>Choose Payment Method:</h3>
        <div class="payment-option">
            <button id="gpayBtn">GPay</button>
            <img src="pic/gpay-removebg-preview.png" alt="GPay" class="payment-logo">
        </div>
        <div class="payment-option">
            <button id="cardBtn">Card</button>
            <img src="pic/card-removebg-preview.png" alt="Card" class="payment-logo">
            <div id="cardPinDiv" style="display:none; margin-top:5px;">
                <input type="password" id="cardPinInput" placeholder="Enter PIN">
                <button id="cardPinSubmit">Submit PIN</button>
            </div>
        </div>
        <div class="payment-option">
            <button id="upiBtn">UPI</button>
            <img src="pic/upi-icon-removebg-preview.png" alt="UPI" class="payment-logo">
        </div>
        <p id="paymentMessage" style="color:green;"></p>
    `;
    billItems.appendChild(paymentDiv);

    // GPay
    document.getElementById("gpayBtn").addEventListener("click", () => {
       
        window.open("https://pay.google.com", "_blank");
        isPaid = true;
        document.getElementById("bill").style.display = "none";
        alert("Payment successful via GPay!");
    });

    // UPI
    document.getElementById("upiBtn").addEventListener("click", () => {
       
        isPaid = true;
        document.getElementById("bill").style.display = "none";
        alert("Payment successful via UPI!");
    });

    // Card
    document.getElementById("cardBtn").addEventListener("click", () => {
        document.getElementById("cardPinDiv").style.display = "block";
    });

    document.getElementById("cardPinSubmit").addEventListener("click", () => {
       
        const enteredPin = document.getElementById("cardPinInput").value;
        if (enteredPin === DEFAULT_PIN) {
            isPaid = true;
            document.getElementById("bill").style.display = "none";
            alert("Card payment successful!");
        } else {
            alert("Incorrect PIN! Payment failed.");
        }
    });
}


renderProducts();
