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
        tbody.innerHTML = '';  // Očisti tablicu prije prikaza novih podataka
    
        days.forEach(day => {
            const row = document.createElement('tr');
    
            // Korištenje textContent za unos podataka, tako da ne bude zabune s HTML kodom
            const tdId = document.createElement('td');
            tdId.textContent = day.id;
    
            const tdTemp = document.createElement('td');
            tdTemp.textContent = day.temperature;
    
            const tdHumidity = document.createElement('td');
            tdHumidity.textContent = day.humidity;
    
            const tdWindSpeed = document.createElement('td');
            tdWindSpeed.textContent = day.wind_speed;
    
            const tdSeason = document.createElement('td');
            tdSeason.textContent = day.season;
    
            const tdLocation = document.createElement('td');
            tdLocation.textContent = day.location;
    
            const tdWeatherType = document.createElement('td');
            tdWeatherType.textContent = day.weather_type;
    
            const tdButton = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = 'Add to Cart';
            button.classList.add('add-to-cart');
            button.setAttribute('data-id', day.id);
            tdButton.appendChild(button);
    
            // Dodavanje svakog td u red
            row.appendChild(tdId);
            row.appendChild(tdTemp);
            row.appendChild(tdHumidity);
            row.appendChild(tdWindSpeed);
            row.appendChild(tdSeason);
            row.appendChild(tdLocation);
            row.appendChild(tdWeatherType);
            row.appendChild(tdButton);
    
            tbody.appendChild(row);
        });
    
        // Dodavanje event listenera na dugmadi
        const buttons = tbody.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                const item = sviFilmovi.find(day => day.id === itemId);
                if (item) {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-id', item.id);  // Dodavanje id-a za praćenje
                    listItem.textContent = `ID: ${item.id}, Temperature: ${item.temperature}, Humidity: ${item.humidity}, Wind Speed: ${item.wind_speed}`;
                    
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.classList.add('remove-from-cart');
                    listItem.appendChild(removeButton);
                    
                    kosarica.appendChild(listItem);
    
                    // Logika za uklanjanje stavke iz košarice
                    removeButton.addEventListener('click', function() {
                        kosarica.removeChild(listItem);
                    });
                }
            });
        });
    }
    

document.getElementById('filter-temperature').addEventListener('input', function() {
    // Ažuriraj prikaz temperature prema vrijednosti klizača
    const temperatureValue = this.value;
    document.getElementById('temperature-value').textContent = `${temperatureValue}°C`;
});

document.getElementById('primijeni-filtere').addEventListener('click', () => {
    const selectedSeason = document.getElementById('filter-genre').value;
    const temperatureInput = document.getElementById('filter-temperature').value; // Dobijamo vrijednost iz klizača

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
