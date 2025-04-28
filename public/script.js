let sviFilmovi = [];
const kosarica = document.getElementById('lista-kosarice');
fetch('weather.csv')
    .then(res => res.text())
    .then(csv => {
        const results = Papa.parse(csv, { header: true, skipEmptyLines: true });
        sviFilmovi = results.data.map(day => ({
            id: day['ID'],
            temperature: Number(day['Temperature']),
            humidity: Number(day['Humidity']),
            wind_speed: Number(day['Wind Speed']),
            season: day.Season,
            location: day.Location,
            weather_type: day['Weather Type']
        }));

        const filtered = sviFilmovi.slice(0, 20);
        id1 = '#vrijeme-tablica tbody'
        id2 = '#vrijeme-tablica2 tbody'
        prikaziTablicu(filtered, id1);
        prikaziTablicu(filtered, id2);
    });

    function prikaziTablicu(days, id) {
        const tbody = document.querySelector(id);
        tbody.innerHTML = '';
        for (const dan of days) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dan.id}</td> 
                <td>${dan.temperature}</td> 
                <td>${dan.humidity}</td> 
                <td>${dan.wind_speed}</td> 
                <td>${dan.season}</td> 
                <td>${dan.location}</td> 
                <td>${dan.weather_type}</td>
                <td><button class="add-to-cart" data-id="${dan.id}">Add to Cart</button></td>
            `;
            tbody.appendChild(row);
        }

        const buttons = tbody.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                const item = sviFilmovi.find(day => day.id === itemId);
                if (item) {        
                    const listItem = document.createElement('li');
                    listItem.textContent = `ID: ${item.id}, Temperature: ${item.temperature}, Humidity: ${item.humidity}, Wind Speed: ${item.wind_speed}`;
                    kosarica.appendChild(listItem);
                }
            });
        });
    }

document.getElementById('primijeni-filtere').addEventListener('click', () => {
    const selectedSeason = document.getElementById('filter-genre').value;
    const temperatureInput = document.getElementById('filter-temperature').value;

    const selectedLocation = document.querySelector('input[name="location"]:checked');
    let locationValue = selectedLocation ? selectedLocation.value : "";
    if (locationValue === "none") {
        locationValue = "";
    }

    const filtrirani = sviFilmovi.filter(day => {
        const matchesSeason = selectedSeason === "" || day.season === selectedSeason;
        const matchesTemp = temperatureInput === "" || (day.temperature && Number(day.temperature) >= Number(temperatureInput));
        const matchesLocation = locationValue === "" || day.location === locationValue;

        return matchesSeason && matchesTemp && matchesLocation;
    });

    const sortirani = filtrirani.sort((a, b) => b.temperature - a.temperature);
    prikaziTablicu(sortirani, '#vrijeme-tablica2 tbody');
});

document.getElementById('toggle-kosarica').addEventListener('click', () => {
    const kosarica = document.getElementById('kosarica-lista');
    if (kosarica.style.display === 'none' || kosarica.style.display === '') {
        kosarica.style.display = 'block';
    } else {
        kosarica.style.display = 'none';
    }
});

document.getElementById('potvrdi-kosaricu').addEventListener('click', () => {
    const kosarica = document.getElementById('lista-kosarice');
    kosarica.innerHTML = '';
    document.getElementById('kosarica-lista').style.display = 'none';
    alert('Kosarica je potvrđena!');
});



