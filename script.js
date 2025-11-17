// Helper: format "YYYY-MM-DD" as "Month D" without timezone issues
function formatBirthday(isoString) {
    if (!isoString) return "";
    const parts = isoString.split("-");
    if (parts.length !== 3) return "";

    const year = Number(parts[0]);
    const month = Number(parts[1]); // 1–12
    const day = Number(parts[2]);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric"
    });
}

async function loadDeals() {
    const dealList = document.getElementById("dealList");
    const cityFilter = document.getElementById("cityFilter");
    const typeFilter = document.getElementById("typeFilter");
    const birthdayBanner = document.getElementById("birthdayBanner");

    // Show birthday banner if we have one stored
    const storedBirthday = localStorage.getItem("birthdayScoutBirthday");
    if (storedBirthday && birthdayBanner) {
        const formatted = formatBirthday(storedBirthday);
        if (formatted) {
            birthdayBanner.textContent =
                `Showing deals for your birthday on ${formatted} 🎂`;
        }
    }

    // Fetch the JSON file with deals (same folder as deals.html)
    const response = await fetch("deals.json");
    const deals = await response.json();

    // Default images by type (used if a deal has no explicit image)
    const typeImages = {
        "Food": "images/deals/default-food.jpg",
        "Dessert": "images/deals/default-dessert.jpg",
        "Drink": "images/deals/default-drink.jpg",
        "Activity": "images/deals/default-activity.jpg",
        "Beauty": "images/deals/default-beauty.jpg",
        "Retail": "images/deals/default-retail.jpg"
    };

    function render() {
        const cityValue = cityFilter ? cityFilter.value : "";
        const typeValue = typeFilter ? typeFilter.value : "";

        const filtered = deals.filter(raw => {
            // 1) Make sure it's a real object
            if (!raw || typeof raw !== "object") return false;

            // 2) Require a name so we don't show "undefined" cards
            if (!raw.name && !raw.brand) return false;

            const city = raw.city || "";
            const type = raw.type || "";

            const cityOk = cityValue === "" || city === cityValue;
            const typeOk = typeValue === "" || type === typeValue;

            return cityOk && typeOk;
        });

        // Build HTML cards
        dealList.innerHTML = filtered.map(d => {
            const name = d.name || d.brand || "Unknown place";
            const city = d.city || "Unknown";
            const type = d.type || "Other";
            const freebie = d.freebie || "Birthday freebie";
            const conditions = d.conditions || "See location for details";
            const link = d.link || "#";

            // If this deal has a custom image, use it;
            // otherwise fall back to a generic based on type,
            // and finally to a global default.
            const imgSrc =
                d.image ||
                typeImages[type] ||
                "images/deals/default.jpg";

            return `
                <div class="deal-card">
                    <img class="deal-image" src="${imgSrc}" alt="${name}">
                    <h3>${name}</h3>
                    <p><strong>City:</strong> ${city}</p>
                    <p><strong>Type:</strong> ${type}</p>
                    <p><strong>Freebie:</strong> ${freebie}</p>
                    <p><strong>Conditions:</strong> ${conditions}</p>
                    <a href="${link}" target="_blank" class="btn">View offer</a>
                </div>
            `;
        }).join("");
    }

    if (cityFilter) cityFilter.addEventListener("change", render);
    if (typeFilter) typeFilter.addEventListener("change", render);

    render();
}

loadDeals();
