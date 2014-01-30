/*function objet_XMLHttpRequest()
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

function selectLigne(){
    var test = readDoc('routes');
    var page = document.getElementById('form');
    str = "<select name='selectLigne' id ='selectLigne' onchange='selectJour()'>";
    for (var i=1; i<test.length; i++){
        str = str + "<option>" + test[i][3] + "</option>";
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

function affichageHoraires(){
    var page = document.getElementById('form');
    var ligne = document.getElementById('selectLigne');
    var jour = document.getElementById('selectJour');
    
}

function receptionDoc(nomDoc, colonne){
    arrayDocs = readDoc(nomDoc);
    laListe = new Array (arrayDocs.length());
    for(var i=0;i<arrayDocs.length;i++){
        document.write(laListe[i][colonne]);
    }
}*/
