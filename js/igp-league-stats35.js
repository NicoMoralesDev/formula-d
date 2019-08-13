/**
 * Created by Nico on 18/4/2019.
 */

var document;

var dataController = (function() {
    
    var directoryPath = "jsonData/";
    var separator = "/";
    
    //Current Data Loaded
    var currentData = {
        leagueId: 0,
        season: 0,
        tier: "",
        lang: "SPANISH"
    }
    
    //Create object
    var data = {
        leagueInfo: null,
        calendar: null,
        tierStats: null,
        drivers: null,
        teams: null
    };
    
    var lang = {
        spanish: {
            menu: {
                '%M_HOME%': "Inicio",
                '%M_LEAGUES%': "Ligas",
                '%M_SEASONS%': "Temporadas",
                '%M_TIERS%': "Categorías",
                '%M_SEASON %': "Temporada ",
                '%M_ROOKIE%': "Novato",
                '%M_PRO%': "Profesional",
                '%M_ELITE%': "Élite"
            },
            title: {
                '%T_DRIVERWINS%': "Victorias de Pilotos",
                '%T_TEAMWINS%': "Victorias de Equipos",
                '%T_DRIVERPOLES%': "Poles de Pilotos",
                '%T_TEAMPOLES%': "Poles de Equipos",
                '%T_POINTEVOLUTION%': "Evolución de Puntos de Equipos",
                '%T_DRIVERSTANDINGS%': "Posiciones de Pilotos",
                '%T_DRIVERSTATS%': "Estadísticas de Pilotos",
                '%T_TEAMSTANDINGS%': "Posiciones de Equipos",
                '%T_TEAMSTATS%': "Estadísticas de Equipos",
                '%T_HEATMAP%': "Mapa de Calor",
                '%T_CALENDAR%': "Calendario",
                '%T_POINTSYSTEM%': "Sistema de Puntos"
            },
            header: {
                '%H_DRIVER%': "PILOTO",
                '%H_TEAM%': "EQUIPO",
                '%H_POINTS%': "PUNTOS",
                '%H_WINS%': "V",
                '%H_TOP3%': "T3",
                '%H_TOP10%': "T10",
                '%H_POLES%': "PP",
                '%H_FASTESTLAPS%': "VR",
                '%H_PARTICIPATIONS%': "P",
                '%H_RACE%': "Carrera",
                '%H_DATE%': "Fecha",
                '%H_LAPS%': "Vueltas",
                '%H_DURATION%': "Duración",
                '%H_WINNER%': "Ganador",
                '%H_FASTESTLAP%': "Vuelta Rápida",
                '%H_FASTESTLAPTIME%': "Tiempo de VR",
                '%H_POLE%': "Pole",
                '%H_POLETIME%': "Tiempo de Pole",
                '%H_POSITION%': "Posición",
                '%H_POINTS2%': "Puntos"
            },
            circuit: {
                AUSTRALIA: "Australia",
                MALAYSIA: "Malasia",
                CHINA: "China",
                BAHRAIN: "Bahréin",
                SPAIN: "España",
                MONACO: "Mónaco",
                TURKEY: "Turquía",
                GREATBRITAIN09: "Gran Bretaña 09",
                GERMANY: "Alemania",
                HUNGARY: "Hungría",
                EUROPE: "Europa",
                BELGIUM: "Bélgica",
                ITALY: "Italia",
                SINGAPORE: "Singapur",
                JAPAN: "Japón",
                BRAZIL: "Brasil",
                ABUDHABI: "Abu Dhabi",
                GREATBRITAIN19: "Gran Bretaña 19"
            }
        }
    }    
    
    var loadFiles = function(leagueId, season, tier, lang) {
        
        currentData.leagueId = leagueId;
        currentData.season = season;
        currentData.tier = tier;
        currentData.lang = lang;
        
        var calendar, tierStats;
        
        leagueInfo = loadLeagueInfo(leagueId);
        calendar = loadCalendar(leagueId, season);
        tierStats = loadTierStats(leagueId, season, tier);
        
        //Set Data
        data.leagueInfo = leagueInfo;
        data.calendar = setCalendar(calendar);
        //setCalendar(calendar);
        //data.calendar = calendar;
        data.tierStats = tierStats;
        
        
        data.drivers = setAllDrivers(tierStats.standings.driverStandings);
        data.teams = setAllDrivers(tierStats.standings.teamStandings);
    }
    
    var loadFile = function(filePath) {
        
        var jsonObject;
        var rawFile = new XMLHttpRequest();     
        
        rawFile.open("GET", filePath, false);
        rawFile.onreadystatechange = function() {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    jsonObject = JSON.parse(allText);
                    //console.log(jsonObject); //for debug
                }
            }
        }
        rawFile.send(null);
        
        return jsonObject;
    }
    
    var loadLeagueInfo = function(leagueId) {
        var data, filePath;
        
        filePath = directoryPath + separator + leagueId + separator + "LeagueInfo.json";   
        data = loadFile(filePath);
        
        return data;
    }
    
    var loadCalendar = function(leagueId, season) {
        var data, filePath;
        
        filePath = directoryPath + separator + leagueId + separator + season + separator + "Calendar.json";   
        data = loadFile(filePath);
        
        return data;
    }
    
    var loadTierStats = function(leagueId, season, tier) {
        var data, filePath;
        
        filePath = directoryPath + separator + leagueId + separator + season + separator + tier + separator + "TierStats.json";   
        data = loadFile(filePath);
        
        return data;
    }
    
    var loadDriverOrTeam = function(id) {
        var data, filePath;
        
        filePath = directoryPath + separator + currentData.leagueId + separator + currentData.season + separator + currentData.tier + separator + id + ".json";   
        data = loadFile(filePath);
        
        return data; 
    }

    var getRace = function(circuit) {
        var data, filePath;
        
        filePath = directoryPath + separator + currentData.leagueId + separator + currentData.season + separator + currentData.tier + separator + circuit + ".json";   
        data = loadFile(filePath);
        
        return data; 
    }
    
    var setCalendar = function(calendarData) {
        
        var orderedCalendar = new Map();        
        var racesOrder = calendarData.racesOrder;
        var races = calendarData.races;
        
        
        for(var i = 1; i <= Object.keys(racesOrder).length; i++) {
            
            var reference = racesOrder[i];
            var circuit = lang.spanish.circuit[racesOrder[i]];
            var date = races[racesOrder[i]]

            var raceInfo = {
                reference: reference,
                circuit: circuit,
                date: date
            }
            
            orderedCalendar.set(i, raceInfo);
        }
        
        return orderedCalendar;
    }
    
    var setAllDrivers = function(driverStandings) {
        
        var drivers = new Map();
        
        for (var i = 1; i <= Object.keys(driverStandings).length; i++) {
            drivers.set(i, loadDriverOrTeam(driverStandings[i]));       
        }
        
        return drivers;
    }
    
    var setAllTeams = function(teamStandings) {
        
        var teams = new Map();
        
        for (var i = 1; i <= Object.keys(teamStandings).length; i++) {
            teams.set(i, loadDriverOrTeam(teamStandings[i]));       
        }
        
        return teams;
    }
    
    return {
        //Load Data
        load: function(leagueId, season, tier) {
            loadFiles(leagueId, season, tier);
        },
             
        getData: function() {
            return {
                leagueInfo: data.leagueInfo,
                calendar: data.calendar,
                tierStats: data.tierStats,
                teams: data.teams,
                drivers: data.drivers
            };
        },
        
        getDriverOrTeam: function(id) {
            
            return loadDriverOrTeam(id);
        },
        
        getRace: function(circuit) {
            return getRace(circuit);
        }
        
        //Get Leagues
        
        //Get Seasons from current league
        
        //Get Tiers from current league and season
        
        //Get Drivers from current league, season and tier
        
        //Get Teams from current league, season and tier
        
        //Get Calendar from current season
        
        //Get Point System from current season
        
        //Get statistics from current season and tier (victories, podiums, etc).
        
    }
})();

var UIController = (function() {
         
    var DOMstrings = {
        driverStandingsPanel: 'driverStandingsBox',
        teamStandingsPanel: 'teamStandingsBox',
        driverWinsContainer: 'driverWins',
        teamWinsContainer: 'teamWins',
        driverPolesContainer: 'driverPoles',
        teamPolesContainer: 'teamPoles',
        teamPointEvolutionContainer: 'teamPointEvolution',
        driverStandingsContainer: 'driverStandings',
        driverSeasonTotalsContainer: 'driverSeasonTotals',
        teamStandingsContainer: 'teamStandings',
        teamSeasonTotalsContainer: 'teamSeasonTotals',
        heatMapContainer: 'heatMap',
        calendarContainer: 'calendar',
        pointSystemContainer: 'pointSystem',
        chevronDownIcon: 'ion-chevron-down',
        chevronUpIcon: 'ion-chevron-up',
        openMenuSelector: '.open-menu-button',
        tabSelector: '.tab',
        menuContainer: '.menu',
        driverStandingsTable: '#driverStandingsBox',
        driverSeasonTotalsTable: '#driverSeasonTotalsBox tbody',
        teamStandingsTable: '#teamStandingsBox',
        teamSeasonTotalsTable: '#teamSeasonTotalsBox tbody',
        heatMapTable: "#heatMapBox tbody",
        calendarTable: "#calendarBox tbody",
        pointSystemTable: '#pointSystemBox tbody'
    };
    
    var swapIcons = function(iconElement, icon1, icon2) {
        
        if (iconElement.classList.contains(icon1)) {
            iconElement.classList.remove(icon1);
            iconElement.classList.add(icon2);
        } else if (iconElement.classList.contains(icon2)) {
            iconElement.classList.remove(icon2);
            iconElement.classList.add(icon1);
        }
    };
    
    var toggleClass = function(elementID, className) {
        
        var el = document.getElementById(elementID);
        el.classList.toggle(className);
    };
    
    var hideAccordion = function(id) {
        var el = document.getElementById(id);
        var chevronIcon = el.previousElementSibling.childNodes[3];

        el.classList.remove('show');

        if (chevronIcon.className === DOMstrings.chevronUpIcon) {
            chevronIcon.classList.remove(DOMstrings.chevronUpIcon);
            chevronIcon.classList.add(DOMstrings.chevronDownIcon);
        }
    }
    
        var addDriverStandingsRow = function(obj) {
        var html, element, percentage;

        percentage = Math.round(obj.totalPoints / obj.leaderPoints * 100) + '%';
        element = DOMstrings.driverStandingsTable;

        // Create HTML string with placeholder text
        html = '<div class="driver"> <div class="w3-row"> <div class="w3-col margin-left-5" style="width: 40%;"><span class="flag-icon flag-icon-%nationality%"></span><span> <abbr title="%fullName%">%driverName%</abbr></span> </div> <div class="w3-col w3-container" style="width: 40%;"> <div class="w3-light-grey w3-round"> <div class="progress-bar w3-round" style="height:20px;width:%percentage%"></div> </div> </div> <div class="w3-col" style="width: 7%;"> <span>%totalPoints%</span> </div> <button class="w3-col w3-right arrow-collapsible" style="width: 5%;" id="driver-%pos%">  <i class="ion-chevron-down down"></i> </button> </div> <div class="points-per-race" id="driver-panel-%pos%"> <canvas id="driverChart%pos%" style="height: 300px; width: 100%;"></canvas> </div> </div>';

        // Replace the placeholder text with some actual data
        html = html.replace('%pos%', obj.position);
        html = html.replace('%pos%', obj.position);
        html = html.replace('%pos%', obj.position);
        html = html.replace('%nationality%', obj.nationality);
        html = html.replace('%fullName%', obj.fullName);
        html = html.replace('%driverName%', obj.driverName);
        html = html.replace('%percentage%', percentage);
        html = html.replace('%totalPoints%', obj.totalPoints);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }
    
    var addDriverStatsRow = function(obj) {
        var html, element;
        
        element = DOMstrings.driverSeasonTotalsTable;
                
        // Create HTML string with placeholder text
        html = '<tr> <td class="first-column"><abbr title="%fullName%">%driverName%</abbr></td> <td>%wins%</td> <td>%podiums%</td> <td>%topTens%</td> <td>%pole%</td> <td>%fastestLaps%</td> <td>%participations%</td> <!--<td></td><td></td><td></td>--> </tr>';
        
        // Replace the placeholder text with some actual data
        html = html.replace('%fullName%', obj.fullName);
        html = html.replace('%driverName%', obj.shortenedName);
        html = html.replace('%wins%', obj.wins);
        html = html.replace('%podiums%', obj.podiums);
        html = html.replace('%topTens%', obj.topTens);
        html = html.replace('%pole%', obj.pole);
        html = html.replace('%fastestLaps%', obj.fastestLaps);
        html = html.replace('%participations%', obj.participations);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }
    
    var addTeamStandingsRow = function(obj) {
        var html, element, percentage;

        percentage = Math.round(obj.totalPoints / obj.leaderPoints * 100) + '%';
        element = DOMstrings.teamStandingsTable;

        // Create HTML string with placeholder text
        html = '<div class="team"> <div class="w3-row"> <div class="w3-col margin-left-5" style="width: 40%;"><span class="flag-icon flag-icon-%nationality%"></span> <span>%teamName%</span>  </div> <div class="w3-col w3-container" style="width: 40%;"> <div class="w3-light-grey w3-round"> <div class="progress-bar w3-round" style="height:20px;width:%percentage%"></div> </div> </div> <div class="w3-col" style="width: 7%;"> <span>%totalPoints%</span> </div> <button class="w3-col w3-right arrow-collapsible" style="width: 5%;" id="team-%pos%">  <i class="ion-chevron-down down"></i> </button> </div> <div class="points-per-race" id="team-panel-%pos%"> <canvas id="teamChart%pos%" style="height: 300px; width: 100%;"></canvas> </div> </div>';

        // Replace the placeholder text with some actual data
        html = html.replace('%pos%', obj.position);
        html = html.replace('%pos%', obj.position);
        html = html.replace('%pos%', obj.position);
        html = html.replace('%nationality%', obj.nationality);
        html = html.replace('%teamName%', obj.teamName);
        html = html.replace('%percentage%', percentage);
        html = html.replace('%totalPoints%', obj.totalPoints);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }
    
    var addTeamStatsRow = function(obj) {
        var html, element;
        
        element = DOMstrings.teamSeasonTotalsTable;
                
        // Create HTML string with placeholder text
        html = '<tr> <td class="first-column">%teamName%</td> <td>%wins%</td> <td>%podiums%</td> <td>%topTens%</td> <td>%pole%</td> <td>%fastestLaps%</td> <td>%participations%</td> <!--<td></td><td></td><td></td>--> </tr>';
        
        // Replace the placeholder text with some actual data
        html = html.replace('%teamName%', obj.teamName);
        html = html.replace('%wins%', obj.wins);
        html = html.replace('%podiums%', obj.podiums);
        html = html.replace('%topTens%', obj.topTens);
        html = html.replace('%pole%', obj.pole);
        html = html.replace('%fastestLaps%', obj.fastestLaps);
        html = html.replace('%participations%', obj.participations);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', html);
    }
    
    return {
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        modifyIcon: function(icon) {      
            swapIcons(icon, DOMstrings.chevronDownIcon, DOMstrings.chevronUpIcon);
        },
        
        togglePanel: function(panelID) {
            toggleClass(panelID, 'expanded');
        },
        
        toggleContainer: function(containerID) {
            toggleClass(containerID, 'hide');
        },
        
        hideAccordions: function() {
            document.querySelectorAll(DOMstrings.tabSelector).forEach(function(cur) {
                hideAccordion(cur.id);
            }); 
        },
        
        toggleMenuAccordion: function(buttonID) {
            var el = document.getElementById(buttonID);
            var chevronIcon = el.previousElementSibling.childNodes[3];
            
            toggleClass(buttonID, 'show');
            swapIcons(chevronIcon, DOMstrings.chevronDownIcon, DOMstrings.chevronUpIcon);
        },
        
        addDriverStandingsRowData: function(obj) { 
            addDriverStandingsRow(obj);
            addDriverStatsRow(obj);
        },
        
        addTeamStandingsRowData: function(obj) { 
            addTeamStandingsRow(obj);
            addTeamStatsRow(obj);
        },
        
        addHeatMapRowData: function(obj) {
            var html, element;
            
            element = DOMstrings.heatMapTable;
            html = '';
            
            // Create HTML string with placeholder text
            htmlFirst = '<tr> <td class="first-column"><abbr title="%fullName%">%driverName%</abbr></td> ';
            htmlFirst = htmlFirst.replace('%fullName%', obj.fullName);
            htmlFirst = htmlFirst.replace('%driverName%', obj.driverName);
            
            
            for(var i = 1; i <= obj.totalEvents; i++) {
                
                var position = obj.eventsPositions[obj.races.get(i).reference];
                if (position > 10) {
                    position = 32;
                }
                var points = obj.eventsPoints[obj.races.get(i).reference];
                
                if(points || points === 0) {
                    html = html + '<td ' + 'class="pos' + position + '">' + points + '</td> ';
                } else {
                    html = html + '<td></td> ';
                }
            }
            
            htmlLast= '</tr>';
            
            finalHtml = htmlFirst + html + htmlLast;            
                        
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', finalHtml);
        },
        
        addCalendarRowData: function(obj) {
            var html, element;
            
            element = DOMstrings.calendarTable;
            
            // Create HTML string with placeholder text
            html = '<tr> <td>%order%</td> <td>%race%</td> <td>%date%</td> <td>%laps%</td> <td>%duration%</td> <td>%winner%</td> <td>%fastestLapDriver%</td> <td>%fastestLapTime%</td> <td>%poleDriver%</td> <td>%poleTime%</td> </tr>';

            // Replace the placeholder text with some actual data
            html = html.replace('%order%', obj.order);
            html = html.replace('%race%', obj.race);
            html = html.replace('%date%', obj.date);
            html = html.replace('%laps%', obj.laps);
            html = html.replace('%duration%', obj.duration);
            html = html.replace('%winner%', obj.winner);
            html = html.replace('%fastestLapDriver%', obj.fastestLapDriver);
            html = html.replace('%fastestLapTime%', obj.fastestLapTime);
            html = html.replace('%poleDriver%', obj.poleDriver);
            html = html.replace('%poleTime%', obj.poleTime);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        
        displayPointSystem: function(obj) {          
            var html, element;
            
            element = DOMstrings.pointSystemTable;  
            for(var i = 1; i <= 10; i++) {
                // Create HTML string with placeholder text
                html = '<tr> <td>%pos%</td> <td>%points%</td> </tr>';
            
                // Replace the placeholder text with some actual data
                html = html.replace('%pos%', i);
                html = html.replace('%points%', obj[i]);

                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', html);
            }
        }
        
    };
})();

var chartController = (function(dataController) {
    
    var DOMstrings = {
        driverWinsChart: 'driverWinsChart',
        teamWinsChart: 'teamWinsChart',
        driverPolesChart: 'driverPolesChart',
        teamPolesChart: 'teamPolesChart',
        pointEvolutionChart: 'pointEvolutionChart'
    }

    var ChartConfig = function(type, data, options) {
        this.type = type;
        this.data = data;
        this.options = options;
    };
    
    var Chart = function(ctx, config) {
        this.ctx = ctx;
        this.config = config;
    };
    
    var appData, chartsData, chartFontColor, chartBorderColor, chartGridLinesColor, pointBorderColor, borderWidth, pointHitRadius, pointBorderWidth, fill;
    var charts = {};  
    
    chartFontColor = chartBorderColor = chartGridLinesColor = '#333';
    pointBorderColor = '#000';
    borderWidth = pointHitRadius = pointBorderWidth = 6;
    fill = false;
    
    var types = {
        doughnut: 'doughnut',
        line: 'line',
        bar: 'bar'
    }
    
    var options = {
        doughnut: {
            legend: {
                position: "bottom",
                labels: {
                    fontColor: chartFontColor
                }
            },
            circumference: 3.14,
            rotation: 3.14
        },
        line: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        fontColor: chartFontColor
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: chartFontColor
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }]
            },
            legend: {
                position: "bottom",
                labels: {
                    fontColor: chartFontColor
                }
            }
        },
        driverBar: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: chartFontColor,
                        suggestedMax: 25
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: chartFontColor
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }]
            },
            legend: {
                display: false,
            }
        },
        teamBar: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: chartFontColor,
                        suggestedMax: 43
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: chartFontColor
                    },
                    gridLines: {
                        color: chartGridLinesColor
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    }  
    
    var createDoughnutCharts = function() {
        
        createDriverWinsChart();
        createTeamWinsChart();
        createDriverPolesChart();
        createTeamPolesChart();
    }
    
    var createDriverWinsChart = function() {
        var tierStats, driverWins;
        
        tierStats = appData.tierStats;
        
        //Add datasets
        var wins = [];
        var colors = [];
        var labels = [];
        driverWins = tierStats.driverWins
        for(const [driverId, amount] of Object.entries(driverWins)) {
            
            var driver = dataController.getDriverOrTeam(driverId);
            
            wins.push(amount);
            
            driverName = driver.driverName;
            splitName = driverName.split(' ');
            firstName = splitName[0];
            lastName = splitName[1];
            firstName = firstName.substr(0, 1);
            
            driverName = firstName + " " + lastName;
            teamName = driver.teamName;
            labels.push(driverName + " (" + teamName + ")");
            colors.push(driver.color);
        }
        
        //Prepare data for chart
        var data = {
            labels: labels,
            datasets: [{
                data: wins,
                backgroundColor: colors,
                borderColor: chartBorderColor
            }]
        }

        //Create Chart
        createChart(DOMstrings.driverWinsChart, types.doughnut, data, options.doughnut);
    }
    
    var createTeamWinsChart = function() {
        var tierStats, teamWins;
        
        tierStats = appData.tierStats;
        
        //Add datasets
        var wins = [];
        var colors = [];
        var labels = [];
        teamWins = tierStats.teamWins;
        for(const [teamId, amount] of Object.entries(teamWins)) {
            
            var team = dataController.getDriverOrTeam(teamId);
            
            wins.push(amount);
            
            var teamName = team.teamName;
            labels.push(teamName);
            colors.push(team.color);
        }
        
        //Prepare data for chart
        var data = {
            labels: labels,
            datasets: [{
                data: wins,
                backgroundColor: colors,
                borderColor: chartBorderColor
            }]
        }

        //Create Chart
        createChart(DOMstrings.teamWinsChart, types.doughnut, data, options.doughnut);
    }
    
    var createDriverPolesChart = function() {
        var tierStats, driverPoles;
        
        tierStats = appData.tierStats;
        
        //Add datasets
        var poles = [];
        var colors = [];
        var labels = [];
        driverPoles = tierStats.driverPoles
        for(const [driverId, amount] of Object.entries(driverPoles)) {
            
            var driver = dataController.getDriverOrTeam(driverId);
            
            poles.push(amount);
            
            driverName = driver.driverName;
            splitName = driverName.split(' ');
            firstName = splitName[0];
            lastName = splitName[1];
            firstName = firstName.substr(0, 1);
            
            driverName = firstName + " " + lastName;
            teamName = driver.teamName;
            labels.push(driverName + " (" + teamName + ")");
            colors.push(driver.color);
        }
        
        //Prepare data for chart
        var data = {
            labels: labels,
            datasets: [{
                data: poles,
                backgroundColor: colors,
                borderColor: chartBorderColor
            }]
        }

        //Create Chart
        createChart(DOMstrings.driverPolesChart, types.doughnut, data, options.doughnut); 
    }
    
    var createTeamPolesChart = function() {
        var tierStats, teamPoles;
        
        tierStats = appData.tierStats;
        
        //Add datasets
        var poles = [];
        var colors = [];
        var labels = [];
        teamPoles = tierStats.teamPoles
        for(const [teamId, amount] of Object.entries(teamPoles)) {
            
            var team = dataController.getDriverOrTeam(teamId);
            
            poles.push(amount);
            
            teamName = team.teamName;
            labels.push(teamName);
            colors.push(team.color);
        }
        
        //Prepare data for chart
        var data = {
            labels: labels,
            datasets: [{
                data: poles,
                backgroundColor: colors,
                borderColor: chartBorderColor
            }]
        }

        //Create Chart
        createChart(DOMstrings.teamPolesChart, types.doughnut, data, options.doughnut);
    }
                       
    var createPointEvolutionChart = function() {
        var calendar, teams; 
        
        calendar = appData.calendar;
        teams = appData.teams;
        
        //Set Calendar
        var labels = [""];
        for(var i = 1; i <= calendar.size; i++) {
            labels.push(calendar.get(i).circuit);
        }
        
        //Add datasets for top 5 teams
        var dataSets = [];     
        for(i = 1; i <= 5; i++) {

            var team = teams.get(i);
            var eventsPoints = team.eventsPoints;
            
            var points = [0];
            var totalPoints = 0;
            //Calculate total point for every round
            for(var j = 1; j <= calendar.size; j++) {
                totalPoints += eventsPoints[calendar.get(j).reference];
                points.push(totalPoints);
            }

            //Prepare dataset for current team
            dataSet = {
                    label: team.teamName,
                    data: points,
                    backgroundColor: team.color,
                    borderColor: team.color,
                    pointBackgroundColor: team.color,
                    pointBorderColor: pointBorderColor,
                    borderWidth: borderWidth,
                    pointHitRadius: pointHitRadius,
                    pointBorderWidth: pointBorderWidth,
                    fill: fill
            }
            dataSets.push(dataSet);
        }
        
        var data = {
            labels: labels,
            datasets: dataSets
        }
        
        //Create Chart
        createChart(DOMstrings.pointEvolutionChart, types.line, data, options.line);
    }
    
    var createAllDriverCharts = function() {
        var drivers; 
        
        drivers = appData.drivers;      
        
        for(var i = 1; i <= drivers.size; i++) {
            driver = drivers.get(i);
            createDriverChart(i, driver);
        }
    }
    
    var createDriverChart = function(pos, driver) {
        var calendar; 
        
        calendar = appData.calendar;

        //Set Calendar
        var labels = []   
        for(var i = 1; i <= calendar.size; i++) {
            labels.push(calendar.get(i).circuit);
        }
        
        //Add points for every round
        var points = [];
        eventsPoints = driver.eventsPoints;
        for(var j = 1; j <= calendar.size; j++) {
            points.push(eventsPoints[calendar.get(j).reference]);
        }
        
        //var color = getDriverColor(driver.igpDriverId);
        
        var data = {
            labels: labels,
            datasets: [{
                label: driver.driverName,
                data: points,
                backgroundColor: '#000000',
                borderColor: '#000000',
                pointBackgroundColor: '#000000',
                pointBorderColor: '#000000',
                borderWidth: 3,
                pointHitRadius: 3,
                pointBorderWidth: 3,
                fill: false
            }]
        }
        
        var chartId = 'driverChart' + pos;
        
        //Create Chart
        createChart(chartId, types.bar, data, options.driverBar);
    }
    
//    var getDriverColor =  function (driverId) {
//        
//        console.log(appData.teams);
//        console.log(driverId);
//    }
    
    var createAllTeamCharts = function() {
        var calendar, teams; 
        
        calendar = appData.calendar;
        teams = appData.teams;      
        
        for(var i = 1; i <= teams.size; i++) {
            team = teams.get(i);
            createTeamChart(i, team);
        }
    }
    
    var createTeamChart = function(pos, team) {
        var calendar; 
        
        calendar = appData.calendar;

        //Set Calendar
        var labels = []   
        for(var i = 1; i <= calendar.size; i++) {
            labels.push(calendar.get(i).circuit);
        }
        
        //Add points for every round
        var points = [];
        eventsPoints = team.eventsPoints;
        for(var j = 1; j <= calendar.size; j++) {
            points.push(eventsPoints[calendar.get(j).reference]);
        }
                
        var data = {
            labels: labels,
            datasets: [{
                label: team.teamName,
                data: points,
                backgroundColor: team.color,
                borderColor: team.color,
                pointBackgroundColor: team.color,
                pointBorderColor: team.color,
                borderWidth: 3,
                pointHitRadius: 3,
                pointBorderWidth: 3,
                fill: false
            }]
        }
        
        var chartId = 'teamChart' + pos;
        
        //Create Chart
        createChart(chartId, types.bar, data, options.teamBar);
    }
    
    var createChart = function(chartId, type, data, options) {
        
        //Set context
        var ctx = document.getElementById(chartId).getContext('2d');
        
        //Set config
        var chartConfig = new ChartConfig(type, data, options);
       
        //Create Chart object
        var newChart = new Chart(ctx, chartConfig);
        
        //Add chart to charts collection
        charts[chartId] = newChart;
    }
    
    
    return {    
        load: function() {
            appData = dataController.getData();
            createDoughnutCharts();
            createPointEvolutionChart();
            createAllDriverCharts();
            createAllTeamCharts();
        },
        
        getCharts: function() {
            return charts;
        }
    };
})(dataController);

var appController = (function(dataController, UIController, chartController) {
    
    var setupEventListeners = function() {
        
        var DOM = UIController.getDOMstrings();
            
        document.getElementById(DOM.driverStandingsPanel).addEventListener('click', expandPanel);
        document.getElementById(DOM.teamStandingsPanel).addEventListener('click', expandPanel);      
        document.getElementById(DOM.driverWinsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.teamWinsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.driverPolesContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.teamPolesContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.teamPointEvolutionContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.driverStandingsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.driverSeasonTotalsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.teamStandingsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.teamSeasonTotalsContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.heatMapContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.calendarContainer).addEventListener('click', hideContainer);
        document.getElementById(DOM.pointSystemContainer).addEventListener('click', hideContainer);
        
        document.querySelector(DOM.openMenuSelector).addEventListener('click', openMenu);
        document.querySelector(DOM.menuContainer).addEventListener('click', openAccordion);
    };
        
    var expandPanel = function(event) {
        var elementID, chevronIcon, target;
        
        target = event.target;
        if (target.tagName === 'BUTTON' || target.tagName === 'I') {
        
            //Get Elements
            if (target.parentNode.tagName === 'BUTTON') {
                chevronIcon = target.parentNode.childNodes[1];
                elementID = target.parentNode.parentNode.nextElementSibling.id;
            } else if (target.parentNode.tagName === 'DIV') {
                chevronIcon = target.parentNode.childNodes[7].childNodes[1];
                elementID = target.parentNode.nextElementSibling.id;
            }

            //Modify Icon
            if(chevronIcon) {
                UIController.modifyIcon(chevronIcon);
            }
            
            //Expand or Collapse Panel
            if (elementID) {
                UIController.togglePanel(elementID);
            }
        }
    };
        
    var hideContainer = function(event) {      
        var containerID;
        
        containerID = event.target.id + "Box";    
        if (containerID) {
            UIController.toggleContainer(containerID);
        }
    }
    
    var openMenu = function() {
        
        //Hide/Close all opened accordions in Menu
        UIController.hideAccordions();
        
        //Open or Close Menu
        document.getElementById("myMenu").classList.toggle('show');
    }
    
    var openAccordion = function(event) {
        var targetEl, buttonID;
        
        target = event.target;
        if (target.tagName === 'BUTTON' || target.tagName === 'I') {
            
            //Get Elements
            if (target.tagName === 'I') {
                target = target.parentNode;
            }
            
            //Get ID from submenu
            buttonID = target.nextElementSibling.id;
            
            //Expand or Collapse Accordion
            if (buttonID) {
                UIController.toggleMenuAccordion(buttonID);
            }
        }
    }
    
    var renderPage = function() {
        //ctrlTierSeasonInfo();
        //ctrlWinners();
        //ctrlPodiums();        
        ctrlPointEvolution();
        ctrlDriverStandings();
        ctrlTeamStandings();
        ctrlHeatMap();
        ctrlCalendar();
        ctrlPointSystem();
    }
    
    var ctrlPointEvolution = function() {
        var data, driverStandings;
        
        //Get Data
        data = dataController.getData();
        driverStandings = data.tierStats.standings.driverStandings;
        calendar = data.calendar;
//        racesOrder = data.calendar.racesOrder;
//        races = data.calendar.races;
//        totalEvents = data.calendar.totalEvents;
        
        //Send Data for Chart
    }
    
    var ctrlDriverStandings = function() {
        var data, driverStandings;
        
        //Get Data
        data = dataController.getData();
        driverStandings = data.tierStats.standings.driverStandings;
        
        for(var i = 1; i <= Object.keys(driverStandings).length; i++) {
            
            var position = i;
            var driver = dataController.getDriverOrTeam(driverStandings[i]);
            var nationality = driver.nationality;
            var driverName = driver.driverName;
            var fullName = fullNameDesc(driver.driverName, driver.teamName);
            var totalPoints = driver.totalPoints;
            var eventPoints = driver.eventPoints;
            var wins = driver.wins;
            var pole = driver.poles;
            var podiums = driver.podiums;
            var topTens = driver.topTens;
            var fastestLaps = driver.fastestLaps;
            var participations = driver.participations;
            //var finishedRaces = driver.finishedRaces;
            //var dnfs = driver.dnfs;
            if(i === 1) {
               var leaderPoints = totalPoints;
            }
            
            var rowData = {
                position: position,
                driverName: nameShortener(driverName, false),
                shortenedName: nameShortener(driverName, true),
                nationality: nationality,
                totalPoints: totalPoints,
                eventsPoints: eventPoints,
                wins: wins,
                pole: pole,
                podiums: podiums,
                topTens: topTens,
                fastestLaps: fastestLaps,
                participations: participations,
                leaderPoints: leaderPoints,
                fullName: fullName
            }
            
            //Send data to UI
            UIController.addDriverStandingsRowData(rowData);
        }  
    }
    
    var ctrlTeamStandings = function() {
        var data, teamStandings;
        
        //Get Data
        data = dataController.getData();
        teamStandings = data.tierStats.standings.teamStandings;
        
        for(var i = 1; i <= Object.keys(teamStandings).length; i++) {
            
            var position = i;
            var team = dataController.getDriverOrTeam(teamStandings[i]);
            var nationality = team.nationality;
            var teamName = team.teamName;
            var totalPoints = team.totalPoints;
            var eventPoints = team.eventPoints;
            var wins = team.wins;
            var pole = team.poles;
            var podiums = team.podiums;
            var topTens = team.topTens;
            var fastestLaps = team.fastestLaps;
            var participations = team.participations;
            //var finishedRaces = team.finishedRaces;
            //var dnfs = team.dnfs;
            if(i === 1) {
               var leaderPoints = totalPoints;
            }
            
            var rowData = {
                position: position,
                nationality: nationality,
                teamName: teamName,
                totalPoints: totalPoints,
                eventsPoints: eventPoints,
                wins: wins,
                pole: pole,
                podiums: podiums,
                topTens: topTens,
                fastestLaps: fastestLaps,
                participations: participations,
                leaderPoints: leaderPoints
            }
            
            //Send data to UI
            UIController.addTeamStandingsRowData(rowData);
        } 
    }
    
    var ctrlHeatMap = function() {
        var data, driverStandings, racesOrder, totalEvents;      
        
        //Get Data
        data = dataController.getData();
        driverStandings = data.tierStats.standings.driverStandings;
        calendar = data.calendar;
        totalEvents = calendar.size;
        
        for(var i = 1; i <= Object.keys(driverStandings).length; i++) {
            
            var driver = dataController.getDriverOrTeam(driverStandings[i]);
            var driverName = nameShortener(driver.driverName, false);
            var fullName = fullNameDesc(driver.driverName, driver.teamName);
            var eventsPositions = driver.eventsPositions;
            var eventsPoints = driver.eventsPoints;
            
            var rowData = {
                driverName: driverName,
                eventsPositions: eventsPositions,
                eventsPoints: eventsPoints,
                races: calendar,
                totalEvents: totalEvents,
                fullName: fullName
            }
            
            //Send data to UI
            UIController.addHeatMapRowData(rowData);
        }
    }
    
    var fullNameDesc = function(driverName, teamName) {
        
        return driverName + " (" + teamName + ")";
    }
    
    var nameShortener = function(name, shortestVersion) {
        var splitName, firstName, lastName; 
        
        splitName = name.split(' ');
        firstName = splitName[0];
        lastName = splitName[1]; //Check if has more than 1 lastname.
        
        if(lastName.length > 12) {
            lastName = lastName.substr(0, 12);
        }
        
        firstName = firstName.substr(0, 1);
        if(shortestVersion) {
            lastName = lastName.substr(0, 3).toUpperCase();
        }
        
        return firstName + " " + lastName;
    }
    
    var ctrlCalendar = function() {
        var data, racesOrder, races, totalEvents;
        
        //Get Data
        data = dataController.getData();
        calendar = data.calendar;
        //races = data.calendar.races;
        totalEvents = calendar.size;
        
        for(var i = 1; i <= totalEvents; i++) {
            
            var rowData = {
                order: 0,
                race: "",
                date: "",
                laps: "",
                duration: "",
                winner: "",
                fastestLapDriver: "",
                fastestLapTime: "",
                poleDriver: "",
                poleTime: ""
            }
            
            var reference = calendar.get(i).reference;
            var circuit = calendar.get(i).circuit;
            var raceDate = calendar.get(i).date;
            
            rowData.order = i;
            rowData.race = circuit;
            rowData.date = raceDate;
            
            if(raceDate === 'Finished') {
                
                var race = dataController.getRace(reference);
                
                rowData.laps = race.laps;
                rowData.duration = race.duration;
                var winnerDriver = dataController.getDriverOrTeam(race.winnerDriver).driverName;
                rowData.winner = winnerDriver;
                var fastestLapDriver = dataController.getDriverOrTeam(race.fastestLapDriver).driverName;
                rowData.fastestLapDriver = fastestLapDriver;
                rowData.fastestLapTime = race.fastestLapTime;
                var poleDriver = dataController.getDriverOrTeam(race.poleDriver).driverName;
                rowData.poleDriver = poleDriver;
                rowData.poleTime = race.poleTime;
            }
            
            //Send data to UI
            UIController.addCalendarRowData(rowData);
        }
    }
    
    var ctrlPointSystem = function() {
        
        //Get Data
        var pointSystem = dataController.getData().tierStats.pointSystem;

        //Send data to UI
        UIController.displayPointSystem(pointSystem);
    }
    
    
    
    var renderCharts = function() {
        var chartObjects;
        var charts = [];

        //Get all charts
        chartObjects = chartController.getCharts();
        //console.log(chartObjects);
        
        //Asign charts
        for(const [chartName, chart] of Object.entries(chartObjects)) {
            charts[chartName] = new Chart(chart.ctx, chart.config);
        }
        //console.log(charts);
    }
    
//    var defineMainColor = function() {
//        let root = document.documentElement;
//        
//        root.style.setProperty('--main-color', '#FF5722');
//    };
    

    return {
        init: function(lang) {
            console.log('Application has started.');
            setupEventListeners();
            dataController.load(13600, 35, 'ELITE', lang);
            renderPage();
            chartController.load();
            renderCharts();
        }
    };
})(dataController, UIController, chartController);

var userLang = navigator.language || navigator.userLanguage; 
var lang = userLang.split("-")[1];
appController.init(lang);