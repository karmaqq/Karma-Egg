// --------------- TEMEL DEĞERLER ---------------
let karma = 0;
let kps = 1;

const habitats = [
  { name: "Kümes", price: 100, image: "img/habitats/coop.png", level: 0 },
  { name: "Çatı", price: 500, image: "img/habitats/roof.png", level: 0 },
  { name: "Gölet", price: 2000, image: "img/habitats/lake.png", level: 0 },
  { name: "Kara Orman", price: 10000, image: "img/habitats/nightforest.png", level: 0 },
  { name: "Tropikal", price: 50000, image: "img/habitats/tropical.png", level: 0 },
  { name: "Dağ", price: 250000, image: "img/habitats/mountain.png", level: 0 }
];

const animals = {
  tavuk: { price: 1, kps: 1, quantity: 0, image: "img/animal/chicken.png", sound: "sounds/chicken.mp3" },
  güvercin: { price: 40, kps: 2, quantity: 0, image: "img/animal/pigeon.png", sound: "sounds/pigeon.mp3" },
  ördek: { price: 160, kps: 4, quantity: 0, image: "img/animal/duck.png", sound: "sounds/duck.mp3" },
  baykuş: { price: 650, kps: 8, quantity: 0, image: "img/animal/owl.png", sound: "sounds/owl.mp3" },
  papağan: { price: 10500, kps: 52, quantity: 0, image: "img/animal/parrot.png", sound: "sounds/parrot.mp3" },
  phoenix: { price: 42000, kps: 100, quantity: 0, image: "img/animal/phoenix.png", sound: "sounds/phoenix.mp3" }
};

// --------------- YUMURTA TIKLAMA ---------------
function createEgg() {
  const eggElement = document.querySelector(".egg-box");
  eggElement.onclick = () => addKarma();  // Yumurtaya tıklanıldığında karma ekle
}

// --------------- KARMA ARTIRMA ---------------
function addKarma() {
  karma += 1;  // Her tıklamada 1 karma eklenir
  updateStats();  // İstatistikleri güncelle
}

// --------------- HABİTAT YÜKSELTME ---------------
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

    // Ses dosyasını çal
    const audio = new Audio(item.sound);
    audio.play();

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

  if (num < 1e3) return Number.isInteger(num) ? num.toString() : num.toFixed(2);

  for (let i = 0; i < thresholds.length; i++) {
    if (num >= thresholds[i].value) {
      const formattedNumber = (num / thresholds[i].value).toFixed(2);
      return (formattedNumber.endsWith('.00')) 
        ? formattedNumber.split('.00')[0] + thresholds[i].symbol 
        : formattedNumber + thresholds[i].symbol;
    }
  }
}

// --------------- OYUN BAŞLATMA ---------------
createEgg();  // Yumurtayı tıklanabilir yap
habitats.forEach(createHabitat); // Habitatları oluştur
Object.keys(animals).forEach(createStoreItem); // Mağaza öğelerini oluştur
updateStats();  // İstatistikleri güncelle
setInterval(() => {
  karma += kps;  // KPS her saniye karma ekler
  updateStats();  // İstatistikleri güncelle
}, 1000);
