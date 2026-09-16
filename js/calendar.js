/**
 * Yom-B-Yom Dashboard - Dynamic Mood Journal & Calendar Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const calendarDaysContainer = document.getElementById("calendar-days");
  const calendarMonthTitle = document.getElementById("calendar-month-title");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const todayBtn = document.getElementById("today-btn");
  const dailyQuoteText = document.getElementById("daily-inspiration-text");
  const galleryHeaderTitle = document.getElementById("gallery-header-title");
  const notesHeaderTitle = document.getElementById("notes-header-title");

  const moodModal = document.getElementById("mood-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const clearMoodBtn = document.getElementById("clear-mood-btn");
  const moodCards = document.querySelectorAll(".mood-card");

  const notesTextarea = document.getElementById("calendar-notes");
  const saveIndicator = document.getElementById("notes-save-indicator");
  const imageInput = document.getElementById("image-upload");
  const imageGrid = document.getElementById("image-grid");

  // Month Names Array
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Dynamic Inspiration Quotes
  const inspirationalQuotes = [
    "You are doing better than you think. Take a deep breath, embrace today with a peaceful heart, and celebrate every small step forward.",
    "Every day is a fresh beginning. Focus on the progress you are making, no matter how small it may seem.",
    "Small daily improvements over time lead to stunning, life-changing results. Keep going.",
    "Protect your peace, honor your energy, and remember that you have the strength to handle whatever comes today.",
    "Your potential is endless. Trust the timing of your journey and make this month count.",
    "Breathe in calm, breathe out doubt. You are building something wonderful day by day."
  ];

  // Calendar State
  const todayDate = new Date();
  let currentViewDate = new Date(); // Start at current real date

  let selectedDateKey = null;
  let selectedDayElement = null;

  // Storage Keys
  const MOOD_STORAGE_KEY = "yombyom_calendar_moods_v3";
  const NOTES_BASE_KEY = "yombyom_calendar_notes_v3";
  const GALLERY_BASE_KEY = "yombyom_calendar_gallery_v3";

  // Load Saved Moods Dictionary
  let savedMoods = {};
  try {
    const raw = localStorage.getItem(MOOD_STORAGE_KEY) || localStorage.getItem("yombyom_calendar_moods_v2");
    if (raw) savedMoods = JSON.parse(raw);
  } catch (e) {
    console.error("Error reading saved moods:", e);
  }

  // Format Helper: YYYY-MM-DD
  function getDateKey(year, month, day) {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  }

  // Format Helper: YYYY-MM for Month-level Storage
  function getMonthKey(year, month) {
    const m = String(month + 1).padStart(2, "0");
    return `${year}-${m}`;
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

  // 1. Dynamic Calendar Rendering Engine
  function renderCalendar() {
    if (!calendarDaysContainer) return;

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const currentMonthName = monthNames[month];

    // Update Header Titles
    if (calendarMonthTitle) {
      calendarMonthTitle.textContent = `${currentMonthName} ${year}`;
    }

    if (galleryHeaderTitle) {
      galleryHeaderTitle.textContent = `${currentMonthName} Memories`;
    }

    if (notesHeaderTitle) {
      notesHeaderTitle.textContent = `${currentMonthName} Notes`;
    }

    if (notesTextarea) {
      notesTextarea.placeholder = `Write down your goals, special moments, or personal thoughts for ${currentMonthName}...`;
    }

    // Update Quote dynamically based on month
    if (dailyQuoteText) {
      const quoteIndex = (month + year) % inspirationalQuotes.length;
      dailyQuoteText.textContent = `"${inspirationalQuotes[quoteIndex]}"`;
    }

    // Calculate Days & First Day Offset
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // 28, 29, 30, or 31

    calendarDaysContainer.innerHTML = "";

    // Insert Empty Cells for days before the 1st of the month
    for (let blank = 0; blank < firstDayIndex; blank++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("day-cell", "empty-cell");
      emptyCell.innerHTML = `<div class="circle-slot"></div><span class="day-number"></span>`;
      calendarDaysContainer.appendChild(emptyCell);
    }

    // Insert Actual Month Days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("day-cell");
      
      const dateKey = getDateKey(year, month, day);
      dayCell.dataset.date = dateKey;
      dayCell.dataset.day = day;

      // Check if Today
      const isToday = (
        year === todayDate.getFullYear() &&
        month === todayDate.getMonth() &&
        day === todayDate.getDate()
      );
      if (isToday) {
        dayCell.classList.add("is-today");
      }

      dayCell.innerHTML = `
        <div class="circle-slot"></div>
        <span class="day-number">${day}</span>
      `;

      const circleSlot = dayCell.querySelector(".circle-slot");

      // Restore saved mood (supports new dateKey format and fallback numeric day for current month)
      const mood = savedMoods[dateKey] || (month === 8 && year === 2026 ? savedMoods[day] : null);
      if (mood) {
        applyMoodToSlot(circleSlot, mood);
      }

      // Click Day Handler
      dayCell.addEventListener("click", () => {
        document.querySelectorAll(".day-cell").forEach(cell => cell.classList.remove("selected"));
        dayCell.classList.add("selected");
        selectedDayElement = dayCell;
        selectedDateKey = dateKey;

        // Open Modal
        if (moodModal) {
          moodModal.classList.add("active");
        }
      });

      calendarDaysContainer.appendChild(dayCell);
    }

    // Load Month-Specific Notes & Gallery
    loadMonthNotes(year, month);
    loadMonthGallery(year, month);
  }

  // 2. Navigation Event Listeners
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentViewDate.setMonth(currentViewDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      currentViewDate.setMonth(currentViewDate.getMonth() + 1);
      renderCalendar();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      currentViewDate = new Date();
      renderCalendar();
    });
  }

  // 3. Modal Close Controls
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (moodModal) moodModal.classList.remove("active");
    });
  }

  if (moodModal) {
    moodModal.addEventListener("click", (e) => {
      if (e.target === moodModal) {
        moodModal.classList.remove("active");
      }
    });
  }

  // 4. Clear Mood for Selected Day
  if (clearMoodBtn) {
    clearMoodBtn.addEventListener("click", () => {
      if (!selectedDayElement || !selectedDateKey) return;
      const circleSlot = selectedDayElement.querySelector(".circle-slot");
      if (circleSlot) {
        circleSlot.innerHTML = "";
        circleSlot.style.backgroundColor = "";
        circleSlot.classList.remove("dark-face");
      }

      delete savedMoods[selectedDateKey];
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(savedMoods));

      if (moodModal) moodModal.classList.remove("active");
    });
  }

  // 5. Select Mood Card Handler
  moodCards.forEach(card => {
    card.addEventListener("click", () => {
      if (!selectedDayElement || !selectedDateKey) return;

      const faceDiv = card.querySelector(".face");
      const circleSlot = selectedDayElement.querySelector(".circle-slot");
      if (!faceDiv || !circleSlot) return;

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

      // Save to localStorage under full dateKey
      savedMoods[selectedDateKey] = moodData;
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(savedMoods));

      // Close modal
      if (moodModal) moodModal.classList.remove("active");
    });
  });

  // 6. Notes Handling (Strictly per Month)
  let saveNotesTimeout;

  function loadMonthNotes(year, month) {
    if (!notesTextarea) return;
    const monthKey = getMonthKey(year, month);
    const monthNotes = localStorage.getItem(`${NOTES_BASE_KEY}_${monthKey}`);
    
    // For legacy September 2026 data, check fallback if not yet set
    if (monthNotes === null && month === 8 && year === 2026) {
      const globalNotes = localStorage.getItem("yombyom_calendar_notes_v2");
      notesTextarea.value = globalNotes || "";
    } else {
      notesTextarea.value = monthNotes || "";
    }
  }

  if (notesTextarea) {
    notesTextarea.addEventListener("input", () => {
      const year = currentViewDate.getFullYear();
      const month = currentViewDate.getMonth();
      const monthKey = getMonthKey(year, month);

      localStorage.setItem(`${NOTES_BASE_KEY}_${monthKey}`, notesTextarea.value);

      if (saveIndicator) {
        saveIndicator.classList.add("show");
        clearTimeout(saveNotesTimeout);
        saveNotesTimeout = setTimeout(() => {
          saveIndicator.classList.remove("show");
        }, 1200);
      }
    });
  }

  // 7. Gallery Memories (Strictly per Month)
  function loadMonthGallery(year, month) {
    if (!imageGrid) return;
    const monthKey = getMonthKey(year, month);
    try {
      let raw = localStorage.getItem(`${GALLERY_BASE_KEY}_${monthKey}`);
      let images = null;
      if (raw !== null) {
        images = JSON.parse(raw);
      } else if (month === 8 && year === 2026) {
        // Fallback for initial legacy September 2026 photos
        images = JSON.parse(localStorage.getItem("yombyom_calendar_gallery_v2") || "[]");
      } else {
        images = [];
      }
      renderGalleryImages(images, monthNames[month]);
    } catch (e) {
      console.error("Error reading saved gallery:", e);
      renderGalleryImages([], monthNames[month]);
    }
  }

  function renderGalleryImages(images, monthName) {
    if (!imageGrid) return;
    imageGrid.innerHTML = "";
    if (!images || images.length === 0) {
      const label = monthName || "this month";
      imageGrid.innerHTML = `<div class="gallery-empty">No photos added yet for ${label}. Upload up to 5 photos!</div>`;
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
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const monthKey = getMonthKey(year, month);
    let images = [];
    try {
      images = JSON.parse(localStorage.getItem(`${GALLERY_BASE_KEY}_${monthKey}`) || "[]");
    } catch (e) {}
    images.splice(index, 1);
    localStorage.setItem(`${GALLERY_BASE_KEY}_${monthKey}`, JSON.stringify(images));
    renderGalleryImages(images, monthNames[month]);
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
            const year = currentViewDate.getFullYear();
            const month = currentViewDate.getMonth();
            const monthKey = getMonthKey(year, month);
            let existing = [];
            try {
              existing = JSON.parse(localStorage.getItem(`${GALLERY_BASE_KEY}_${monthKey}`) || "[]");
            } catch (err) {}
            const combined = [...existing, ...newImages].slice(0, 5);
            localStorage.setItem(`${GALLERY_BASE_KEY}_${monthKey}`, JSON.stringify(combined));
            renderGalleryImages(combined, monthNames[month]);
          }
        };
        reader.readAsDataURL(file);
      });
      // Clear input so same file can be chosen again if needed
      event.target.value = "";
    });
  }

  // Initial Load
  renderCalendar();
});


