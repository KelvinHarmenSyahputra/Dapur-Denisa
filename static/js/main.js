

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

  function test(){
    console.log("kiw");
  }



  
  // posting menu 
  function posting_menu() {
    let title = $("#input-title").val().trim();
    let file = $("#input-file").prop("files")[0];
    let description = $("#input-description").val();
    let category = $("#layout-category").val();
    let bestseller = $("#layout-bestseller").val();
    let price = $("#input-price").val();
    
    
    if (!title || !file || !description || !category || !bestseller || !price ) {
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
        form_data.append("description_give", description);
        form_data.append("category_give", category);
        form_data.append("bestseller_give", bestseller);
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
        let description = card[i]["description"];
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
  <td>${description}</td> 
  <td>${bestseller}</td> 
  <td>
    <button type="button" class="btn btn-warning mb-2"
        data-bs-toggle="modal" data-bs-target="#editdataDetail"
        onclick="updatePost('${num}')">
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


// listing menu
function menu() {
  $.ajax({
    type: "GET",
    url: "/get-posts",
    data: {},
    success: function (response) {
      let card = response["card"];
      for (let i = 0; i < card.length; i++) {
        let title = card[i]["title"];
        let file = card[i]["file"];
        let category = card[i]["category"];
        let price = card[i]["price"];
        let temp_html = `
        <div class="col mb-5">
    <div class="card h-100">
        <!-- Sale badge-->
        <div class="badge bg-denisa text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Best Seller</div>
        <!-- Product image 450x300-->
        <img class="card-img-top" src="../static/${file}" alt="..." /> 
        <!-- Product details-->
        <div class="card-body p-3">
            <div class="text-center">
              <p>${category}</p>
                <!-- Product name-->
                <h5 class="fs-5">${title}</h5>
                <!-- Product reviews-->
                <div class="d-flex justify-content-center small text-warning mb-2"></div>
                <!-- Product price-->
               <p class="fw-bolder">
                ${price}
               </p> 
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="btn btn-denisa mt-auto" href="https://wa.me/6285365094471/?text=Hai min, Saya ingin order nih :)" target="_blank">Order</a></div>
        </div>
    </div>
</div>        
        `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}


// posting faq
function posting_faq() {
  let title = $("#input-title").val().trim();
  let file = $("#input-file").prop("files")[0];
  let description = $("#input-description").val();
  let category = $("#layout-category").val();
  let bestseller = $("#layout-bestseller").val();
  let price = $("#input-price").val();
  
  
  if (!title || !file || !description || !category || !bestseller || !price ) {
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
      form_data.append("description_give", description);
      form_data.append("category_give", category);
      form_data.append("bestseller_give", bestseller);
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
