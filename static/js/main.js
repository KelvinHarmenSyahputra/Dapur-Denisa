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

  // listing menu
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
          let temp_html = `
          tr>
          <th scope="col">${i + 1}</th>
          <th class="font-weight-bold" scope="col">${file}</th>
          <th class="font-weight-bold" scope="col">${title}</th>
          <th class="font-weight-bold" scope="col">${price}</th>
          <th class="font-weight-bold" scope="col">${category}</th>
          <th class="font-weight-bold" scope="col">${description}</th>
          <th class="font-weight-bold" scope="col">${bestseller}</th>
          <th class="font-weight-bold" scope="col"><a
          href="/adminpanel/posting/${num}" class="btn btn-success mb-2">
          <i class="fa fa-search fa-sm"></i>
      </a>
      <button type="button" class="btn btn-warning mb-2"
          data-bs-toggle="modal" data-bs-target="#editdataDetail"
          onclick="updatePost('${num}')">
          <i class="fas fa-edit fa-sm"></i>
      </button>
      <button class="btn btn-danger mb-2" onclick="deletemenu('${num}')">
          <i class="fas fa-dumpster fa-sm"></i>
      </button></th>
      </tr>
          `;
          $("#cards-box").append(temp_html);
        }
      },
    });
  }
  
// posting menu 
  function postingmenu() {
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
        // Gambar memenuhi syarat, lanjutkan dengan pengiriman data

        let form_data = new FormData();
        form_data.append("title_give", title);
        form_data.append("file_give", file);
        form_data.append("description_give", description);
        form_data.append("category_give", category);
        form_data.append("bestseller_give", bestseller);
        form_data.append("price_give", price); // Menambahkan nilai layout ke formData
  
        $.ajax({
          type: "POST",
          url: "/adminmenu/posting",
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
      url: "/adminmenu/delete-post",
      data: { num_give: num },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }
}