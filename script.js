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

    // Fetch the deals JSON
    const response = await fetch("deals.json");
    const deals = await response.json();

    // Default images by type
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

        const filtered = deals.filter(d => {
            if (!d || typeof d !== "object") return false;

            const city = d.city || "";
            const type = d.type || "";

            const cityOk = !cityValue || city === cityValue;
            const typeOk = !typeValue || type === typeValue;

            return cityOk && typeOk;
        });

        // Build cards with the CORRECT image-wrapper layout
        dealList.innerHTML = filtered.map(d => {
            const name = d.name || "Unknown place";
            const city = d.city || "Unknown";
            const type = d.type || "Other";
            const freebie = d.freebie || "Birthday freebie";
            const conditions = d.conditions || "See location for details";
            const link = d.link || "#";

            const imgSrc =
                d.image ||
                typeImages[type] ||
                "images/deals/default.jpg";

            return `
                <div class="deal-card">
                    <div class="deal-image-wrapper">
                        <img class="deal-image" src="${imgSrc}" alt="${name}">
                    </div>
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
