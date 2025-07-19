// --- Advanced EcoPulse Goa Waste Sorting Game (game.js) ---

// Waste database: Each item has a type and an eco-fact
const wasteDB = [
  {label: "Plastic Bottle 🥤", type: "plastic", fact: "Only 9% of plastic gets recycled globally."},
  {label: "Banana Peel 🍌", type: "organic", fact: "Composting peels enriches soil naturally."},
  {label: "Newspaper 📰", type: "paper", fact: "Paper can be recycled 5-7 times!"},
  {label: "Aluminium Can 🥫", type: "metal", fact: "Aluminium cans are recyclable forever."},
  {label: "Battery 🔋", type: "e-waste", fact: "Batteries must never go in regular bins!"},
  {label: "Apple Core 🍏", type: "organic", fact: "Most food scraps are ideal for composting."},
  {label: "Old Mobile 📱", type: "e-waste", fact: "Mobile e-waste is highly toxic if not handled right."},
  {label: "Magazine 📖", type: "paper", fact: "Recycling a ton of paper saves 17 trees."}
];

// Game config
const bins = [
  {id: "plasticBin", label: "Plastic"},
  {id: "organicBin", label: "Organic"},
  {id: "paperBin",   label: "Paper"},
  {id: "metalBin",   label: "Metal"},
  {id: "e-wasteBin", label: "E-Waste"}
];

let score = 0, current = 0, roundItems = [], facts = [], startTime = undefined, bestScore = localStorage.getItem('wasteBestScore') || 0;

// Utility to randomize items per round
function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

function setupGame() {
  // Choose 5 random unique waste items per round
  roundItems = shuffle(wasteDB).slice(0, 5);
  facts = [];
  score = 0;
  current = 0;
  startTime = Date.now();

  // Build bins
  const binContainer = document.querySelector('.bin-container');
  binContainer.innerHTML = bins.map(b => `<div id="${b.id}" class="bin" tabindex="0">${b.label}</div>`).join('');
  // Build items
  const itemsContainer = document.querySelector('.items-container');
  itemsContainer.innerHTML = roundItems.map((item, i) => 
    `<div class="item" draggable="true" data-type="${item.type}" data-idx="${i}" tabindex="0">${item.label}</div>`
  ).join('');
  // Scoreboard
  document.getElementById('scoreBoard').textContent = `Score: 0 — Best: ${bestScore}`;
  document.getElementById('factBox').textContent = 'Drag each item to the correct bin!';
  wireEvents();
}

function wireEvents() {
  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('type', item.dataset.type);
      e.dataTransfer.setData('idx', item.dataset.idx);
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', e => item.classList.remove('dragging'));
  });
  bins.forEach(bin => {
    const binEl = document.getElementById(bin.id);
    binEl.ondragover = e => e.preventDefault();
    binEl.ondrop = function(e) {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      const idx = e.dataTransfer.getData('idx');
      checkDrop(type, bin.label.toLowerCase(), idx);
    };
    // Keyboard drop support
    binEl.onkeyup = function(e) {
      if (e.key === 'Enter') {
        const dragging = document.querySelector('.item.dragging');
        if (dragging) checkDrop(dragging.dataset.type, bin.label.toLowerCase(), dragging.dataset.idx);
      }
    };
  });
  // For keyboard: focus/drag simulation
  document.querySelectorAll('.item').forEach(item => {
    item.onkeydown = function(e) {
      if (e.key === ' ') {
        e.preventDefault();
        document.querySelectorAll('.item').forEach(i=>i.classList.remove('dragging'));
        item.classList.add('dragging');
        item.focus();
      }
    };
  });
}

function checkDrop(itemType, binType, idx) {
  const itemData = roundItems[idx];
  let message, correct;
  if (itemType.toLowerCase() === binType) {
    score++;
    message = `✅ Correct! ${itemData.fact}`;
    correct = true;
    document.querySelector(`.item[data-idx="${idx}"]`).style.visibility = "hidden";
  } else {
    message = `❌ Wrong bin! Try again.`;
    correct = false;
  }
  document.getElementById('scoreBoard').textContent = `Score: ${score} — Best: ${bestScore}`;
  document.getElementById('factBox').textContent = message;
  playSound(correct);

  current++;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('wasteBestScore', bestScore);
  }
  // If all sorted or n attempts
  if (current === roundItems.length) setTimeout(showResult, 1200);
}

function showResult() {
  const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1);
  document.getElementById('factBox').textContent = 
    `🎉 Done! Score: ${score}/${roundItems.length} | Time: ${timeTaken}s. Best: ${bestScore}. Play again?`;
  // Play again button
  let againBtn = document.getElementById('playAgainBtn');
  if (!againBtn) {
    againBtn = document.createElement('button');
    againBtn.id = 'playAgainBtn';
    againBtn.textContent = 'Play Again';
    againBtn.className = 'cta secondary';
    againBtn.onclick = setupGame;
    document.getElementById('scoreBoard').insertAdjacentElement('afterend', againBtn);
  }
}

// Sound effects: simple with AudioContext or fallback beep
function playSound(correct) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = correct ? 600 : 220;
    g.gain.value = correct ? 0.08 : 0.12;
    o.connect(g).connect(ctx.destination);
    o.start();
    setTimeout(()=>{o.stop(); ctx.close();}, correct ? 160 : 350);
  } catch {}
}

// Dynamically create missing bins in HTML if needed
function ensureBins() {
  const binContainer = document.querySelector('.bin-container');
  if (binContainer && binContainer.children.length < bins.length) {
    binContainer.innerHTML = bins.map(b => `<div id="${b.id}" class="bin" tabindex="0">${b.label}</div>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  ensureBins();
  // Add fact box/div if not present
  if (!document.getElementById('factBox')) {
    const fb = document.createElement('div');
    fb.id = 'factBox';
    fb.style.marginTop = '1.5rem';
    fb.style.fontWeight = 'bold';
    fb.style.minHeight = '2.2em';
    fb.style.color = 'seagreen';
    document.querySelector('.score')?.appendChild(fb);
  }
  setupGame();
});

