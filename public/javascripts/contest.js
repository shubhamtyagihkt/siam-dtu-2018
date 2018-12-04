$(document).ready(function(){
    var flag = 1;
    hidertagline();
    $(window).on('scroll',function(){
        if(flag != 1 && $('#nav-fixer').offset().top - $(window).scrollTop() < -40){
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
    $("a.btn").click(function(){
        if($("#demo").is(":visible")){
            $("a.btn").text("More");
        }
        else{
            $("a.btn").text("Less");
        }
    });
    $(".each-ques").click(function(){
        $whichcolla = $(this);
        $whichcolla.find('.collapse').collapse('toggle');
    });

    var data = null;
    var errorcode = 0;
    /*----------------------------------------------Firebase read---------------------------------------------*/
    var config = {
        apiKey: "AIzaSyBZAlUQNvOiifOWKSCCSd4JrwuUo1JQcWg",
        authDomain: "siam-2k17-app.firebaseapp.com",
        databaseURL: "https://siam-2k17-app.firebaseio.com",
        storageBucket: "siam-2k17-app.appspot.com",
        messagingSenderId: "938483124503"
    };
    firebase.initializeApp(config);
    var rootRef = firebase.database();
    initApp();
    var player = null;
    function initApp() {
        // Result from Redirect auth flow.
        // [START getidptoken]
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // [START_EXCLUDE]
            //    console.log("Sahi jaa rha hai");
            } else {
            //    console.log('null');
                // [END_EXCLUDE]
            }
            // The signed-in user info.
            var user = result.user;
         //   console.log(user);
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
                player = user;

                $("#loggedin").text(displayName);
                $(".img-icons").attr("src",photoURL);
                nowset();
                func3(email);
            } else {
                // User is signed out.
              //  console.log("Not logged in");
                notloggedin();
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
    });
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
//            console.log("Signed in");
            // [END signin]
        } else {
            // [START signout]
            firebase.auth().signOut();
            // [END signout]
//            console.log("signed out");
            $("#loggedin").text("Sign In via Google");
            $(".img-icons").attr("src","../images/google.png");
        }
        // [START_EXCLUDE]
      //  document.getElementById('login').disabled = true;
        // [END_EXCLUDE]
    }
    function notloggedin(){
        $("#show-rule").hide();
        $("#rules").show();
        $("#question-stats").hide();
        $("#signed-out").fadeIn(300);
    }
    var userplaying = null;
    var current = null;
    var questions = null;

    function nowset(){
        var starCountRef = firebase.database().ref("/current");
        starCountRef.on("value",snap =>{
//            console.log(snap.val());
            current = snap.val();
            func15();
        });
    }
    var status = 0;
	function func15(){
		var starCountRef = firebase.database().ref("/isActive");
        starCountRef.on("value",snap =>{
            status = 1;
			if(status == 1){
				func1();
			}
			else{
				alert("Time to answer the last question is over, result is being computed!");
			}
		});
	}
    var ques = null;
    var questionsnap = null;
	
	
    function func1(){
        starCountRef = firebase.database().ref("/questions/" + current);
        starCountRef.on("value",snap =>{
            questionsnap = snap;
//            console.log(snap.val());
            ques = snap.val();
            func2();
        });
    }
    var answerType = null;
    function func2(){
        $("#question-now").text(ques.question);
		$("#number").text(current + 1);
		$("#credits").text(ques.credits);
        answerType = ques.answerType;
        if(ques.imageUrl != "null"){
			$("#ques-image").attr("src",ques.imageUrl);
		}
		else{
			$("#ques-image").hide();
		}
        $("#ques-image").attr("src",ques.imageUrl);
        $("#options").html("");
        if(answerType == 0){
            for(var i = 0; i < ques.options.length; ++i){
                var but = createradiobutton("optradio", i+1, ques.options[i]);
                var div = document.createElement('div');
                div.className = "radio";
                div.appendChild(but);
                document.getElementById("options").appendChild(div);
            }
            $("#options").fadeIn(300);
        }
        else if(answerType == 1){
            $("#subjective-ans").fadeIn(300);
        }
        $("#question-stats").fadeIn(300);
        $("#question-stats").css("display","inline-block");
    }
    function createradiobutton(name, value, text){
        var label = document.createElement("label");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;

        label.appendChild(radio);

        label.appendChild(document.createTextNode(text));

        return label;
    }
    var userexists = null;
    var attempts = null;
    var emailcompatible = null;
    var usersnap = null;

    function func3(email){
        emailcompatible = email.replace(".", ",");
        emailcompatible = emailcompatible.replace(".",",");
        starCountRef = firebase.database().ref("/Users/");
        starCountRef.on("value",snap =>{
            if(snap.hasChild(emailcompatible)){
                usersnap = snap.child(emailcompatible);
                $("#new-block").hide(300);
                func10();
            }
            else{
                errorcode = 2;
                func9();
                return;
            }
            attempts = usersnap.child("attemptedQuestions");
//            console.log(attempts.numChildren());
//            console.log(usersnap.val());
            userplaying = usersnap.val();
//            console.log(userplaying);
            if(userplaying == null){
                userexists = false;
            }
            else{
                userexists = true;
            }
            func4();
        });
    }

    function func4(){
        if(!userexists){
            $(".score-num").text("Nil");
            $(".credits-num").text("Nil");
        }
        else if(userexists){
            var displayinfo = null;
            starCountRef = firebase.database().ref("/leaderBoard/" + emailcompatible);
            starCountRef.on("value",snap =>{
                displayinfo = snap.val();
                $(".score-num").text(displayinfo.score);
                $(".credits-num").text(usersnap.val().credits);
                func5();
            });
        }
    }

    var attempted = null;
    var userquestionstatus = [];
    var corrects = 0;
    var wrongs = 0;
    var na = 0;

    function func5(){
        $("#totalattempts").text(attempts.numChildren());
        corrects = 0;
        wrongs = 0;
        na = 0;
        for(var i = 0; i < current; ++i){
            if(attempts.hasChild("/" + i)){
                userquestionstatus.push({
                    quesnum : i,
                    answer : attempts.child(i).val().answer,
                    status : attempts.child(i).val().status,
                    score : attempts.child(i).val().score
                });
                if(attempts.child(i).val().status == "correct"){
                    corrects++;
                }
                else if(attempts.child(i).val().status == "wrong"){
                    wrongs++;
                }
            }
            else{
                userquestionstatus.push({
                    quesnum : i,
                    answer : "ummm..",
                    status : "Not attempted",
                    score : 0
                });
            }
        }
        $("#corrects").text(corrects);
        $("#wrongs").text(wrongs);
        func6();
    }

    var prevquestions = null;

    function func6(){
        starCountRef = firebase.database().ref("/questiondisplay");
        starCountRef.limitToFirst(current).on("value",snap =>{
            prevquestions = snap.val();
            func7();
        });
    }

    function func7(){
        if(current == 0){
            
        }
        else{
            $("#question-list").html("");
            for(var i = 0; i < current; ++i){

                var li = document.createElement('li');
                li.className = "list-group-item";

                var div1 = document.createElement('div');
                div1.className = "each-ques";

                var div2 = document.createElement('div');
                div2.className = "ques-line";
                div2.innerHTML = prevquestions[i].question;

                var div3 = document.createElement('div');
                div3.className = "each-response container";

                var div4 = document.createElement('div');
                div4.className = "collapse";

                var div5 = document.createElement('div');
                div5.className = "line1";

                var div6 = document.createElement('div');
                div6.className = "col-md-6";

                var span1 = document.createElement('span');
                span1.className = "rightword";
                span1.innerHTML = "Right answer: ";

                var span2 = document.createElement('span');
                span2.className = "right-ans";
                span2.innerHTML = prevquestions[i].answer;

                div6.appendChild(span1);
                div6.appendChild(span2);

                var div7 = document.createElement('div');
                div7.className = "col-md-6";

                var span3 = document.createElement('span');
                span3.className = "yourword";
                span3.innerHTML = "Your answer: ";

                var span4 = document.createElement('span');
                span4.className = "your-ans";
                span4.innerHTML = userquestionstatus[i].answer;

                div7.appendChild(span3);
                div7.appendChild(span4);

                div5.appendChild(div6);
                div5.appendChild(div7);

                var div8 = document.createElement('div');
                div8.className = "line2";

                div6 = document.createElement('div');
                div6.className = "col-md-6";

                span1 = document.createElement('span');
                span1.className = "statusword";
                span1.innerHTML = "Status: ";

                span2 = document.createElement('span');
                span2.className = "status";
                span2.innerHTML = userquestionstatus[i].status;

                div6.appendChild(span1);
                div6.appendChild(span2);

                div7 = document.createElement('div');
                div7.className = "col-md-6";

                span3 = document.createElement('span');
                span3.className = "scoreword";
                span3.innerHTML = "Score: ";

                span4 = document.createElement('span');
                span4.className = "score-this";
                span4.innerHTML = userquestionstatus[i].score;

                div7.appendChild(span3);
                div7.appendChild(span4);

                div8.appendChild(div6);
                div8.appendChild(div7);

                div4.appendChild(div5);
                div4.appendChild(div8);

                div3.appendChild(div4);

                div1.appendChild(div2);
                div1.appendChild(div3);

                li.appendChild(div1);

                document.getElementById("question-list").appendChild(li);
            }
        }
        funcleaders("leaderBoard");
    }

    var submissions = null;
    var correctsubmissions = null;
    var ans = null;

    $("#ans-submit").click(function(){
        if(errorcode == 2){
//            console.log("Ayaa to sahi jagah hai");
            $("#error-name").text("Start Quiz first");
            $(".error-line").slideDown(300);
            return;
        }
        if(answerType == 0){
            ans = $("input[name=optradio]:checked").val();   
        }
        else if(answerType == 1){
            ans = $("#subjective-input").val();
        }
//        console.log(ans);
        if(ans == "undefined" || ans == ""){
            return;
        }
        starCountRef = firebase.database().ref("/questions/" + current);
        starCountRef.on("value",snap =>{
            submissions = snap.child("/attemptedBy").numChildren();
            correctsubmissions = snap.child("/winnerEmail").numChildren();
            func8();
        });
    });

    var status = null;
    var topten = null;
    var score = 0;
    var onlyonce = false;

    function func8(){
        var submitposition = questionsnap.child("attemptedBy").numChildren();
//        var winnerposition = questionsnap.child("winnerEmail").numChildren();
        if(onlyonce != true){
//            if(ques.answer == ans){
//                status = "correct";
//                score = calculatescore(winnerposition);
//            }
//            else{
//                status = "wrong";
//            }
            var postData1 = {};
            var answer = null;
            var postData2 = {
                "email" : player.email,
            };
            
            if(answerType == 0){
                postData1.answer = (ques.options[ans-1]).substring(3);
                postData2.answer = (ques.options[ans-1]).substring(3);
            }
            else if(answerType == 1){
                postData1.answer = ans;
                postData2.answer = ans;
            }
            
            var updates = {};
            updates['/Users/' + emailcompatible + '/attemptedQuestions/' + current] = postData1;
            updates['/questions/' + current + '/attemptedBy/' + submitposition] = postData2;
//            if(score != 0){
//                updates['/Users/' + emailcompatible + '/todays credits'] = ques.credits;
//                updates['/questions/' + current + '/winnerEmail/' + winnerposition] = postData3;
//            }
            onlyonce = true;
            return firebase.database().ref().update(updates);
        }
    }
//    function calculatescore(submits){
//        var score = 10;
//        if(submits < 20){
//            score = 30 - submits;
//        }
//        return score;
//    }

    $("#new-start").click(function(){
        var postData1 = {
            "credits" : 0,
            "email"  : player.email,
            "name" : player.displayName,
            "photoUrl" : player.photoURL,
            "today's credits" : 0,
            "uid" : player.uid
        };

        var postData2 = {
            "name" : player.displayName,
            "score" : 0
        };

        var updates = {};
        updates['/Users/' + emailcompatible] = postData1;
        updates['/leaderBoard/' + emailcompatible] = postData2;
        updates['/monthlyLeaderBoard/' + emailcompatible] = postData2;
        errorcode = 0;
        $(".error-line").text("COOL, Now Answer!");
        $(".error-line").css("color","#1d693b");
        return firebase.database().ref().update(updates);
    });

    function func9(){
        $("#new-block").show();
        $("#show-rule").hide();
        $("#rules").show();
        $(".score-num").text("NIL");
        $(".badge").text("NIL");
    }

    function func10(){
        $("#show-rule").show();
        $("#rules").hide();
        if(usersnap.child("/attemptedQuestions").hasChild("/" + current)){
            $("#buttonorline").text("Woah, You have successfully submitted your answer! Wait for the result.");
            $(".error-line").hide();
        }
    }

    var allleaders = [];
    var length = 0;
    function funcleaders(whatleader){
        allleaders.splice(0,allleaders.length);
        length = 0;
        starCountRef = firebase.database().ref("/" + whatleader);
        starCountRef.orderByChild("score").on("child_added",snap =>{
            var em = snap.key;
            var na = snap.val().name;
            var sc = snap.val().score;
            allleaders.push({
                email : em,
                name : na,
                score : sc
            });
        });
        setTimeout(funcsetleaders.bind(null, whatleader), 3000);
    }
    function funcsetleaders(whatleader){
        var counter = allleaders.length-1;
        var rank = 1;
        //console.log(allleaders);
        $("#"+whatleader).html("");
        //console.log(whatleader);
        while(counter >= 0 && allleaders[counter].score > 0){
            var tr = document.createElement('tr');
            
            var td = document.createElement('td');
            td.innerHTML = rank;
            tr.appendChild(td);
            
            td = document.createElement('td');
            td.innerHTML = allleaders[counter].name;
            tr.appendChild(td);
            
            td = document.createElement('td');
            td.innerHTML = allleaders[counter].score;
            tr.appendChild(td);
            
            var email = allleaders[counter].email.replace(",", ".");
            td = document.createElement('td');
            td.className = "list-email";
            td.innerHTML = email;
            tr.appendChild(td);
            document.getElementById(whatleader).appendChild(tr);
            counter--;
            rank++;
        }
        if(status == 1 && whatleader == "leaderBoard"){
            $("#leaderboard-buttons").show();
            funcleaders("monthlyLeaderBoard");
        }
        else if(status == 1 && whatleader == "monthlyLeaderBoard"){
            $("#alltime-leaderboard").show();
        }
    } 
    
    $(document).on('click','.ques-line',function(){
        var inside = $(this).next().find(".collapse");
        if($(inside).is(":visible")){
            inside.slideUp(200);
        }
        else{
            inside.slideDown(200);
        }
    });
    var redeemed = 0;
    $("#redeem").click(function(){
        var redeemVal = 0;
        starCountRef = firebase.database().ref("/Users/" + emailcompatible + "/credits");
        starCountRef.on("value",snap =>{
            redeemVal = snap.val();
            var send = 0;
            var leave = 0;
            leave = redeemVal;
            if(redeemVal >= 20 && redeemed == 0){
                for(var i = 20; i <= redeemVal; i=i+20){
                    send = send + 20;
                    leave = leave - 20;
                }
                var postData = {
                    "value" : send
                }
                if (confirm('Your '+send+' credits will be redeemed and '+leave+' credits will be left in your account. Do you want to proceed?')) {
                    var updates = {};
                    var newPostKey = firebase.database().ref().child("redeem").push().key;
                    updates['/redeem/' + newPostKey + "/" + emailcompatible] = postData;
                    updates['/Users/' + emailcompatible + '/credits'] = leave;
                    $("#credits-change").text("Cool : You have successfully redeemed your "+send+" credits. You will receive your voucher in 24 hours via email.");
                    redeemed = 1;
                    return firebase.database().ref().update(updates);
                } else {
                    return;
                }
            } else if(redeemVal < 20 && redeemed == 0) {
                $("#credits-change").text('Note: You should have a minimum of 20 credits to redeem!');
                return;
            }
            else {
                return;
            }
        });
    })
});
$(document).ready(function(){
    $("#rules-click").click(function(){
        $("#myModal").modal();
    });
    $("#week-leaderboard").click(function(){
        $("#weekly-winner").modal(); 
    });
    $("#alltime-leaderboard").click(function(){
        $("#alltime-winner").modal();
    });
});