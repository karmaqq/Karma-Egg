let karma = 100;
let kps = 0.50;
let eggMultiplier = 1.0;

const habitats = [
  { name: "Kümes", price: 1000, image: "img/habitats/coop.png", level: 0 },
  { name: "Çatı", price: 10000, image: "img/habitats/roof.png", level: 0 },
  { name: "Gölet", price: 50000, image: "img/habitats/lake.png", level: 0 },
  { name: "Kara Orman", price: 120000, image: "img/habitats/nightforest.png", level: 0 },
  { name: "Tropikal", price: 500000, image: "img/habitats/tropical.png", level: 0 },
  { name: "Dağ", price: 1400000, image: "img/habitats/mountain.png", level: 0 }
];

const animals = {
  chicken: { price: 15, kps: 0.10, quantity: 0, image: "img/animal/chicken.png" },
  pigeon: { price: 100, kps: 1.00, quantity: 0, image: "img/animal/pigeon.png" },
  duck: { price: 1100, kps: 5.00, quantity: 0, image: "img/animal/duck.png" },
  owl: { price: 12000, kps: 10.00, quantity: 0, image: "img/animal/owl.png" },
  parrot: { price: 130000, kps: 50.00, quantity: 0, image: "img/animal/parrot.png" },
  phoenix: { price: 1400000, kps: 100.00, quantity: 0, image: "img/animal/phoenix.png" }
};

function formatNumber(num) {
  if (num < 1e3) return num.toFixed(2);
  if (num < 1e6) return (num / 1e3).toFixed(2) + " K";
  if (num < 1e9) return (num / 1e6).toFixed(2) + " M";
  if (num < 1e12) return (num / 1e9).toFixed(2) + " B";
  return (num / 1e12).toFixed(2) + " T";
}

function updateStats() {
  document.querySelector(".karma").textContent = `🔷${karma.toFixed(2)}`;
  document.querySelector(".kps-text").textContent = `KPS: ${kps.toFixed(2)}`;
}

function createHabitat(habitat) {
  const habitatElement = document.createElement("div");
  habitatElement.className = "habitat";

  const img = document.createElement("img");
  img.src = habitat.image;
  img.alt = habitat.name;

  const info = document.createElement("div");
  info.className = "habitat-info";

  const text = document.createElement("div");
  text.textContent = `${habitat.name}: Seviye ${habitat.level}`;

  const button = document.createElement("button");
  button.textContent = `🔷${formatNumber(habitat.price)} Yükselt`;
  button.onclick = () => upgradeHabitat(habitat);

  info.appendChild(text);
  info.appendChild(button);
  habitatElement.appendChild(img);
  habitatElement.appendChild(info);
  
  document.querySelector(".habitats").appendChild(habitatElement);
}

function upgradeHabitat(habitat) {
  if (karma >= habitat.price) {
    karma -= habitat.price;
    habitat.level += 1;
    habitat.price *= 1.10; 
    updateStats();
    updateHabitatUI();
  } else {
    alert("Yetersiz Karma!");
  }
}

function updateHabitatUI() {
  document.querySelector(".habitats").innerHTML = "";
  habitats.forEach(createHabitat);
}

function createStoreItem(animal) {
  const item = animals[animal];
  const itemElement = document.createElement("div");
  itemElement.className = "store-item";
  itemElement.onclick = () => buyItem(animal);

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = animal;

  const info = document.createElement("div");
  info.className = "item-info";

  const name = document.createElement("div");
  name.className = "product-name";
  name.textContent = animal.charAt(0).toUpperCase() + animal.slice(1);

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = `🔷${formatNumber(item.price)}`;

  const kps = document.createElement("div");
  kps.className = "kps";
  kps.textContent = `${formatNumber(item.kps)} KPS`;

  const quantity = document.createElement("div");
  quantity.className = "quantity";
  quantity.textContent = item.quantity;

  info.appendChild(name);
  info.appendChild(price);
  info.appendChild(kps);

  itemElement.appendChild(img);
  itemElement.appendChild(info);
  itemElement.appendChild(quantity);

  document.querySelector(".shop").appendChild(itemElement);
}

function buyItem(animal) {
  const item = animals[animal];
  if (karma >= item.price) {
    karma -= item.price;
    item.quantity += 1;
    kps += item.kps;

    item.price *= 1.15;
    item.kps *= 1.10;

    updateStats();
    updateStoreItemUI();
  } else {
    alert("Yetersiz Karma!");
  }
}

function updateStoreItemUI() {
  document.querySelector(".shop").innerHTML = "";
  Object.keys(animals).forEach(createStoreItem);
}

setInterval(() => {
  karma += kps;
  updateStats();
}, 1000);

document.querySelector('.egg-box').addEventListener('click', () => {
  karma += 0.1 * eggMultiplier;
  eggMultiplier += 0.7;
  updateStats();
});

habitats.forEach(createHabitat);
Object.keys(animals).forEach(createStoreItem);
updateStats();
