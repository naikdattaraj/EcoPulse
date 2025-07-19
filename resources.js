document.addEventListener("DOMContentLoaded", function() {
  // Example: Add more green tips or let them rotate daily
  const tips = [
    "Carry your own reusable water bottle.",
    "Avoid single-use plastics at the beach.",
    "Compost your organic waste to enrich gardens.",
    "Separate e-waste and drop at designated points."
  ];
  const tipsFeed = document.getElementById("tipsFeed");
  if (tipsFeed) {
    tipsFeed.textContent = tips[Math.floor(Math.random() * tips.length)];
  }

  // Expand directory dynamically (bonus for larger sites)
  // Example only; keep basic for your assignment if desired.
});

// (You can expand this script to allow adding new directory entries or rotating daily tips.)
