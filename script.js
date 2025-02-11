// --------------- TEMEL DEĞERLER ---------------
let karma = 1000;
let kps = 1;

// --------------- HABİTATLAR ---------------
const habitats = [
  { name: "Kümes", price: 100, image: "img/habitats/coop.png", level: 0, boosts: ["tavuk"] },
  { name: "Çatı", price: 500, image: "img/habitats/roof.png", level: 0, boosts: ["güvercin"] },
  { name: "Gölet", price: 2000, image: "img/habitats/lake.png", level: 0, boosts: ["ördek"] },
  { name: "Kara Orman", price: 10000, image: "img/habitats/nightforest.png", level: 0, boosts: ["baykuş"] },
  { name: "Tropikal", price: 50000, image: "img/habitats/tropical.png", level: 0, boosts: ["papağan"] },
  { name: "Dağ", price: 250000, image: "img/habitats/mountain.png", level: 0, boosts: ["phoenix"] }
];

// --------------- HAYVANLAR ---------------
const animals = {
  tavuk: { price: 1, kps: 1, quantity: 0, image: "img/animal/chicken.png", sound: "sounds/chicken.mp3" },
  güvercin: { price: 40, kps: 2, quantity: 0, image: "img/animal/pigeon.png", sound: "sounds/pigeon.mp3" },
  ördek: { price: 160, kps: 4, quantity: 0, image: "img/animal/duck.png", sound: "sounds/duck.mp3" },
  baykuş: { price: 650, kps: 8, quantity: 0, image: "img/animal/owl.png", sound: "sounds/owl.mp3" },
  papağan: { price: 10500, kps: 52, quantity: 0, image: "img/animal/parrot.png", sound: "sounds/parrot.mp3" },
  phoenix: { price: 42000, kps: 100, quantity: 0, image: "img/animal/phoenix.png", sound: "sounds/phoenix.mp3" }
};

// --------------- KPS GÜNCELLEME ---------------
function updateKPS() {
  let totalKPS = Object.keys(animals).reduce((sum, animal) => {
    let baseKPS = animals[animal].kps * animals[animal].quantity;
    let bonusMultiplier = animals[animal].bonus || 1;
    return sum + baseKPS * bonusMultiplier;
  }, 0);

  kps = totalKPS;
  updateStats();
  updateAnimalContribution();  // Burada da barı güncelliyoruz
}

// --------------- STAT GÜNCELLEME ---------------
function updateStats() {
  document.querySelector(".karma").textContent = `🪷${formatNumber(karma)}`;
  document.querySelector(".kps-text").textContent = `⚡${formatNumber(kps)}`;
}


// --------------- YUMURTA TIKLAMA ---------------
function createEgg() {
  document.querySelector(".egg-box").onclick = () => addKarma();
}

function addKarma() {
  karma += 1;
  updateStats();
}

// --------------- KPS BAR ---------------
// Hayvanların KPS katkılarını yüzdelik olarak hesapla
function updateAnimalContribution() {
  const totalKPS = kps;
  let totalContribution = 0;
  let contributionText = "Hayvan Katkısı: ";
  
  // Renkler listesi, her hayvana farklı renk atayacağız
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F4FF33", "#33FFF5"];

  // Hayvanları sıralamak için sıralama kuralları
  const fixedOrder = ["tavuk", "güvercin", "ördek", "baykuş", "papağan", "phoenix"];

  // Katkı metnini temizle ve barı sıfırla
  const contributionBar = document.querySelector(".contribution-bar");
  contributionBar.innerHTML = '';  // Önceki barları temizle
  contributionText = "Hayvan Katkısı: "; // Metni sıfırla
  
  // Hayvanları sıralı olarak geç
  fixedOrder.forEach((animal, index) => {
    if (animals[animal]) {
      const animalItem = animals[animal];
      const animalKPS = animalItem.kps * animalItem.quantity * (animalItem.bonus || 1);
      const percentage = (animalKPS / totalKPS) * 100;

      if (percentage > 0) {
        contributionText += `${animal.charAt(0).toUpperCase() + animal.slice(1)}: ${percentage.toFixed(2)}% `;

        // Katkı yüzdesine göre barı güncelle
        const contributionElement = document.createElement("div");
        contributionElement.style.width = `${percentage}%`;
        contributionElement.style.backgroundColor = colors[index] || "#D3D3D3"; // Her hayvan için farklı renk
        contributionElement.className = "animal-contribution";

        contributionBar.appendChild(contributionElement);
        totalContribution += percentage;
      }
    }
  });

  // Katkı metnini güncelle
  const contributionTextElement = document.querySelector(".contribution-text");
  contributionTextElement.textContent = contributionText;
}


// --------------- HABİTAT OLUŞTURMA ---------------
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
  button.textContent = `💲${formatNumber(habitat.price)} Yükselt`;
  button.onclick = () => upgradeHabitat(habitat);

  info.appendChild(text);
  info.appendChild(button);
  habitatElement.appendChild(img);
  habitatElement.appendChild(info);

  document.querySelector(".habitats").appendChild(habitatElement);
}

// --------------- HABİTAT YÜKSELTME ---------------
function upgradeHabitat(habitat) {
  if (karma >= habitat.price) {
    karma -= habitat.price;
    habitat.level += 1;
    habitat.price *= 1.10;

    habitat.boosts.forEach(hayvan => {
      if (animals[hayvan]) {
        animals[hayvan].bonus = 1 + habitat.level * 0.20; // 🟢 Bonusları ayrı değişkende tutuyoruz
      }
    });

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

  // 🟢 Habitat bonuslarını uygula
  let bonusMultiplier = item.bonus || 1;
  let totalKPS = item.kps * item.quantity * bonusMultiplier;

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
  price.textContent = `💲${formatNumber(item.price)}`;

  // 🟢 Anlık KPS Kazancı
  const kpsGain = document.createElement("div");
  kpsGain.className = "kps-gain";
  kpsGain.textContent = `✨${formatNumber(item.kps)}`;

  // 🟢 Toplam KPS Katkısı (Habitat bonusları dahil)
  const totalKpsElement = document.createElement("div");
  totalKpsElement.className = "total-kps";
  totalKpsElement.textContent = `⚡${formatNumber(totalKPS)}`;

  const quantity = document.createElement("div");
  quantity.className = "quantity";
  quantity.textContent = `x${item.quantity}`;

  info.appendChild(name);
  info.appendChild(price);
  info.appendChild(kpsGain);
  info.appendChild(totalKpsElement);

  itemElement.appendChild(img);
  itemElement.appendChild(info);
  itemElement.appendChild(quantity);

  document.querySelector(".shop").appendChild(itemElement);
}

// --------------- HAYVAN SATIN ALMA ---------------

function buyItem(animal) {
  const item = animals[animal];

  if (karma >= item.price) {
    karma -= item.price;
    item.quantity += 1;

    let bonusMultiplier = item.bonus || 1;
    kps += item.kps * bonusMultiplier;

    item.price *= 1.15;
    item.kps *= 1.07;

    new Audio(item.sound).play();

    updateKPS();
    updateStoreItemUI();
    updateStats();
  }
}

function updateStoreItemUI() {
  document.querySelector(".shop").innerHTML = "";
  Object.keys(animals).forEach(createStoreItem);
}

// --------------- SAYI FORMATLAMA ---------------
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
createEgg();
habitats.forEach(createHabitat);
Object.keys(animals).forEach(createStoreItem);
updateStats();
updateAnimalContribution();


setInterval(() => {
  karma += kps;
  updateStats();
}, 1000);
