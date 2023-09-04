class Pet {
  constructor(name) {
    this.name = name;
  }

  speak(outputCb) {
    (typeof outputCb !== 'undefined' ? outputCb : console.log)(`My name is ${this.name}`);
  }
}

class Dog extends Pet {
  speak(outputCb) {
    (typeof outputCb !== 'undefined' ? outputCb : console.log)(`My name is ${this.name} and I woof-woof`);
  }
}

class Cat extends Pet {
  speak(outputCb) {
    (typeof outputCb !== 'undefined' ? outputCb : console.log)(`My name is ${this.name} and I meow`);
  }
}