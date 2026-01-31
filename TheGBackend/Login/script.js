// const get = elem => document.getElementById(elem),
// 					 registerButton = get('register'),
// 					 loginButton = get('login'),
// 					 container = get('container')
 
// registerButton.onclick = () => {
// 					 container.className = "active"
// }

// loginButton.onclick = () => {
// 						container.className = "close"
// }
 
// if(activeform === 'register'){
// 	      container.className = 'active';
// }else{
// 				container.className = "close"
// }

//   const div = document.querySelector('.div');
// 	console.log('check : '+check)
//     if(check){
//                setTimeout(_=>{
//                    div.classList.remove('active')
//             },3000);
//         }

const get = elem => document.getElementById(elem),
      registerButton = get('register'),
      loginButton = get('login'),
      container = get('container');

// Handle Manual Flips
registerButton.onclick = () => {
    container.className = "active";
};

loginButton.onclick = () => {
    container.className = "close";
};

// 1. Initial State: Set the correct side of the card on page load
if (activeFormState === 'register') {
    container.className = 'active';
} else {
    container.className = "close";
}

// 2. Error Message Handling: Fade out error messages after 3 seconds
const errorDiv = document.querySelector('.div.active');
if (errorDiv) {
    setTimeout(() => {
        errorDiv.style.transition = "opacity 0.5s ease";
        errorDiv.style.opacity = "0";
        setTimeout(() => errorDiv.remove(), 500); // Remove from DOM after fade
    }, 3000);
}


// document.querySelectorAll('.button').forEach(btn=> btn.addEventListener('click', _=>{
//  location.reload(true);
// }));