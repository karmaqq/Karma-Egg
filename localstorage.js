// Verileri yerel depolamadan yükleme
function loadGameData() {
    let karma = parseInt(localStorage.getItem("karma")) || 0;
    let kps = parseInt(localStorage.getItem("kps")) || 1;
  
    // Tüm habitatları yükle
    const habitats = ['Kümes', 'Çatı', 'Gölet', 'Kara Orman', 'Tropikal', 'Dağ'];
    habitats.forEach(habitat => {
        let habitatCount = parseInt(localStorage.getItem(habitat)) || 0;
        // Habitatların bulunduğu div'leri güncelle
        const habitatElement = document.querySelector(`.habitat-info div:contains(${habitat})`);
        if (habitatElement) {
            habitatElement.innerText = `${habitat}: ${habitatCount}`;
        }
    });
  
    // Verileri güncelle
    updateUI(karma, kps);
  }
  
  // Verileri güncellemek için fonksiyon
  function updateUI(karma, kps) {
    document.querySelector(".karma").innerText = `🔷${karma}`;
    document.querySelector(".kps-text").innerText = `KPS: ${kps}`;
  }
  
  // Habitat yükseltme fonksiyonu
  function upgradeHabitat(habitat) {
    let karma = parseInt(localStorage.getItem("karma")) || 0;
    let habitatCost = getHabitatCost(habitat);
  
    if (karma >= habitatCost) {
        karma -= habitatCost;
        let habitatCount = parseInt(localStorage.getItem(habitat)) || 0;
        habitatCount++;
        localStorage.setItem(habitat, habitatCount);
        localStorage.setItem("karma", karma);
        updateUI(karma, getKPS());
        loadGameData(); // Habitat'ı güncelle
    } else {
        alert("Yeterli kararma yok!");
    }
  }
  
  // Habitat maliyetini al
  function getHabitatCost(habitat) {
    const costMapping = {
        'Kümes': 1,
        'Çatı': 10,
        'Gölet': 50,
        'Kara Orman': 120,
        'Tropikal': 500,
        'Dağ': 1400,
    };
    return costMapping[habitat] || 0;
  }
  
  // Mağaza öğesi satın alma fonksiyonu
  function buyItem(animal) {
    let karma = parseInt(localStorage.getItem("karma")) || 0;
    let animalPrice = getAnimalPrice(animal);
  
    if (karma >= animalPrice) {
        karma -= animalPrice;
        let animalCount = parseInt(localStorage.getItem(animal)) || 0;
        animalCount++;
        localStorage.setItem(animal, animalCount);
        localStorage.setItem("karma", karma);
        updateUI(karma, getKPS());
    } else {
        alert("Yeterli kararma yok!");
    }
  }
  
  // Mağaza hayvanlarının fiyatını al
  function getAnimalPrice(animal) {
    const priceMapping = {
        'chicken': 15,
        'pigeon': 100,
        'duck': 1.10 * 1000, // 1.10K
        'owl': 12.00 * 1000, // 12K
        'parrot': 130.00 * 1000, // 130K
        'phoenix': 1.40 * 1000000, // 1.40M
    };
    return priceMapping[animal] || 0;
  }
  
  // KPS hesaplama fonksiyonu
  function getKPS() {
    const habitats = ['Kümes', 'Çatı', 'Gölet', 'Kara Orman', 'Tropikal', 'Dağ'];
    let kps = 0;
  
    habitats.forEach(habitat => {
        let habitatCount = parseInt(localStorage.getItem(habitat)) || 0;
        kps += habitatCount; // KPS arttırma (her habitat her saniyede bir KPS üretir)
    });
  
    return kps;
  }
  
  // Verileri periyodik olarak güncelleme (Karma ve KPS)
  setInterval(function () {
    let karma = parseInt(localStorage.getItem("karma")) || 0;
    let kps = getKPS();
    karma += kps; // KPS kadar karma ekle
    localStorage.setItem("karma", karma);
    updateUI(karma, kps); // UI'yi güncelle
  }, 1000); // Her saniye veriyi günceller
  
  // DOMContentLoaded olayını burada dinleyip, veri yüklemesini başlatıyoruz.
  document.addEventListener("DOMContentLoaded", function () {
    loadGameData();
  });
  