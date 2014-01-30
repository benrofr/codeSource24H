function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var rennes = new google.maps.LatLng(48.114722, -1.679444);
  var mapOptions = {
    zoom: 9,
    center: rennes
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
}

function objet_XMLHttpRequest()
{
    //On déclare une variable "mavariable" à null
    var mavariable = null;
    //Teste si le navigateur prend en charge les XMLHttpRequest
    if (window.XMLHttpRequest || window.ActiveXObject){
        // Si Internet Explorer alors on utilise les ActiveX
        if(window.ActiveXObject){
            //On teste IE7 ou supérieur
            try{
                mavariable = new ActiveXObject("Msxml2.XMLHTTP");
            }
            //Si une erreur est levée, alors c'est IE 6 ou inférieur
            catch(e){
                mavariable = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        //Navigateurs récents (Firefox, Opéra, Chrome, Safari, ...)
        else{
            mavariable = new XMLHttpRequest();
        }
    }
    //XMLHttpRequest non supporté par le navigateur
    else{
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    //On retourne l'objet mavariable
    return mavariable;
}

function readDoc(nomDoc){
    var read = 'gtfs/'+nomDoc+'.txt';
    test = new objet_XMLHttpRequest();
    test.open("GET",read,false);
    test.send(null);
    var txt=test.responseText.split("\n");
    longueur=txt.length;
    longueur=longueur-1;
    largeur=txt[0].split(",").length;
    laListe= new Array(longueur);
    for (var k=1;k<laListe.length;k++){
        laListe[k] = new Array(largeur);
    }
    for(var i=0;i<longueur;i++){
        var txt2=txt[i].split(",");
        for(var j=0;j<txt2.length;j++){
            if(txt2[j].substring(0,1)=='"'){
                laListe[i][j]=txt2[j];
                //document.write("win ");
            }
        }
    }
    return laListe;
}

function InfoLigne(){
	var table = readDoc('routes');
	//var table = new Array(["0001","test1"],["0002", "test2"]);
	var page = document.getElementById('code');
	var code = "";
	code = code + "<div id= 'slect1'> <p>Liste des ligne : </p><BR>";
	code = code + "<select name='ligne' id ='ligne' onchange = 'listeHoraire ();'>";
	for(var i=1; i<table.length;i++){
		code = code + "<option value="+table[i][0]+">"+table[i][3]+"</option>";
	}
	
	code = code +"</select> </div><BR> <div id= 'select2'></div>";
	page.innerHTML=code;
	
}

function listeHoraire(){
	var partie2 = document.getElementById('select2');
	var code2 ="";
	var selectElmt = document.getElementById("ligne");
	var valeurselectionnee = selectElmt.options[selectElmt.selectedIndex].value;
	var textselectionne = selectElmt.options[selectElmt.selectedIndex].text;
	code2= code2+"<p>Selectionner le jour : </p> <BR><select name='jour' id='jour'>";
	code2 = code2 + "<option value='monday'>Lundi</option>";
	code2 = code2 + "<option value='tuesday'>Mardi</option>";
	code2 = code2 + "<option value='wednesday'>Mercredi</option>";
	code2 = code2 + "<option value='thursday'>Jeudi</option>";
	code2 = code2 + "<option value='friday'>Vendredi</option>";
	code2 = code2 + "<option value='saturday'>Samedi</option>";
	code2 = code2 + "<option value='sunday'>Dimanche</option>";
	code2 = code2 +"</select> <br> <button onclick='generate_horaire();'>Info ligne</button>";
	partie2.innerHTML = code2;
}

function generate_horaire(){

	var selectLigne = document.getElementById("ligne");
	var id_ligne = selectLigne.options[selectLigne.selectedIndex].value;
	var nomLigne = getNomLigne(id_ligne);
	
	var selectJour = document.getElementById("jour");
	var jour = selectJour.options[selectJour.selectedIndex].value;
	
	var tabArrets0 = getArretsLigne(id_ligne,0);
	var tabArrets1 = getArretsLigne(id_ligne,1);
	var tabHoraires0 = getHoraires(id_ligne,jour,0);
	var tabHoraires1 = getHoraires(id_ligne,jour,1);
	
	var tab0 = "<table>";
	for (var i=1;i<tabArrets0.length;i++){
		tab0 = tab0+"<tr>";
		tab0 = tab0+"<th>"+tabArrets0[i][0]+"</th>";
		for (var j=0;j<tabHoraires0.length;j++){
			tab0 = tab0+"<td>"+tabHoraires0[i][j]+"</td>";
		}
		tab0 = tab0+"</tr>";
	}
	tab0 = tab0+"</table>";
	
	var tab1 = "<table>";
	for (var k=1;k<tabArrets1.length;k++){
		tab1 = tab1+"<tr>";
		tab1 = tab1+"<th>"+tabArrets1[k][0]+"</th>";
		for (var l=0;l<tabHoraires1.length;l++){
			tab1 += tab1+"<td>"+tabHoraires1[k][l]+"</td>";
		}
		tab1 = tab1+"</tr>";
	}
	tab1 = tab1+"</table>";
	//var map = calcRoute(tabArrets0);
	
	//google.maps.event.addDomListener(window, 'load', initialize);
	var page = "<div id='nom_ligne'>"+nomLigne+"</div>";
	page = page+"<div id='horaire0'>"+tab0+"</div>";
	page = page+"<div id='horaire1'>"+tab1+"</div>";
	//page = page+"<div id='map'>"+map+"</div>";
	document.getElementById("code").innerHTML = page;
	
}

function calcRoute(tabArrets){

	var start = new google.maps.LatLng(tabArrets[0][1], tabArrets[0][2]);
  var end = new google.maps.LatLng(tabArrets[tabArrets.length -1][1], tabArrets[tabArrets.length -1][2]);
  var waypts = [];
  for (var i = 1; i < tabArrets.length -1; i++) {
      waypts.push({
          location: new google.maps.LatLng(tabArrets[i][1], tabArrets[i][2]),
          stopover:true});
  }

  var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	}
  });
}

function getHoraires (id_ligne, jour, direction) {
	var lesServices = getLesServicesDepuisJour(jour);
	var lesItineraires = getLesItinerairesDepuisServicesEtLigne(lesServices, id_ligne, direction);
	var lesHoraires  = getLesHorairesDepuisItineraires(lesItineraires);

	return lesHoraires;	
}

function getArretsLigne (id_ligne, direction) {
	//Recherche d'un itineraire sur la ligne
	var i=1;
	var trouve = false;
	var itineraire;
	var tousLesItineraires = readDoc('trips');
	while (i<tousLesItineraires.length && !trouve) {
		if (tousLesItineraires[i][2] == id_ligne && direction == tousLesItineraires[i][4]) {
			itineraire = tousLesItineraires[i][0];
			trouve = true;
		}
	}

	//Recherche des horaires de cet itineraire
	var lesArrets = Array();
	var toutesLesHoraires = readDoc('stop_times');
	for (i=1; i<toutesLesHoraires.length; i++) {
		if (toutesLesHoraires[i][0] == itineraire) {
			cpt = parseInt(toutesLesHoraires[i][2]);
			lesArrets[cpt-1] = toutesLesHoraires[1];
		}
	}

	//Recherche des noms des arrets associes
	var nomDesArrets = Array();
	var tousLesArrets = readDoc('stops');
	cpt=0;
	for (i=1; i<tousLesArrets.length; i++) {
		for (var j=0; j<lesArrets.length(); j++) {
			if (tousLesArrets[i][0] == lesArrets[j]){
				nomDesArrets[cpt] = Array(tousLesArrets[i][2], tousLesArrets[i][4], tousLesArrets[i][5]);
				cpt++;
			}
		}
	}

	return nomDesArrets;
}

function getLesServicesDepuisJour(jour) {
	var tousLesServices = readDoc('calendar');
	var j = 0;
	var lesServices = Array();

	for (var i=1; i<lesServices.length; i++) {
		if (jour == "monday") {
			if (tousLesServices[i][1] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "tuesday") {
			if (tousLesServices[i][2] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "wednesday") {
			if (tousLesServices[i][3] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "thursday") {
			if (tousLesServices[i][4] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "friday") {
			if (tousLesServices[i][5] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "saturday") {
			if (tousLesServices[i][6] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
		else if (jour == "sunday") {
			if (tousLesServices[i][7] == "1") {
				lesServices[j] = tousLesServices[i][0];
				j++;
			}
		}
	}

	return lesServices;
}

function getLesItinerairesDepuisServicesEtLigne(lesServices, ligne, direction) {
	var lesItineraires = Array();
	var tousLesItineraires = readDoc('trips');

	var k = 0;
	for (var i=1; i<tousLesItineraires.length; i++){
		if (tousLesItineraires[i][2] == ligne && tousLesItineraires[i][4] == direction) {
			for (var j=0; j<lesServices.length; j++){
				if (lesServices[j] == tousLesItineraires[i][1]){
					lesItineraires[k] = tousLesItineraires[i][0];
					k++;
				}
			}
		}
	}
	return lesItineraires;
}

function getLesHorairesDepuisItineraires(lesItineraires) {
	var lesHoraires = Array();
	var toutesLesHoraires = readDoc('stop_times');
	var cpt;
	for (var i=1; i<toutesLesHoraires.length; i++) {
		for (var j=0; i<lesItineraires.length; j++) {
			if (toutesLesHoraires[i][0] == lesItineraires[j]){
				cpt = parseInt(toutesLesHoraires[i][2]);
				lesHoraires[cpt-1] = toutesLesHoraires[3];
			}
		}
	}
	return lesHoraires;
}

function getNomLigne(id_ligne) {
	var toutesLesLignes = readDoc('routes');
	var nomLigne;
	for (var i=1; i<toutesLesLignes.length; i++) {
		if (toutesLesLignes[i][0] == id_ligne)
			nomLigne = toutesLesLignes[i][3];
	}
	return nomLigne;
}

function getCouleurLigne(id_ligne) {
	var toutesLesLignes = readDoc('routes');
	var couleurLigne;
	for (var i=1; i<toutesLesLignes.length; i++) {
		if (toutesLesLignes[i][0] == id_ligne)
			couleurLigne = toutesLesLignes[i][7];
	}
	return couleurLigne;
}

function selectLigne(){
    var test = readDoc('routes');
    var page = document.getElementById('form');
    str = "<select name='selectLigne' id ='selectLigne' onchange='selectJour()'>";
    for (var i=1; i<test.length; i++){
        str = str + "<option value=ligne"+test[i][0]+" style=color : #"+getCouleurLigne(test[i][0])+";>" + test[i][3] + "</option>";
    }
    str = str + "</select>";
    page.innerHTML=str;
    return select;
}

function selectJour(){
    var page = document.getElementById('form');
    str="<select name='selectJour' id='selectJour' onchange='afficherHoraires()'>";
    str=str+"<option id='lundi'>Lundi</option>";
    str=str+"<option id='mardi'>Mardi</option>";
    str=str+"<option id='mercredi'>Mercredi</option>";
    str=str+"<option id='jeudi'>Jeudi</option>";
    str=str+"<option id='vendredi'>Vendredi</option>";
    str=str+"<option id='samedi'>Samedi</option>";
    str=str+"<option id='dimanche'>Dimanche</option>";
    str=str+"</select>";
    page.innerHTML=str;
}

function afficherHoraires(){
	var ligne = document.getElementById('selectLigne');
	var jour = document.getElementById('selectJour');
	var direct = readDoc('trips');
	for(var i=1;i<direct.length;i++){
		if(direct[i,2]==ligne){
			direction=direct[i,4]
		}
	}
	test=getHoraires(ligne, jour, direction);
	page.innerHTML=test;
}