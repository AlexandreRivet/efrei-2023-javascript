function speakToDom(str) {
  document.body.innerHTML += str + '<br>';
}

const pet = new Pet('pet');
const dog = new Dog('dog');
const cat = new Cat('cat');
[pet, dog, cat].forEach((currentPet) => currentPet.speak(speakToDom));