import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCD3LROM6mRR5TtSuwLKGpU2MYqRN3ePS8",
    authDomain: "pollitwix.firebaseapp.com",
    projectId: "pollitwix",
    storageBucket: "pollitwix.firebasestorage.app",
    messagingSenderId: "141736075948",
    appId: "1:141736075948:web:8be997a4007da4c9c97509",
    measurementId: "G-TEW20XMVTJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =========================
   AUTHENTIFICATION
========================= */

async function loginGoogle() {

    try {

        const result =
            await signInWithPopup(auth, provider);

        console.log(
            "Connecté :",
            result.user.displayName
        );

        window.location.href = "home.html";

    } catch (error) {

        console.error(error);
        alert(error.message);
    }
}

async function registerEmail() {

    const email =
        document.getElementById("email")?.value;

    const password =
        document.getElementById("password")?.value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Compte créé !");

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);
    }
}

async function loginEmail() {

    const email =
        document.getElementById("email")?.value;

    const password =
        document.getElementById("password")?.value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);
    }
}

async function logout() {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);
    }
}

/* =========================
   PROFIL
========================= */

function goSetup() {

    window.location.href = "setup.html";
}

function previewPhoto(event) {

    let file = event.target.files[0];

    if (!file) return;

    let reader = new FileReader();

    reader.onload = function (e) {

        let box =
            document.getElementById("photoPreview");

        if (!box) return;

        box.innerHTML = "";

        let img =
            document.createElement("img");

        img.src = e.target.result;

        box.appendChild(img);

        localStorage.setItem(
            "profilePic",
            e.target.result
        );
    };

    reader.readAsDataURL(file);
}

function finishSetup() {

    let name =
        document.getElementById("username")?.value;

    localStorage.setItem(
        "username",
        name
    );

    window.location.href = "home.html";
}

function editProfile() {

    let name =
        document.getElementById("profileName")?.value;

    let bio =
        document.getElementById("profileBio")?.value;

    localStorage.setItem(
        "username",
        name
    );

    localStorage.setItem(
        "bio",
        bio
    );

    alert("Profil enregistré !");
}

/* =========================
   SONDAGES
========================= */

function publishPoll() {

    const question =
        document.getElementById("pollQuestion").value;

    const color =
        document.getElementById("pollColor").value;

    const multiple =
        document.getElementById("multipleChoice").checked;

    const answerInputs =
        document.querySelectorAll(".answerInput");

    const answers = [];

    answerInputs.forEach(input => {

        if(input.value.trim() !== ""){

            answers.push({
                text: input.value,
                votes: 0
            });

        }

    });

    if(question.trim() === ""){

        alert("Écris une question");

        return;
    }

    if(answers.length < 2){

        alert("Ajoute au moins 2 réponses");

        return;
    }

    const poll = {

        question: question,

        color: color,

        multiple: multiple,

        answers: answers

    };

    let polls =
        JSON.parse(localStorage.getItem("polls")) || [];

    polls.push(poll);

    localStorage.setItem(
        "polls",
        JSON.stringify(polls)
    );

    window.location.href = "home.html";
}

function deletePoll(index) {

    let polls =
        JSON.parse(
            localStorage.getItem("polls")
        ) || [];

    polls.splice(index, 1);

    localStorage.setItem(
        "polls",
        JSON.stringify(polls)
    );

    location.reload();
}

/* =========================
   CHARGEMENT
========================= */

window.addEventListener("load", () => {

    if (
        document.getElementById("profileName")
    ) {

        document.getElementById(
            "profileName"
        ).value =
            localStorage.getItem(
                "username"
            ) || "";

        document.getElementById(
            "profileBio"
        ).value =
            localStorage.getItem(
                "bio"
            ) || "";

        let img =
            document.getElementById(
                "profileImage"
            );

        if (img) {

            img.src =
                localStorage.getItem(
                    "profilePic"
                ) || "";
        }
    }

    let container =
        document.getElementById(
            "pollContainer"
        );

    if (container) {

        let polls =
            JSON.parse(
                localStorage.getItem(
                    "polls"
                )
            ) || [];

        polls.forEach(function (poll, index) {

    let card = document.createElement("div");

    card.className = "pollCard";

    card.style.backgroundColor = poll.color;

    let answersHTML = "";

    if (poll.answers) {

        poll.answers.forEach((answer, answerIndex) => {

            answersHTML += `
                <div style="margin:10px 0;">
                    <button onclick="vote(${index},${answerIndex})">
                        ${answer.text}
                    </button>
                    <span id="result-${index}-${answerIndex}">
                        ${answer.votes || 0} vote(s)
                    </span>
                </div>
            `;

        });

    }

    card.innerHTML = `
        <h3>${poll.question}</h3>

        ${answersHTML}

        <br>

        <button onclick="deletePoll(${index})">
            🗑️ Supprimer
        </button>
    `;

    container.appendChild(card);

});
function vote(pollIndex, answerIndex) {

    let polls =
        JSON.parse(localStorage.getItem("polls")) || [];

    polls[pollIndex].answers[answerIndex].votes++;

    localStorage.setItem(
        "polls",
        JSON.stringify(polls)
    );

    location.reload();
}

window.vote = vote;

/* =========================
   PROTECTION DES PAGES
========================= */

onAuthStateChanged(auth, (user) => {

    const page =
        window.location.pathname
            .split("/")
            .pop();

    if (
        !user &&
        page !== "login.html" &&
        page !== "index.html"
    ) {

        window.location.href =
            "login.html";
    }
});
function addAnswer() {

    const container =
        document.getElementById("answersContainer");

    const count =
        container.querySelectorAll(".answerInput").length + 1;

    const input =
        document.createElement("input");

    input.className = "answerInput";

    input.placeholder = "Réponse " + count;

    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(input);
}

window.addAnswer = addAnswer;

/* =========================
   EXPOSER AU HTML
========================= */

window.loginGoogle = loginGoogle;
window.loginEmail = loginEmail;
window.registerEmail = registerEmail;
window.logout = logout;

window.goSetup = goSetup;
window.previewPhoto = previewPhoto;
window.finishSetup = finishSetup;
window.editProfile = editProfile;

window.publishPoll = publishPoll;
window.deletePoll = deletePoll;
