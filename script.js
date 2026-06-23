// ================= 1. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) =================
const burgerBtn = document.getElementById("burger-btn");
const nav = document.querySelector(".nav");

if (burgerBtn && nav) {
  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });
}

// ================= 2. СИСТЕМА ПОИСКА, ФИЛЬТРАЦИИ И ПОДСВЕТКИ =================
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const tabBtns = document.querySelectorAll(".tab-btn");
const contentItems = document.querySelectorAll(".content-item");
const noResultsMsg = document.getElementById("noResultsMsg");

if (searchInput) {
  let currentCategory = "all";
  let currentSearchTerm = "";
  let currentTab = "article";

  // Сохраняем оригинальный текст карточек при первой загрузке,
  // чтобы постоянная подсветка не ломала и не дублировала HTML-теги
  contentItems.forEach((item) => {
    const textNodes = item.querySelectorAll(".card__title, .card__text");
    textNodes.forEach((node) => {
      if (!node.hasAttribute("data-original-text")) {
        node.setAttribute("data-original-text", node.textContent.trim());
      }
    });
  });

  // Главная функция фильтрации и подсветки
  function filterContent() {
    let visibleCount = 0;

    contentItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      const itemType = item.getAttribute("data-type");

      // Находим текстовые элементы внутри карточки
      const textNodes = item.querySelectorAll(".card__title, .card__text");

      // Собираем весь текст карточки в одну строку для проверки поиска
      let combinedText = "";
      textNodes.forEach((node) => {
        combinedText +=
          " " + node.getAttribute("data-original-text").toLowerCase();
      });

      // Проверяем условия фильтров
      const matchesTab = itemType === currentTab;
      const matchesCategory =
        currentCategory === "all" || itemCategory === currentCategory;
      const matchesSearch = combinedText.includes(currentSearchTerm);

      // Если карточка прошла все фильтры
      if (matchesTab && matchesCategory && matchesSearch) {
        item.style.display = "flex";
        visibleCount++;

        // Логика подсветки текста
        textNodes.forEach((node) => {
          const originalText = node.getAttribute("data-original-text");

          if (currentSearchTerm !== "") {
            // Экранируем спецсимволы для безопасного регулярного выражения
            const escapedTerm = currentSearchTerm.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&",
            );
            // Флаги: 'g' — искать все совпадения, 'i' — игнорировать регистр (Аа)
            const regex = new RegExp(`(${escapedTerm})`, "gi");

            // Оборачиваем совпадения в тег <mark> с классом для стилей
            node.innerHTML = originalText.replace(
              regex,
              '<mark class="txt-highlight">$1</mark>',
            );
          } else {
            // Если поиск пустой — возвращаем обычный текст
            node.textContent = originalText;
          }
        });
      } else {
        // Если карточка скрыта — убираем с неё подсветку и прячем
        item.style.display = "none";
        textNodes.forEach((node) => {
          node.textContent = node.getAttribute("data-original-text");
        });
      }
    });

    // Показ сообщения "Ничего не найдено"
    if (visibleCount === 0) {
      noResultsMsg.style.display = "block";
    } else {
      noResultsMsg.style.display = "none";
    }
  }

  // Запуск фильтра при загрузке
  filterContent();

  // 1. Отслеживаем ввод в поисковую строку
  searchInput.addEventListener("input", (e) => {
    currentSearchTerm = e.target.value.toLowerCase().trim();
    filterContent();
  });

  // 2. Отслеживаем клики по категориям
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-filter");
      filterContent();
    });
  });

  // 3. Отслеживаем клики по вкладкам (Статьи / Советы)
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTab = btn.getAttribute("data-type");
      filterContent();
    });
  });
}