// --------------- TEMEL DEĞERLER ---------------
let karma = 0;
let kps = 1;

const habitats = [
  { name: "Kümes", price: 1000, image: "img/habitats/coop.png", level: 0 },
  { name: "Çatı", price: 10000, image: "img/habitats/roof.png", level: 0 },
  { name: "Gölet", price: 50000, image: "img/habitats/lake.png", level: 0 },
  { name: "Kara Orman", price: 120000, image: "img/habitats/nightforest.png", level: 0 },
  { name: "Tropikal", price: 500000, image: "img/habitats/tropical.png", level: 0 },
  { name: "Dağ", price: 1400000, image: "img/habitats/mountain.png", level: 0 }
];

const animals = {
  tavuk: { price: 10, kps: 1, quantity: 0, image: "img/animal/chicken.png" },
  güvercin: { price: 50, kps: 5, quantity: 0, image: "img/animal/pigeon.png" },
  ördek: { price: 200, kps: 20, quantity: 0, image: "img/animal/duck.png" },
  baykuş: { price: 1000, kps: 100, quantity: 0, image: "img/animal/owl.png" },
  papağan: { price: 5000, kps: 500, quantity: 0, image: "img/animal/parrot.png" },
  phoenix: { price: 25000, kps: 2500, quantity: 0, image: "img/animal/phoenix.png" }
};

// --------------- HABİTAT ---------------
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
    
    if (animals[habitat.name.toLowerCase()]) {
      animals[habitat.name.toLowerCase()].kps *= 1.10;
    }
    
    updateKPS();
    updateStats();
    updateHabitatUI();
    updateStoreItemUI();
  }
}

function updateHabitatUI() {
  document.querySelector(".habitats").innerHTML = "";
  habitats.forEach(createHabitat);
}

// --------------- MAĞAZA ---------------
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

  const kpsElement = document.createElement("div");
  kpsElement.className = "kps";
  kpsElement.textContent = `${formatNumber(item.kps)} KPS`;

  const quantity = document.createElement("div");
  quantity.className = "quantity";
  quantity.textContent = item.quantity;

  info.appendChild(name);
  info.appendChild(price);
  info.appendChild(kpsElement);

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
    item.kps *= 1.07;

    updateStats();
    updateStoreItemUI();
  } 
}

function updateStoreItemUI() {
  document.querySelector(".shop").innerHTML = "";
  Object.keys(animals).forEach(createStoreItem);
}

// --------------- GÜNCELLEME FONKSİYONLARI ---------------
function updateStats() {
  document.querySelector(".karma").textContent = `🔷${formatNumber(karma)}`;
  document.querySelector(".kps-text").textContent = `KPS: ${formatNumber(kps)}`;
}

function updateKPS() {
  kps = Object.values(animals).reduce((sum, animal) => sum + animal.kps * animal.quantity, 0);
}

// --------------- SAYI KISALTMA ---------------
function formatNumber(num) {
  const thresholds = [
    { value: 1e30, symbol: " No" },
    { value: 1e27, symbol: " Oc" },
    { value: 1e24, symbol: " Sp" },
    { value: 1e21, symbol: " Sx" },
    { value: 1e18, symbol: " Qi" },
    { value: 1e15, symbol: " Qa" },
    { value: 1e12, symbol: " T"  },
    { value: 1e9,  symbol: " B"  },
    { value: 1e6,  symbol: " M"  },
    { value: 1e3,  symbol: " K"  }
  ];
  if (num < 1e3) return num.toFixed(2);
  for (let i = 0; i < thresholds.length; i++) {
    if (num >= thresholds[i].value) {
      return (num / thresholds[i].value).toFixed(2) + thresholds[i].symbol;
    }
  }
}

// --------------- OYUN BAŞLATMA ---------------
habitats.forEach(createHabitat);
Object.keys(animals).forEach(createStoreItem);
updateStats();
setInterval(() => {
  karma += kps;
  updateStats();
}, 1000);
