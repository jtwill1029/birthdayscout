async function loadDeals() {
    const dealList = document.getElementById("dealList");
    const cityFilter = document.getElementById("cityFilter");
    const typeFilter = document.getElementById("typeFilter");
    const birthdayBanner = document.getElementById("birthdayBanner");

    // Show birthday banner if we have one stored
    const storedBirthday = localStorage.getItem("birthdayScoutBirthday");
    if (storedBirthday && birthdayBanner) {
        const date = new Date(storedBirthday);

        // Format like "March 12"
        const formatted = date.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric"
        });

        birthdayBanner.textContent = `Showing deals for your birthday on ${formatted} 🎂`;
    }

    // Fetch the JSON file with deals
    const response = await fetch("deals.json");
    const deals = await response.json();

    function render() {
        const city = cityFilter ? cityFilter.value : "";
        const type = typeFilter ? typeFilter.value : "";

        const filtered = deals.filter(d =>
            (city === "" || d.city === city) &&
            (type === "" || d.type === type)
        );

        dealList.innerHTML = filtered.map(d => `
            <div class="deal-card">
                <h3>${d.name}</h3>
                <p><strong>City:</strong> ${d.city}</p>
                <p><strong>Type:</strong> ${d.type}</p>
                <p><strong>Freebie:</strong> ${d.freebie}</p>
                <p><strong>Conditions:</strong> ${d.conditions}</p>
                <a href="${d.link}" target="_blank" class="btn">View offer</a>
            </div>
        `).join("");
    }

    if (cityFilter) cityFilter.addEventListener("change", render);
    if (typeFilter) typeFilter.addEventListener("change", render);

    render();
}

loadDeals();
