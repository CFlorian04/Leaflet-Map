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

function phpProcess(formType)
{
	let Datas = new FormData();
	console.log($("#username").val());
	Datas.append("username", $("#username").val());
	Datas.append("code", $('#code input').val());
	if(formType == "inscription")
	{
		//elements = "?username=" + $("#username_insc").val() + "&mail=" + $("#mail").val() + "&code=" + $(".code_creation").val();
		Datas.append("mail", $("#mail").val());
	}

	//var elements;

	/*
	
	/*
	if(formType == "connexion")
	{
		
		elements = "?username=" + $("#username").val() + "&code=" + $('#code input').val();
	}
	
	
	*/
	$.ajax({
		url: "./process.php",
		type : "POST",
		data: Datas,
		processData: false,
    	contentType: false,
		success:function(retour){
			console.log(retour);
		}
	});
}


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

		$('.code_creation').change(function() {

			if($('.code_creation').first().val() == $('.code_creation').last().val() && $('.code_creation').first().val() != "" && $('.code_creation').first().val().length == 4 )
			{
				$('#envoyer_inscription').prop("disabled",false); 
			}
			else 
			{
				$('#envoyer_inscription').prop("disabled",true); 
			}

		});

		$("#inscriptionForm").submit(function(event){
			event.preventDefault(); //prevent default action
			
			if($("#username_insc").val() != "" && $("#mail").val() != "")
			{
				if($('.code_creation').first().val() == $('.code_creation').last().val() && $('.code_creation').first().val().length == 4)
				{
					$("p.erreur").css('visibility','hidden');
					
					var response = phpProcess("inscription");
				}
				else
				{
					$("p.erreur").css('visibility','visible').text("Le code ne peut contenir que 4 chiffres.");
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