// Helper: format "YYYY-MM-DD" as "Month D" without timezone issues
function formatBirthday(isoString) {
    if (!isoString) return "";
    const parts = isoString.split("-");
    if (parts.length !== 3) return "";

    const year = Number(parts[0]);
    const month = Number(parts[1]); // 1–12
    const day = Number(parts[2]);

    // Create a date in local time, not UTC
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
            birthdayBanner.textContent = `Showing deals for your birthday on ${formatted} 🎂`;
        }
    }

    // Fetch the JSON file with deals
    const response = await fetch("deals.json");
    const deals = await response.json();

    function render() {
        const cityValue = cityFilter ? cityFilter.value : "";
        const typeValue = typeFilter ? typeFilter.value : "";

        const filtered = deals.filter(d => {
            // Support both old keys and new keys
            const city = d.city || d.location_city || "";
            const type = d.type || d.category || "";

            return (cityValue === "" || city === cityValue) &&
                   (typeValue === "" || type === typeValue);
        });

        dealList.innerHTML = filtered.map(d => {
            // Safely map both schemas:
            const name = d.name || d.brand || "Unknown place";
            const city = d.city || d.location_city || "Unknown";
            const type = d.type || d.category || "Other";
            const freebie = d.freebie || d.deal_title || "Birthday freebie";
            const conditions = d.conditions || d.requirements || "See location for details";
            const link = d.link || "#";

            return `
                <div class="deal-card">
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
