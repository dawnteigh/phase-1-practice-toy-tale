let addToy = false;
const toyBox = document.getElementById('toy-collection')
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const likeBtn = document.getElementsByClassName("like-btn");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  toyFormContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    newToy(e.target.name.value, e.target.image.value)
    e.target.reset();
  })
});
//GET toys from database
function getToys() {
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toyData => toyData.forEach(toy => createToyCard(toy)))
}
getToys()
//Callback for adding toys to the DOM
function createToyCard(toy) {
  let card = document.createElement('div')
  card.innerHTML = `<div class="card">
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
    <button class="dlt-btn" id="${toy.id}">Put Away</button>
    </div>`
  toyBox.append(card)
}
//Callback for the submit event, POSTS new toys to the database
function newToy(name, url) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },

    body: JSON.stringify({
      "name": name,
      "image": url,
      "likes": 0
    })
  })
    .then(res => res.json())
    .then(toyData => createToyCard(toyData))
}
//Listener to PATCH the new likes, and DELETE functionality for good measure
toyBox.addEventListener('click', (e) => {
  if (e.target.className === "like-btn") {
    let currentLikes = parseInt(e.target.previousElementSibling.innerText)
    let updatedLikes = currentLikes + 1;
    e.target.previousElementSibling.innerText = updatedLikes + " Likes"

    fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": updatedLikes
      })
    })
  }
  if (e.target.className === "dlt-btn") {
    fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: "DELETE"
    })
      .then(res => {
        e.target.parentElement.remove()
      })
  }
})
