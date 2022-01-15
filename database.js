function coonectdatabase() {
    
    var admin = require("firebase-admin");

    var serviceAccount = require("./apikey.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://snipingbot-b8435-default-rtdb.firebaseio.com"
    });

    return admin
}

function checktoken(token, fn) {
    
    var databaseconn = coonectdatabase();

    let db = databaseconn.database().ref();
    let usersRef = db.child("tokens");

    usersRef.orderByChild('token').equalTo(token).once("value", function myfunction(snapshot) {

        if (snapshot.val() == null) {
            console.log("ITS null");
            fn(false);
        } else {
            console.log("ITS NOT");
            fn(true);
        }
    });
}

module.exports = {
    checktoken
}

