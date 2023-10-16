// minus menggunakan smtpjs Kalo ingin menggunakan email asli harus berlangganan 
// var btn = document.getElementById('sendmail');
// btn.addEventListener('click',function(e) {
//     e.preventDefault()
//     var name = document.getElementById('name').value;
//     var email = document.getElementById('email').value;
//     var Subject = document.getElementById('Subject').value;
//     var message = document.getElementById('Message').value;
//     var body = 'name'+ name + '</br> email : ' + email + '</br> subject' + Subject + '</br> message' + message;
//     Email.send({
//         Host : "smtp.elasticemail.com",
//         Username : "dapurdenisaa@gmail.com",
//         Password : "1F4F56BD84A102A8676198ED2E1ADDDC9BD8",
//         To : 'dapurdenisaa@gmail.com',
//         From : email,
//         Subject : Subject,
//         Body : body
//     }).then(
//       message => alert(message)
//     ); 
// })

// logika menggunakan Mongodb

// posting email

function posting_email() {
    let titleemail = $("#input_name_email").val().trim();
    let email = $("#input_email").val();
    let Subjectemail = $("#input_Subject_email").val();
    let Messageemail = $("#input_Message_email").val();

  
    
    if (!titleemail ||  !email ||  !Subjectemail ||  !Messageemail) {
      alert("Mohon lengkapi data dengan benar");
      return;
    }
  
  
  
        let form_data = new FormData();
        form_data.append("titleemail_give", titleemail);
        form_data.append("email_give", email);
        form_data.append("subjectemail_give", Subjectemail );
        form_data.append("messageemail_give", Messageemail );


        $.ajax({
          type: "POST",
          url: "/contact/postingemail",
          data: form_data,
          contentType: false,
          processData: false,
          success: function (response) {
            alert(response["msg"]);
            window.location.reload();
          },
        });
      
    }
  