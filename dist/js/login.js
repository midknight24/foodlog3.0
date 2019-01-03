var state = 'login';

var elements = {
    info_card: document.querySelector('.login_card'),
    button_1: document.querySelector('button:nth-last-child(2)'),
    button_2: document.querySelector('button:nth-last-child(1)'),
    email: document.getElementById('email'),
    password: document.getElementById('password')
}

function createUser(email,password){
    firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email,password)
    .catch(error=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function saveLoginInfo(email,password){
    sessionStorage.setItem('email',email);
    sessionStorage.setItem('password',password);
}

function userLogin(email,password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        if(errorCode=='auth/wrong-password'){
            alert("incorrect log in info!");
        }
      });
}

//listener for auth state
firebase.auth().onAuthStateChanged(async function(user){
    if (user) {
      // User is signed in.
      console.log(user);
      saveLoginInfo(email,password);
      fadeOut();
      await (function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    })(1000);
      location.href = '/index.html';
    } else {
      // User is signed out.
      console.log("User signed out");
    }
});



elements.button_1.addEventListener('click',()=>{
    var email = elements.email.value;
    var password = elements.password.value;
    if(state =='signup'){
        createUser(email,password);
    }else if(state == 'login'){
        userLogin(email,password);
    }
});

elements.button_2.addEventListener('click',()=>{
    state = 'signup';
    elements.button_2.style.visibility = 'hidden';
    elements.button_1.innerHTML = 'Sign me Up!';
});

function fadeOut(){
    elements.info_card.classList.add('hidden');
}