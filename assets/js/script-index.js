var taille = 0;
var code = "";
var colonne_table = 3;
var ligne_table = 4;



//Attribue les valeurs du tableau aléatoirement entre les cases du pavé
function attribution() {

	var markup = "";

	for(let i = 0; i<ligne_table; i++)
	{
		markup += "<tr>";
		for(let y = 0; y<colonne_table; y++)
			markup += "<td></td>";
		markup += "</tr>";
	}

	$('table#pave').append(markup);
	
	var nb_cases = colonne_table*ligne_table;
	var alea;
	var tableau = ["0","1","2","3","4","5","6","7","8","9"]

	if(nb_cases < 9)
	{
		tableau.splice(nb_cases,(tableau.length-nb_cases))
	}
	else if (nb_cases > 9)
	{
		for(let i = 0; i<(nb_cases-tableau.length);i++)
			tableau.push(" ");
	}


	$('table#pave tr td').each(
		function(index) {

			alea = Math.floor(Math.random() * (nb_cases-index));
			$(this).text(tableau[alea]);
			
			if(tableau[alea] != " " && tableau[alea] != null) {$(this).addClass("num")}

			tableau.splice(alea,1);
	});
}

var tabObject;

$(
	function() {

		$( ".connexion" ).dialog({
			autoOpen : false,
			resizable: false
			});

		$( ".inscription" ).dialog({
			autoOpen : false,
			resizable: false
		});

		$("#logInOut").click(function() {
			if($(this).text() == "Connexion")
			{
				$("p.erreur").css('visibility','hidden');
				$(".inscription").dialog("close");
				$(".connexion").dialog( "open" );
				$("#logInOut").text("S'inscrire");
			}
			else if($(this).text() == "S'inscrire")
			{
				$("p.erreur").css('visibility','hidden');
				$(".inscription").dialog("open");
				$(".connexion").dialog( "close" );
				$("#logInOut").text("Connexion");
			}


		});
	   
	
		attribution();

		//Affiche le code dans le texte en dessous
		$('table#pave tr td.num').click(
			function(){
				
				taille++;

				if(taille<=4)
				{
					code += $(this).text();
					$('form#connexionForm div#code input').val(code);

					if(taille == 4) 
					{ 
						$('#envoyer_connexion').prop("disabled",false); 
					}
				}
				else
				{
					$("p.erreur").css('visibility','visible').text("Le code ne peut contenir que 4 chiffres.");
				}
		});


		//Relance le pavé aléatoire
		$('#relancer').click(
			function() {

				code = "";
				taille = 0;
				$("p.erreur").css('visibility','hidden');
				$('#envoyer_connexion').prop("disabled",true);
				$('div#code input').val(code);

		});


		$('.code').change(function() {

			if($('#code_creation').val() == $('#code_confirm').val() && $('#code_creation').val() != "" && $('#code_creation').val().length == 4 )
			{
				$('#envoyer_inscription').prop("disabled",false); 
			}
			else 
			{
				$('#envoyer_inscription').prop("disabled",true); 
			}

		});


		$("#connexionForm").submit(function(event){
			event.preventDefault(); //prevent default action
			
			if($("#username").val() != "")
			{
				var response = phpProcess("connexion");

				$("p.erreur").css('visibility','hidden');
				
			}
			else
			{
				$("p.erreur").css('visibility','visible').text("Tous les champs ne sont pas remplis.");
			}
		});

		$("#inscriptionForm").submit(function(event){
			event.preventDefault(); //prevent default action

			let username = $("#username_insc").val();
			let email = $("#mail_insc").val();
			let code_create = $('.code#code_creation').val();
			let code_confirm = $('.code#code_confirm').val();

			let newUser = true;

			let Datas = new FormData();
			
			if(username != "" && email != "")
			{
				if(code_create == code_confirm && code_create.length == 4)
				{
					$("p.erreur").css('visibility','hidden');//masque le message d'érreur
					Datas.append("username", username);
					Datas.append("code", code_create);
					Datas.append("email", email);
					Datas.append("newUser", newUser);

					var response = phpProcess(Datas);
					console.log(response);
				}
				else
				{
					$("p.erreur").css('visibility','visible').text("Le code ne peut contenir que 4 chiffres.");//affiche et configure le message d'érreur
				}
				
			}
			else
			{
				$("p.erreur").css('visibility','visible').text("Tous les champs ne sont pas remplis.");
			}	
		});


		$('#pave td').mouseover(function(){
			$(this).css("text-decoration", "underline");
		  });

		$('#pave td').mouseout(function(){
			$(this).css("text-decoration", "");
		});

	}
);

/**
 * Fonction chargé de la requête au serveur
 * @param {FormData} Datas Données à envoyer
 * @param {Boolean} newUser Ajout de l'utilisateur si vrai
 */
 function phpProcess(Datas){
	
	let requête = $.ajax({
		url: "./assets/php/process_Inscription.php",
		type : "POST",
		data: Datas,
		processData: false,
		contentType: false,
	});
	requête.done(function(retour) {
		console.log('fonction réussi ! retour: ' + retour);
	});
	requête.fail(function(erreur){

	});
	
}