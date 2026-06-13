function goSetup(){
window.location.href="setup.html"
}

function previewPhoto(event){

let file=event.target.files[0]

if(!file)return

let reader=new FileReader()

reader.onload=function(e){

let box=document.getElementById("photoPreview")

box.innerHTML=""

let img=document.createElement("img")

img.src=e.target.result

box.appendChild(img)

localStorage.setItem("profilePic",e.target.result)

}

reader.readAsDataURL(file)

}

function finishSetup(){

let name=document.getElementById("username").value

localStorage.setItem("username",name)

window.location.href="home.html"

}

function editProfile(){

let name=document.getElementById("profileName").value
let bio=document.getElementById("profileBio").value

localStorage.setItem("username",name)
localStorage.setItem("bio",bio)

}

window.onload=function(){

if(document.getElementById("profileName")){

document.getElementById("profileName").value=localStorage.getItem("username")||""

document.getElementById("profileBio").value=localStorage.getItem("bio")||""

document.getElementById("profileImage").src=localStorage.getItem("profilePic")

}

}

function publishPoll(){

let question=document.getElementById("pollQuestion").value

let color=document.getElementById("pollColor").value

let multiple=document.getElementById("multipleChoice").checked

let poll={question,color,multiple}

let polls=JSON.parse(localStorage.getItem("polls"))||[]

polls.push(poll)

localStorage.setItem("polls",JSON.stringify(polls))

window.location.href="home.html"

}
