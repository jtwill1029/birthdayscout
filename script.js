async function loadDeals() {
    const dealList = document.getElementById("dealList");
    const cityFilter = document.getElementById("cityFilter");
    const typeFilter = document.getElementById("typeFilter");

    // Fetch the JSON file
    const response = await fetch("deals.json");
    const deals = await response.json();

    function render() {
        const city = cityFilter.value;
        const type = typeFilter.value;

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
                <a href="${d.link}" target="_blank" class="btn">View Offer</a>
            </div>
        `).join("");
    }

    cityFilter.addEventListener("change", render);
    typeFilter.addEventListener("change", render);

    render();
}

loadDeals();
