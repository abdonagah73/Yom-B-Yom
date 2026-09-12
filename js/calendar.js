/**
 * Yom-B-YOM Dashboard - Mood Journal & Calendar JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  const calendarDaysContainer = document.getElementById("calendar-days");
  const moodModal = document.getElementById("mood-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const clearMoodBtn = document.getElementById("clear-mood-btn");
  const moodCards = document.querySelectorAll(".mood-card");
  const notesTextarea = document.getElementById("calendar-notes");
  const saveIndicator = document.getElementById("notes-save-indicator");
  const imageInput = document.getElementById("image-upload");
  const imageGrid = document.getElementById("image-grid");

  let selectedDayNumber = null;
  let selectedDayElement = null;

  // Storage Keys
  const MOOD_STORAGE_KEY = "yombyom_calendar_moods_v2";
  const NOTES_STORAGE_KEY = "yombyom_calendar_notes_v2";
  const GALLERY_STORAGE_KEY = "yombyom_calendar_gallery_v2";

  // Load Saved Moods
  let savedMoods = {};
  try {
    const raw = localStorage.getItem(MOOD_STORAGE_KEY);
    if (raw) savedMoods = JSON.parse(raw);
  } catch (e) {
    console.error("Error reading saved moods:", e);
  }

  // 1. Generate Calendar Days (1 to 30)
  const totalDays = 30;

  for (let i = 1; i <= totalDays; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-cell");
    dayCell.dataset.day = i;

    dayCell.innerHTML = `
      <div class="circle-slot"></div>
      <span class="day-number">${i}</span>
    `;

    const circleSlot = dayCell.querySelector(".circle-slot");

    // Restore saved mood if exists
    if (savedMoods[i]) {
      applyMoodToSlot(circleSlot, savedMoods[i]);
    }

    // Click day -> open popup modal
    dayCell.addEventListener("click", () => {
      document.querySelectorAll(".day-cell").forEach(cell => cell.classList.remove("selected"));
      dayCell.classList.add("selected");
      selectedDayElement = dayCell;
      selectedDayNumber = i;

      // Show modal
      moodModal.classList.add("active");
    });

    calendarDaysContainer.appendChild(dayCell);
  }

  // Helper: Apply mood data to a circle slot
  function applyMoodToSlot(circleSlot, moodData) {
    if (!circleSlot || !moodData) return;
    circleSlot.innerHTML = moodData.svgHtml || "";
    circleSlot.style.backgroundColor = moodData.bgColor || "";
    circleSlot.style.borderColor = "#1a0f0c";
    if (moodData.isDark) {
      circleSlot.classList.add("dark-face");
    } else {
      circleSlot.classList.remove("dark-face");
    }
  }

  // 2. Close Modal Listeners
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      moodModal.classList.remove("active");
    });
  }

  if (moodModal) {
    moodModal.addEventListener("click", (e) => {
      if (e.target === moodModal) {
        moodModal.classList.remove("active");
      }
    });
  }

  // 3. Clear Mood for selected day
  if (clearMoodBtn) {
    clearMoodBtn.addEventListener("click", () => {
      if (!selectedDayElement || !selectedDayNumber) return;
      const circleSlot = selectedDayElement.querySelector(".circle-slot");
      circleSlot.innerHTML = "";
      circleSlot.style.backgroundColor = "";
      circleSlot.classList.remove("dark-face");

      delete savedMoods[selectedDayNumber];
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(savedMoods));

      moodModal.classList.remove("active");
    });
  }

  // 4. Select Mood Logic
  moodCards.forEach(card => {
    card.addEventListener("click", () => {
      if (!selectedDayElement || !selectedDayNumber) return;

      const faceDiv = card.querySelector(".face");
      const circleSlot = selectedDayElement.querySelector(".circle-slot");
      const isDark = faceDiv.classList.contains("dark-face");
      const bgColor = window.getComputedStyle(faceDiv).backgroundColor;
      const svgHtml = faceDiv.innerHTML;

      const moodData = {
        svgHtml,
        bgColor,
        isDark,
        name: card.querySelector("span") ? card.querySelector("span").innerText : ""
      };

      applyMoodToSlot(circleSlot, moodData);

      // Save to localStorage
      savedMoods[selectedDayNumber] = moodData;
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(savedMoods));

      // Auto-hide modal
      moodModal.classList.remove("active");
    });
  });

  // 5. Notes Auto-Save
  if (notesTextarea) {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes !== null) {
      notesTextarea.value = savedNotes;
    }

    let saveTimeout;
    notesTextarea.addEventListener("input", () => {
      localStorage.setItem(NOTES_STORAGE_KEY, notesTextarea.value);
      if (saveIndicator) {
        saveIndicator.classList.add("show");
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          saveIndicator.classList.remove("show");
        }, 1200);
      }
    });
  }

  // 6. Gallery Photo Upload & LocalStorage Persistence
  function loadGallery() {
    if (!imageGrid) return;
    try {
      const savedImages = JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY) || "[]");
      renderGalleryImages(savedImages);
    } catch (e) {
      console.error("Error reading saved gallery:", e);
    }
  }

  function renderGalleryImages(images) {
    imageGrid.innerHTML = "";
    if (!images || images.length === 0) {
      imageGrid.innerHTML = `<div class="gallery-empty">No photos added yet. Upload up to 5 photos!</div>`;
      return;
    }

    images.forEach((imgSrc, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("img-wrapper");

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `Memory Photo ${index + 1}`;

      const delBtn = document.createElement("button");
      delBtn.classList.add("del-img-btn");
      delBtn.innerHTML = "&times;";
      delBtn.title = "Delete photo";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteGalleryImage(index);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);
      imageGrid.appendChild(wrapper);
    });
  }

  function deleteGalleryImage(index) {
    let images = [];
    try {
      images = JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY) || "[]");
    } catch (e) {}
    images.splice(index, 1);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
    renderGalleryImages(images);
  }

  if (imageInput) {
    imageInput.addEventListener("change", function(event) {
      const files = Array.from(event.target.files).slice(0, 5);
      if (files.length === 0) return;

      const newImages = [];
      let processed = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          newImages.push(e.target.result);
          processed++;
          if (processed === files.length) {
            let existing = [];
            try {
              existing = JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY) || "[]");
            } catch (err) {}
            const combined = [...existing, ...newImages].slice(0, 5);
            localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(combined));
            renderGalleryImages(combined);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  loadGallery();
});
