var oidc_userinfo;

function rand(min, max) {
	if (!DEBUG) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
			// disable random value for debugging
			return min;
		}
	}

	$(document).ready(function() {
		
		var color = "#5f0e88";

		$('#adminlink').click(function() { 
			resetAdminView();
		});

		$('#add-designer-admin-email').on('change keyup paste',function() { 
			$('#email-added-msg').text("");
			var val = $.trim(this.value);
			if(val!= ""){
				$('#add-designer-email').find('*').prop('disabled',false);
				$('#add-designer-email').find('*').removeClass('ui-disabled');
			} else{
				$('#add-designer-email').find('*').prop('disabled',true);
				$('#add-designer-email').find('*').addClass('ui-disabled');
			}
		});

		$('#button-add-designer-email').click(function() {
			addEmail();
		});	

		
		function addEmail(){
			var email = $.trim($('#add-designer-admin-email')[0].value);

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			formdata.append("oidcEmail",email);
			if(email == 'a.herrler@maastrichtuniversity.nl' || email == 'sindhu.aitharaju@rwth-aachen.de'){
				formdata.append("admin","true");
			}else{
				formdata.append("admin","part");
		}

			if(formdata){
				$.ajax({
					url: "lib/database/create_assessment_admin.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						resetAdminView();
						$('#email-added-msg').text("");
						var emailAdded = $('<h2 style="color:#48036b;">Email added successfully!</h2>');
						$('#email-added-msg').append(emailAdded);


					}
				});
			}
		}


	});

	function resetAdminView(){
		$('#email-added-msg').text("");
		$('#add-designer-admin-email')[0].value = "";
		setButtonColor($('#add-designer-email'));
		$('#add-designer-email').find('*').prop('disabled',true);
		$('#add-designer-email').find('*').addClass('ui-disabled');

	}

	function setButtonColor(divName){
		var color = "#5f0e88";
			if (divName.find('*').hasClass('ui-btn-inner')) {
				divName.find('*').css("color",color);
			} 
			else {
				divName.trigger('create');
				divName.find('*').css("color",color);
			}
		}