import { cart } from "./cart.js";
import { getfood } from "../food.unit/food.js";
import { deliveryOptions } from "./delivery-option.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {collection,  getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};//

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const stores = getFirestore(app);
function Loading(){
 setTimeout(()=>{
const loader = document.getElementById("loading-screen")
  if(loader) {loader.style.display = "none";
    loader.classList.add('hidden');
    setTimeout(()=> loader.remove(), 300)
  }
 }, 1300) 

}
onAuthStateChanged(auth, async(user)=>{


  if(user){
    Loading()
    const store = doc(stores, 'users', user.uid);
    const togetstore = await getDoc(store)
    if(togetstore.exists()){
      const cart = togetstore.data().cart ;
      display(cart)
      dayjs()
     
  
    }
  }else {
    window.location.href = "login.html";
  }
})

async function display  (cart) {
  const user = auth.currentUser;
    let userName = "Anonymous"; // fallback
    if (user) {
      const userRef = doc(stores, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        userName = data.name || "Anonymous";
      }}
  let e = 'no order yet'
  
  const all = document.querySelector('.js-orders');
  if (!all) return;
  let sets = "";

  // compute totals once if you need them per-order OR compute per-item below
  cart.forEach(inner => {
    const matchingfood = getfood(inner.save);
    if (!matchingfood) return;

    const deliveryOption = deliveryOptions.find(o => o.id === inner.deliveryOptionId) || { deliveryDays: 0 };
    const dateString = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd D MMMM YYYY');
    const totalPrice = Number(matchingfood.price || 0) * Number(inner.quantity || 0);
const ischecked = deliveryOption.id === inner.deliveryOptionId;

    sets += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date"><img class='img' src = 'images1/iconss/sbeclogo.png'><br>
              <div class="order-header-label label">Order Placed: ${dateString}</div>
        
            </div>
            
          </div>

         
        </div>



          <div class="product-details">
      <div class="order-header-right-section">
            <div class="order-header-label">Name: ${userName}</div>
          </div>
            <div class="product-name">Order: ${matchingfood.name}</div>
            <div class="product-delivery-date foodi">Price: D${matchingfood.price}</div>
            <div class="product-quantity "> Ordered: ${inner.quantity}</div>
            <div class="order-total">
              <div class="order-header-label">Total: D${totalPrice.toFixed(2)}</div>

            </div>
          </div>
        </div>
      </div>
    `;
  });

  all.innerHTML = sets;
}
display(cart);



/*uncles code not mine*/
async function printAllReceipts() {
  try {
    const usersCol = collection(stores, 'users');
    const snapshot = await getDocs(usersCol);

    if (snapshot.empty) {
      alert('No users found.');
      return;
    }

    let receiptsHtml = '';

    snapshot.forEach(userDoc => {
      const userData = userDoc.data();
      const userName = userData.name || 'Anonymous';
      const cart = Array.isArray(userData?.cart) ? userData.cart : [];
      if (!cart.length) return;

      cart.forEach(inner => {
        const matchingfood = getfood(inner.save);
        if (!matchingfood) return;

        const deliveryOption = deliveryOptions.find(o => o.id === inner.deliveryOptionId) || { deliveryDays: 0 };
        const dateString = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd D MMMM YYYY');
        const totalPrice = Number(matchingfood.price || 0) * Number(inner.quantity || 0);

        receiptsHtml += `
        <div class="order-container" style="width:320px; margin: 20px auto; box-shadow: 0 10px 15px rgba(0,0,0,0.4); font-family: Arial, Helvetica, sans-serif;">
          <div class="order-header" style="background-color:#000; color:#fff; padding:15px; text-align:center;">
            <img src="images1/iconss/sbeclogo.png" style="width:100px; display:block; margin:0 auto 10px;" />
            <div style="font-weight:900;">Order Placed: ${dateString}</div>
          </div>
          <div class="product-details" style="background:#fff; padding:15px; border:1px solid #000; border-top:none;">
            <div style="border-bottom:1px solid #000; padding:10px 0; font-weight:700;">Name: ${escapeHtml(userName)}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Order: ${escapeHtml(matchingfood.name)}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Price: D${matchingfood.price}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Ordered: ${inner.quantity}</div>
            <div style="padding:5px 0; font-weight:900; border-top:1px solid #000;">Total: D${totalPrice.toFixed(2)}</div>
          </div>
        </div>
        <div style="page-break-after:always;"></div>
        `;
      });
    });

    if (!receiptsHtml) {
      alert('No receipts to print.');
      return;
    }

    const fullHtml = `
      <html>
      <head>
        <title>All Receipts</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          body { background:#fff; color:#000; margin:0; padding:0; }
          .order-container { page-break-inside:avoid; }
        </style>
      </head>
      <body>
        ${receiptsHtml}
      </body>
      </html>
    `;

    const w = window.open('', '_blank', 'top=50,left=50,width=420,height=800');
    if (!w) { alert('Popup blocked — allow popups to print.'); return; }
    w.document.open();
    w.document.write(fullHtml);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);

  } catch (err) {
    console.error(err);
    alert('Failed to fetch or print receipts.');
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"]/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[s]
  );
}

document.getElementById('print-all-btn')?.addEventListener('click', () => {
  if (!confirm('Print all receipts now?')) return;
  printAllReceipts();
});
