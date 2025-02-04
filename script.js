let karma = 100;
let kps = 0.50;
let animals = {
  chicken: { price: 15, kps: 0.10, quantity: 1 },
  pigeon: { price: 100, kps: 1.00, quantity: 1 },
  duck: { price: 1100, kps: 5.00, quantity: 0 },
  owl: { price: 12000, kps: 10.00, quantity: 0 },
  parrot: { price: 130000, kps: 50.00, quantity: 0 },
  phoenix: { price: 1400000, kps: 100.00, quantity: 0 }
};

// Sayıyı bin, milyon, milyar gibi birimlerle formatlayan fonksiyon
function formatNumber(num) {
  if (num < 1e3) {
    return num.toFixed(2);
  } else if (num < 1e6) {
    return (num / 1e3).toFixed(2) + " K";
  } else if (num < 1e9) {
    return (num / 1e6).toFixed(2) + " M";
  } else if (num < 1e12) {
    return (num / 1e9).toFixed(2) + " B";
  } else if (num < 1e15) {
    return (num / 1e12).toFixed(2) + " T";
  } else {
    return (num / 1e15).toFixed(2) + " Q";
  }
}

// Karma Güncelleme Fonksiyonu
function updateKarma() {
  document.querySelector(".karma").textContent = `🔷${formatNumber(karma)}`;
}

// KPS Güncelleme Fonksiyonu
function updateKps() {
  document.querySelector(".kps-text").textContent = `KPS: ${formatNumber(kps)}`;
}

// Mağazadaki Hayvanları Güncelleme
function updateShopItem(animal) {
  const item = animals[animal];
  const itemElement = document.querySelector(`.store-item[onclick="buyItem('${animal}')"]`);

  if (itemElement) {
    itemElement.querySelector(".quantity").textContent = `${item.quantity}`;
    itemElement.querySelector(".price").textContent = `🔷${formatNumber(item.price)}`;
    itemElement.querySelector(".kps").textContent = `${formatNumber(item.kps)}`;
    
    // Karma'yı kontrol et, eğer yeterli değilse, öğeyi devre dışı bırak
    if (karma >= item.price) {
      itemElement.style.opacity = 1; // Tam görünür
      itemElement.style.pointerEvents = "auto"; // Tıklanabilir yap
    } else {
      itemElement.style.opacity = 0.5; // Yarı saydam
      itemElement.style.pointerEvents = "none"; // Tıklanamaz hale getir
    }
  }
}

let eggMultiplier = 1.0;
document.querySelector('.egg-box').addEventListener('click', () => {
  karma += 0.1 * eggMultiplier;
  eggMultiplier += 0.7; // Her tıklamada artan bonus
});

// Hayvan Satın Alma Fonksiyonu
function buyItem(animal) {
  const item = animals[animal];
  if (karma >= item.price) {
    karma -= item.price;
    item.quantity += 1;
    
    // Toplam KPS'ye temel KPS değerini ekle
    kps += item.kps;
  

    // Fiyat artışı kontrolü
    if (item.quantity % 50 === 0) {
      // 50. alımda fiyat 100 katına çıkar
      item.price = Math.round(item.price * 100);
      item.kps *= 100; // KPS de 100 katına çıkar
    } else if (item.quantity % 5 === 0) {
      // 5. alımda fiyat 2 katına çıkar
      item.price = Math.round(item.price * 2);
      item.kps *= 2; // KPS de 2 katına çıkar
    } else {
      // Diğer durumlarda fiyat %10 artar
      item.price = Math.round(item.price * 1.10);
      item.kps *= 1.10; // KPS de %10 artar
    }

    updateKarma();
    updateKps();
    updateShopItem(animal);
  } else {
    alert("Yetersiz Karma!");
  }
}

// Zamanla Karma Kazandıran Fonksiyon
function generateKarma() {
  karma += kps;
  updateKarma();
  // Karma arttıkça hayvanlar için butonları güncelle
  Object.keys(animals).forEach(animal => {
    updateShopItem(animal);
  });
}

// Her saniye karma üret
setInterval(generateKarma, 1000);

// İlk Değerleri Güncelle
updateKarma();
updateKps();

// Sayfa yüklendiğinde tüm mağaza öğelerini güncelle
Object.keys(animals).forEach(animal => {
  updateShopItem(animal);
});
