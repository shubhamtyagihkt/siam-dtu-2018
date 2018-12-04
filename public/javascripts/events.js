$(document).ready(function(){
    var data = null;
    /*----------------------------------------------Firebase read---------------------------------------------*/
    var config = {
        apiKey: "AIzaSyBZAlUQNvOiifOWKSCCSd4JrwuUo1JQcWg",
        authDomain: "siam-2k17-app.firebaseapp.com",
        databaseURL: "https://siam-2k17-app.firebaseio.com",
        storageBucket: "siam-2k17-app.appspot.com",
        messagingSenderId: "938483124503"
    };
    firebase.initializeApp(config);
    initApp();

    function initApp() {
        // Result from Redirect auth flow.
        // [START getidptoken]
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // [START_EXCLUDE]
                console.log("Sahi jaa rha hai");
            } else {
                console.log('null');
                // [END_EXCLUDE]
            }
            // The signed-in user info.
            var user = result.user;
            console.log(user);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // [START_EXCLUDE]
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
                // If you are using multiple auth providers on your app you should handle linking
                // the user's accounts here.
            } else {
                console.error(error);
            }
            // [END_EXCLUDE]
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;

                $("#loggedin").text(displayName);
                $(".img-icons").attr("src",photoURL);
            } else {
                // User is signed out.
            }
            // [START_EXCLUDE]

            // [END_EXCLUDE]
        });
        // [END authstatelistener]
    }

    $("#login").click(function(){
        if($(this).find("#loggedin").text() != "Sign In via Google"){
            if (confirm('Are you sure you want to Sign out?')) {
                toggleSignIn();
            } else {
                return;
            }
        }
        else{
             toggleSignIn();
        }
    })
    function toggleSignIn() {
        if (!firebase.auth().currentUser) {
            // [START createprovider]
            var provider = new firebase.auth.GoogleAuthProvider();
            // [END createprovider]
            // [START addscopes]
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            // [END addscopes]
            // [START signin]
            firebase.auth().signInWithRedirect(provider);
            console.log("Signed in");
            $("#loggedin").text(displayName);
            $(".img-icons").attr("src",photoURL);
            // [END signin]
        } else {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
            console.log("signed out");
            $("#loggedin").text("Sign in via Google");
            $(".img-icons").attr("src","../images/google.png");
        }
        // [START_EXCLUDE]
      //  document.getElementById('login').disabled = true;
        // [END_EXCLUDE]
    }

    var flag = 1;
    hidertagline();
    $(window).on('scroll',function(){
        if(flag != 1 && $('#nav-fixer').offset().top -    $(window).scrollTop() < -40){
            $("#tag-line").slideUp("slow");
            flag = 1;
        }
        else if(flag != 0 && $('#nav-fixer').offset().top - $(window).scrollTop() >= -40){
            $("#tag-line").slideDown("slow");
            flag = 0;
        }
    });

    function hidertagline(){
        if(flag != 1 && $('#nav-fixer').offset().top - $(window).scrollTop() < -150){
            $("#tag-line").slideUp("slow");
            flag = 1;
        }
        else if(flag != 0 && $('#nav-fixer').offset().top - $(window).scrollTop() >= -150){
            $("#tag-line").slideDown("slow");
            flag = 0;
        }
    }

    $("#below").slideDown();
})