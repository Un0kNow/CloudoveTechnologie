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


function signUp() {
    let em = $('#user-email').val();
    let pas = $('#user-pass').val();

    firebase.auth().createUserWithEmailAndPassword(em, pas).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
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

// $( "#imgRec" ).submit(function( event ) {
//     fl = $('#input-fas')[0].files[0];
//     getBase64(fl).then((data) => {
//         axios.post('http://localhost:3000/image', {name: fl.name ,base: data})
//             .then(function (response) {
//                 console.log(response);
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     });
// });


let res = '';

function postImage() {
    fl = $('#input-fas')[0].files[0];

    // let card = '<div class="col-6">\n' +
    //     '<div class="card text-center">\n' +
    //     '<div class="card-body">\n' +
    //     '<h5 class="card-title">Special title treatment</h5>\n' +
    //     '<p class="card-text"></p>\n' +
    //     '</div>\n </div>\n </div>';

    if ($('#input-fas')[0].files.length !== 0) {

        getBase64(fl).then((data) => {
            console.log(data);
            axios.post('http://localhost:3000/image', {name: fl.name, base: data})
                .then(function (response) {
                    res = response;
                    $('#res-img').append('<img width="260" height="260" id="res-img" src="' + data + '">');
                    for (let i = 0; i < res.data[0].labelAnnotations.length; i++) {
                        $("#imageLabels").append(
                            `<div class="row"><div class="col-4">` +
                            `<a target="_blank" title="Search for ${res.data[0].labelAnnotations[i].description} on Google" href="https://www.google.com/search?q=${res.data[0].labelAnnotations[i].description}">${res.data[0].labelAnnotations[i].description}` +
                            `<p class="card-text d-flex justify-content-start">`+
                            `</p></a></div>`+
                            `<div class="col-6"><div class="progress"> <div class="progress-bar" role="progressbar" style="width: ${res.data[0].labelAnnotations[i].score.toFixed(2)*100}%" aria-valuenow="${res.data[0].labelAnnotations[i].score.toFixed(2)*100}" aria-valuemin="0" aria-valuemax="100"></div> </div></div>` +
                            `<div class="col-2">${(res.data[0].labelAnnotations[i].score*100).toFixed(0)}%</div>`+
                            `</div>`);
                    }

                    // <img class="pr-3" height="200" src=""
                    res.data[0].webDetection.visuallySimilarImages.forEach((res) => {
                        $('#similarImages').append(`<img class="col-3 pb-3"  src="${res.url}">`);
                    });


                    console.log(response);
                    alert("Posted")
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
}
