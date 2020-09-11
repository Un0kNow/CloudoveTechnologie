(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top - 56)
                }, 1000, "easeInOutExpo");
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
        target: '#mainNav',
        offset: 56
    });

})(jQuery); // End of use strict

function toggleResetPswd(e) {
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

function toggleSignUp(e) {
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

$(() => {
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
});

function googleUp() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        window.location = '/Cloudove/public//index.html';

        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function signUp() {
    let em = $('#user-email').val();
    let pas = $('#user-pass').val();

    firebase.auth().createUserWithEmailAndPassword(em, pas).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        console.log(error);
        let errorMessage = error.message;
    });
}

function logIn() {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
    });
}

let fl;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

let res = '';


// $('#sendBtn').click((e) => {
function generateResults() {
    fl = $('#input-fas')[0].files[0];
    console.log("pica");

    if ($('#input-fas')[0].files.length !== 0) {

        getBase64(fl).then((data) => {
            console.log(data);
            axios.post('http://localhost:3000/image', {name: fl.name, base: data})
                .then(function (response) {
                    res = response;
                    $("#imageLabels").empty();
                    $("#similarImages").empty();
                    $("#imageObjects").empty();
                    $("#res-img").empty();
                    $('#res-img').append('<img width="260" height="260" id="res-img" src="' + data + '">');

                    for (let i = 0; i < res.data[0].labelAnnotations.length; i++) {
                        $("#imageLabels").append(
                            `<div class="row"><div class="col-4">` +
                            `<a target="_blank" title="Search for ${res.data[0].labelAnnotations[i].description} on Google" href="https://www.google.com/search?q=${res.data[0].labelAnnotations[i].description}">${res.data[0].labelAnnotations[i].description}` +
                            `<p class="card-text d-flex justify-content-start">` +
                            `</p></a></div>` +
                            `<div class="col-6"><div class="progress"> <div class="progress-bar" role="progressbar" style="width: ${res.data[0].labelAnnotations[i].score.toFixed(2) * 100}%" aria-valuenow="${res.data[0].labelAnnotations[i].score.toFixed(2) * 100}" aria-valuemin="0" aria-valuemax="100"></div> </div></div>` +
                            `<div class="col-2">${(res.data[0].labelAnnotations[i].score * 100).toFixed(0)}%</div>` +
                            `</div>`);
                    }

                    // res.data[0].localizedObjectAnnotations.forEach(data => {
                    //
                    // });

                    for (let i = 0; i < res.data[0].localizedObjectAnnotations.length; i++) {
                        $("#imageObjects").append(
                            `<div class="row"><div class="col-4">` +
                            `<p class="card-text d-flex justify-content-start">${res.data[0].localizedObjectAnnotations[i].name}` +
                            `</p></div>` +
                            `<div class="col-6"><div class="progress"> <div class="progress-bar" role="progressbar" style="width: ${res.data[0].localizedObjectAnnotations[i].score.toFixed(2) * 100}%" aria-valuenow="${res.data[0].localizedObjectAnnotations[i].score.toFixed(2) * 100}" aria-valuemin="0" aria-valuemax="100"></div> </div></div>` +
                            `<div class="col-2">${(res.data[0].localizedObjectAnnotations[i].score * 100).toFixed(0)}%</div>` +
                            `</div>`);
                    }

                    // <img class="pr-3" height="200" src=""
                    res.data[0].webDetection.visuallySimilarImages.forEach((res) => {
                        $('#similarImages').append(`<img class="col-3 pb-3"  src="${res.url}">`);
                    });


                    // console.log(response);
                    alert("Posted");
                    $("#card1").css("display", "");
                    $("#card2").css("display", "");
                    $("#card3").css("display", "");
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
// });
}

//Login section

$(document).ready(function () {
    history();
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Logged In");
            $('#history').css('display', "");
            $('#logOut').css('display', "");
        } else {
            console.log("Logged Out");
            $('#history').css('display', "none");
            $('#logOut').css('display', "none");
        }
    });
});

function logOut() {
    firebase.auth().signOut()
        .then(function () {

        })
        .catch(function (error) {
            console.log("error: ", error.message);
        });
}

let histData = [];

function history() {
    axios.get("http://localhost:3000/history").then(dt => {
        Object.keys(dt.data).map((key, index) => {
            histData.push(dt.data[key]);
            // console.log(dt.data[key])
        });
        console.log(histData);

        for (let i = 0; i < histData.length ; i++) {
            // console.log(histData[i].labels.data);
            let label = [];
            let object = [];
            let similarImage = [];
            Object.keys(histData[i].labels.data).map(function (key) {
                label.push(histData[i].labels.data[key]);
            });
            if (histData[i].hasOwnProperty('object')) {
                Object.keys(histData[i].objects.data).map(function (key) {
                    object.push(histData[i].objects.data[key]);
                });
                histData[i].objects = object;
            }

            Object.keys(histData[i].similarImages.data).map(function (key) {
                similarImage.push(histData[i].similarImages.data[key]);
            });

            histData[i].labels = label;
            histData[i].similarImages = similarImage;
        }

        let i = 0;
        histData.forEach(data => {
            $('#histList').append(` <a href="#" id="img-${i}" onclick="showResults(${i})" class="list-group-item list-group-item-action"><img height="100" src="data:image/png;base64,${data.image.base}"></a>`)
            i++;
        });
    });
}

function showResults(id) {
    console.log(id);
    $("#imageLabels").empty();
    $("#similarImages").empty();
    $("#imageObjects").empty();
    $("#res-img").empty();
    $('#res-img').append(`<img width="260" height="260" id="res-img" src="data:image/png;base64,${histData[id].image.base}">`);

    for (let i = 0; i < histData[id].labels.length; i++) {
        $("#imageLabels").append(
            `<div class="row"><div class="col-4">` +
            `<a target="_blank" title="Search for ${histData[id].labels[i].description} on Google" href="https://www.google.com/search?q=${histData[id].labels[i].description}">${histData[id].labels[i].description}` +
            `<p class="card-text d-flex justify-content-start">` +
            `</p></a></div>` +
            `<div class="col-6"><div class="progress"><div class="progress-bar" role="progressbar" style="width: ${histData[id].labels[i].score.toFixed(2) * 100}%" aria-valuenow="${histData[id].labels[i].score.toFixed(2) * 100}" aria-valuemin="0" aria-valuemax="100"></div> </div></div>` +
            `<div class="col-2">${(histData[id].labels[i].score * 100).toFixed(0)}%</div>` +
            `</div>`);
    }

    // if (histData[id].hasOwnProperty('object')) {
    //     for (let i = 0; i < histData[id].objects.length; i++) {
    //         let dat = histData[id].objects[i];
    //         $("#imageObjects").append(
    //             `<div class="row"><div class="col-4">` +
    //             `<p class="card-text d-flex justify-content-start">${dat.name}` +
    //             `</p></div>` +
    //             `<div class="col-6"><div class="progress"> <div class="progress-bar" role="progressbar" style="width: ${dat.score.toFixed(2) * 100}%" aria-valuenow="${dat.score.toFixed(2) * 100}" aria-valuemin="0" aria-valuemax="100"></div> </div></div>` +
    //             `<div class="col-2">${(dat.score * 100).toFixed(0)}%</div>` +
    //             `</div>`);
    //     }
    // }

    for (let i = 0; i < histData[id].similarImages.length; i++) {
        var dat = histData[id].similarImages[i];
        $('#similarImages').append(`<img class="col-3 pb-3"  src="${dat.url}">`);
    }

    if ($("#imageLabels")[0].hasChildNodes())  $("#card1").css("display", "");
    if ($("#imageObjects")[0].hasChildNodes())  $("#card2").css("display", "");
    if ($("#similarImages")[0].hasChildNodes()) $("#card3").css("display", "");
}

// set GOOGLE_APPLICATION_CREDENTIALS="C:/Users/Palko/CloudoveTechnologie-master/CloudoveTechnologie-1f541530ffe2.json"
