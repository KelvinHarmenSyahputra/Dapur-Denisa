

function sign_in() {
    let username = $("#input-username").val();
    let password = $("#input-password").val();
  
    if (!username || !password) {
      alert("Mohon lengkapi username dan password.");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/login_save",
      data: {
        username_give: username,
        password_give: password,
      },
      success: function (response) {
        if (response["result"] === "success") {
          let token = response["token"];
          $.cookie("mytoken", token, { path: "/" });
          alert("Login Berhasil!");
          window.location.href = "/adminpanel";
        } else {
          alert(response["msg"]);
        }
      },
    });
  }
  
  function sign_out() {
    $.removeCookie("mytoken", { path: "/" });
    alert("Anda telah keluar");
    window.location.href = "/login";
  }


  
  // posting menu 
  function posting_menu() {
    let title = $("#input-title").val().trim();
    let file = $("#input-file").prop("files")[0];
    let category = $("#layout-category").val();
    let bestseller = $("#layout-bestseller").val();
    let price = $("#input-price").val();
    
    
    if (!title || !file || !category || !bestseller || !price ) {
      alert("Mohon lengkapi data dengan benar");
      return;
    }
  
    // Validasi tipe file (hanya menerima gambar)
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      alert("Mohon pilih file gambar!");
      return;
    }
  
    // Validasi kapasitas file (maksimum 2 megabyte)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar, maksimum 2 megabyte diperbolehkan");
      return;
    }
    
    // Membuat objek gambar untuk memeriksa ukuran
    let image = new Image();
    image.src = URL.createObjectURL(file);
    
    image.onload = function () {
      // Validasi ukuran width dan height
      if (image.width >= 593 && image.height >= 420) {


        let form_data = new FormData();
        form_data.append("title_give", title);
        form_data.append("file_give", file);
        form_data.append("bestseller_give", bestseller);
        form_data.append("category_give", category);
        form_data.append("price_give", price); // Menambahkan nilai layout ke formData
        
        $.ajax({
          type: "POST",
          url: "/adminmenu/postingmenu",
          data: form_data,
          contentType: false,
          processData: false,
          success: function (response) {
            alert(response["msg"]);
            window.location.reload();
          },
        });
      } else {
        alert("Ukuran gambar harus minimal 593px lebar dan 420px tinggi");
      }
    };
  
    image.onerror = function () {
      alert(
        "Gagal memuat gambar. Pastikan file yang dipilih adalah gambar yang valid."
        );
      };
      
    }
  

    
    // delete menu
    function deletemenu(num) {
      var confirmDelete = confirm("Apakah Anda yakin ingin menghapus posting ini?");

  if (confirmDelete) {
    $.ajax({
      type: "POST",
      url: "/adminmenu/delete-menu",
      data: { num_give: num },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }
}



// listing
function listing() {
  $.ajax({
    type: "GET",
    url: "/get-posts",
    data: {},
    success: function (response) {
      let card = response["card"];
      for (let i = 0; i < card.length; i++) {
        let title = card[i]["title"];
        let file = card[i]["file"];
        let num = card[i]["num"];
        let category = card[i]["category"];
        let bestseller = card[i]["bestseller"];
        let price = card[i]["price"];
        let temp_html = `
        <tr>
  <th scope="row">${i + 1}</th>
  <td>
    <img
      src="../static/${file}"
      class="img-fluid data-foto"
    />
  </td>
  <td>${title}</td> 
  <td>${price}</td> 
  <td>${category}</td> 
  <td>${bestseller}</td> 
  <td>
    <button type="button" class="btn btn-warning mb-2"
        data-bs-toggle="modal" data-bs-target="#editdataDetail"
        onclick="updatemenu('${num}')">
        <i class="fas fa-edit fa-sm"></i>
    </button>
    <button class="btn btn-danger mb-2" onclick="deletemenu('${num}')">
        <i class="fas fa-dumpster fa-sm"></i>
    </button></td>
</tr>
        `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}




// posting faq
function posting_faq() {
  let titlefaq = $("#input-title").val().trim();
  let descriptionfaq = $("#input-description").val();

  
  if (!titlefaq ||  !descriptionfaq ) {
    alert("Mohon lengkapi data dengan benar");
    return;
  }



      let form_data = new FormData();
      form_data.append("titlefaq_give", titlefaq);
      form_data.append("descriptionfaq_give", descriptionfaq);

      $.ajax({
        type: "POST",
        url: "/adminfaq/postingfaq",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
          alert(response["msg"]);
          window.location.reload();
        },
      });
    
  }

  // listing faq
  function faqs() {
    $.ajax({
      type: "GET",
      url: "/get-faqs",
      data: {},
      success: function (response) {
        let card = response["card"];
        for (let i = 0; i < card.length; i++) {
          let title = card[i]["title"];
          let num = card[i]["num"];
          let description = card[i]["description"];

          let temp_html = `
          <tr>
    <th scope="row">${i + 1}</th>
    <td>${title}</td> 
    <td>${description}</td> 
    <td>
      <button type="button" class="btn btn-warning mb-2"
          data-bs-toggle="modal" data-bs-target="#editdataDetail"
          onclick="updatefaq('${num}')">
          <i class="fas fa-edit fa-sm"></i>
      </button>
      <button class="btn btn-danger mb-2" onclick="deletefaq('${num}')">
          <i class="fas fa-dumpster fa-sm"></i>
      </button></td>
  </tr>
          `;
          $("#cards-box").append(temp_html);
        }
      },
    });
  }

// delete faq
function deletefaq(num) {
  var confirmDelete = confirm("Apakah Anda yakin ingin menghapus posting ini?");

if (confirmDelete) {
$.ajax({
  type: "POST",
  url: "/adminfaq/delete-faq",
  data: { num_give: num },
  success: function (response) {
    alert(response["msg"]);
    window.location.reload();
  },
});
}
}





// best seller,cookies,brownies (digabung)
function saveChanges(num) {
  let title = $("#input-title-edit").val();
  let newImage = $("#input-file-edit")[0].files[0];
  let layout = $("#layout-category-edit").val();
  let bestseller = $("#layout-bestseller-edit").val();
  let price = $("#input-price-edit").val();

  let formData = new FormData();
  formData.append("title", title);
  formData.append("layout", layout);
  formData.append("bestseller", bestseller);
  formData.append("price", price);

  if (newImage) {
    formData.append("file_give", newImage);
  }

  $.ajax({
    type: "POST",
    url: `/adminmenu/update-posting/${num}`,
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.result === "success") {
        window.location.reload();
      } else {
        alert(response.msg);
      }
    },
  });
}



function updatemenu(num) {
  $.ajax({
    type: "GET",
    url: `/adminmenu/get-posting/${num}`,
    success: function (response) {
      if (response.result === "success") {
        let post = response.post;
        $("#input-title-edit").val(post.title);
        $("#layout-category-edit").val(post.category);
        $("#layout-bestseller-edit").val(post.category);
        $("#input-price-edit").val(post.price);

        // Set nomor posting pada tombol "Simpan Perubahan"
        $("#update-post-button").attr("onclick", `saveChanges(${num})`);

        // Munculkan modal edit
        $("#editdataDetail").modal("show");
      } else {
        alert(response.msg);
      }
    },
  });
}

// Faq Update and save changes
function saveChangesfaq(num) {
  let title = $("#input-title-edit").val();
  let description = $("#input-description-edit").val();

  let formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);

  $.ajax({
    type: "POST",
    url: `/adminfaq/update-postfaq/${num}`,
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.result === "success") {
        window.location.reload();
      } else {
        alert(response.msg);
      }
    },
  });
}



function updatefaq(num) {
  $.ajax({
    type: "GET",
    url: `/adminfaq/get-postfaq/${num}`,
    success: function (response) {
      if (response.result === "success") {
        let post = response.post;
        $("#input-title-edit").val(post.title);
        $("#input-description-edit").val(post.description);


        // Set nomor posting pada tombol "Simpan Perubahan"
        $("#update-postfaq-button").attr("onclick", `saveChangesfaq(${num})`);

        // Munculkan modal edit
        $("#editdataDetail").modal("show");
      } else {
        alert(response.msg);
      }
    },
  });
}


// testi posting
function posting_testi() {
  let titletesti = $("#input-title").val().trim();
  let commenttesti = $("#input-comment").val();
  let startesti = $("#layout-star").val();

  
  if (!titletesti ||  !commenttesti || !startesti ) {
    alert("Mohon lengkapi data dengan benar");
    return;
  }



      let form_data = new FormData();
      form_data.append("titletesti_give", titletesti);
      form_data.append("commenttesti_give", commenttesti);
      form_data.append("startesti_give", startesti);

      $.ajax({
        type: "POST",
        url: "/admintesti/postingtesti",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
          alert(response["msg"]);
          window.location.reload();
        },
      });
    
  }


  function deletetesti(num) {
    var confirmDelete = confirm("Apakah Anda yakin ingin menghapus posting ini?");
  
  if (confirmDelete) {
  $.ajax({
    type: "POST",
    url: "/admintesti/delete-testi",
    data: { num_give: num },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
  }
  }
  
  // listing faq
  function testi() {
    $.ajax({
      type: "GET",
      url: "/get-testi",
      data: {},
      success: function (response) {
        let card = response["card"];
        for (let i = 0; i < card.length; i++) {
          let title = card[i]["title"];
          let num = card[i]["num"];
          let comment = card[i]["comment"];
          let star = card[i]["star"];

          let temp_html = `
          <tr>
    <th scope="row">${i + 1}</th>
    <td>${title}</td> 
    <td>${comment}</td>
    <td>${star}</td>  
    <td>
      <button type="button" class="btn btn-warning mb-2"
          data-bs-toggle="modal" data-bs-target="#editdataDetail"
          onclick="updatefaq('${num}')">
          <i class="fas fa-edit fa-sm"></i>
      </button>
      <button class="btn btn-danger mb-2" onclick="deletefaq('${num}')">
          <i class="fas fa-dumpster fa-sm"></i>
      </button></td>
  </tr>
          `;
          $("#cards-box").append(temp_html);
        }
      },
    });
  }



  // update testi
  function saveChangestesti(num) {
    let title = $("#input-title-edit").val();
    let comment = $("#input-comment-edit").val();
    let star = $("#layout-star-edit").val();
  
    let formData = new FormData();
    formData.append("title", title);
    formData.append("comment", comment);
    formData.append("star", star);
  
    $.ajax({
      type: "POST",
      url: `/admintesti/update-posttesti/${num}`,
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.result === "success") {
          window.location.reload();
        } else {
          alert(response.msg);
        }
      },
    });
  }
  
  
  
  function updatefaq(num) {
    $.ajax({
      type: "GET",
      url: `/admintesti/get-posttesti/${num}`,
      success: function (response) {
        if (response.result === "success") {
          let post = response.post;
          $("#input-title-edit").val(post.title);
          $("#input-comment-edit").val(post.comment);
          $("#layout-star-edit").val(post.star);
          
  
  
          // Set nomor posting pada tombol "Simpan Perubahan"
          $("#update-posttesti-button").attr("onclick", `saveChangestesti(${num})`);
  
          // Munculkan modal edit
          $("#editdatatesti").modal("show");
        } else {
          alert(response.msg);
        }
      },
    });
  }