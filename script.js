
        // Advanced JavaScript with modern features
        class CountryExplorer {
            constructor() {
                this.apiUrl = 'https://restcountries.com/v3.1';
                this.allCountries = [];
                this.init();
            }

            async init() {
                await this.loadAllCountries();
                this.displayRandomCountries();
            }

            async loadAllCountries() {
                try {
                    this.showLoading();
                    const response = await fetch(`${this.apiUrl}/all`);
                    if (!response.ok) throw new Error('Failed to fetch countries');
                    
                    this.allCountries = await response.json();
                    this.hideLoading();
                } catch (error) {
                    this.showError('Failed to load countries data. Please try again later.');
                    this.hideLoading();
                }
            }

            showLoading() {
                document.getElementById('loadingContainer').style.display = 'block';
            }

            hideLoading() {
                document.getElementById('loadingContainer').style.display = 'none';
            }

            showError(message) {
                const errorElement = document.getElementById('errorMessage');
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 5000);
            }

            formatNumber(num) {
                return new Intl.NumberFormat().format(num);
            }

            formatArea(area) {
                return `${this.formatNumber(area)} km²`;
            }

            getLanguages(languages) {
                if (!languages) return 'N/A';
                return Object.values(languages).join(', ');
            }

            getCurrency(currencies) {
                if (!currencies) return 'N/A';
                const currencyInfo = Object.values(currencies)[0];
                return `${currencyInfo.name} (${currencyInfo.symbol || 'N/A'})`;
            }

            displayCountry(country) {
                const elements = {
                    countryName: document.getElementById('countryName'),
                    officialName: document.getElementById('officialName'),
                    region: document.getElementById('region'),
                    subregion: document.getElementById('subregion'),
                    population: document.getElementById('population'),
                    capital: document.getElementById('capital'),
                    area: document.getElementById('area'),
                    languages: document.getElementById('languages'),
                    currency: document.getElementById('currency'),
                    flagImg: document.getElementById('flagImg'),
                    mapLink: document.getElementById('mapLink'),
                    countryCard: document.getElementById('countryCard')
                };

                // Update all elements
                elements.countryName.textContent = country.name.common;
                elements.officialName.textContent = country.name.official;
                elements.region.textContent = country.region || 'N/A';
                elements.subregion.textContent = country.subregion || 'N/A';
                elements.population.textContent = this.formatNumber(country.population);
                elements.capital.textContent = country.capital?.[0] || 'N/A';
                elements.area.textContent = this.formatArea(country.area || 0);
                elements.languages.textContent = this.getLanguages(country.languages);
                elements.currency.textContent = this.getCurrency(country.currencies);
                elements.flagImg.src = country.flags.png;
                elements.flagImg.alt = `Flag of ${country.name.common}`;
                elements.mapLink.href = country.maps.googleMaps;

                // Show the card
                elements.countryCard.style.display = 'block';
                elements.countryCard.scrollIntoView({ behavior: 'smooth' });
            }

            async searchCountry() {
                const input = document.getElementById('searchInput').value.trim();
                if (!input) {
                    this.showError('Please enter a country name');
                    return;
                }

                try {
                    this.showLoading();
                    const response = await fetch(`${this.apiUrl}/name/${encodeURIComponent(input)}`);
                    
                    if (!response.ok) {
                        throw new Error('Country not found');
                    }

                    const countries = await response.json();
                    this.displayCountry(countries[0]);
                    this.hideLoading();
                    
                } catch (error) {
                    this.showError(`Country "${input}" not found. Please check the spelling and try again.`);
                    this.hideLoading();
                    document.getElementById('countryCard').style.display = 'none';
                }
            }

            displayRandomCountries(count = 12) {
                const grid = document.getElementById('countriesGrid');
                const shuffled = [...this.allCountries].sort(() => 0.5 - Math.random());
                const selectedCountries = shuffled.slice(0, count);

                grid.innerHTML = selectedCountries.map(country => `
                    <div class="country-card-mini" onclick="countryExplorer.displayCountry(${JSON.stringify(country).replace(/"/g, '&quot;')})">
                        <img src="${country.flags.png}" alt="${country.name.common} flag" class="mini-flag">
                        <h3>${country.name.common}</h3>
                        <p><strong>Region:</strong> ${country.region}</p>
                        <p><strong>Population:</strong> ${this.formatNumber(country.population)}</p>
                    </div>
                `).join('');
            }

            handleKeyPress(event) {
                if (event.key === 'Enter') {
                    this.searchCountry();
                }
            }
        }

        // Initialize the application
        const countryExplorer = new CountryExplorer();

        // Global functions for HTML event handlers
        function searchCountry() {
            countryExplorer.searchCountry();
        }

        function handleKeyPress(event) {
            countryExplorer.handleKeyPress(event);
        }

        // Smooth scrolling for navigation links
        document.addEventListener('DOMContentLoaded', function() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Add scroll effect to navbar
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            });
        });

        // Auto-focus search input
        document.getElementById('searchInput').focus();
