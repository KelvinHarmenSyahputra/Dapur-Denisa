// listing menu
function menu() {
    $.ajax({
      type: "GET",
      url: "/get-bests",
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

// listing cookies
function cookies() {
    $.ajax({
      type: "GET",
      url: "/get-cookies",
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

// listing brownies
function brownies() {
    $.ajax({
      type: "GET",
      url: "/get-brownies",
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


// listing index faq
function indexfaqs() {
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
          <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${num}" aria-expanded="false" aria-controls="flush-collapse${num}">
                  ${title}
                  </button>
                </h2>
                <div id="flush-collapse${num}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div class="accordion-body"> ${description} </div>
                </div>
              </div>
          `;
          $("#cards-box").append(temp_html);
        }
      },
    });
  }
  

// listing Testimonial
function testimonial() {
  $.ajax({
    type: "GET",
    url: "/get-testi",
    data: {},
    success: function (response) {
      let card = response["card"];
      for (let i = 0; i < card.length; i++) {
        let title = card[i]["title"];
        let comment = card[i]["comment"];
        let star = card[i]["star"];

        let temp_html = `
        <div
          class="col-md-5 card shadow mb-3 px-3 pt-4 pb-2 text-center me-4 testimonial-card"
          data-aos="flip-left"
          data-aos-duration="700"
        >
        <div class="mx-auto">
          <img
            class="testimonial-pic me-2"
            src="../static/img/undraw_profile.svg"
            alt=""
          />
          <p class="fw-medium mt-1">
          ${title}
            <p class="px-2">${star}</p>
            
          </p>
        </div>
        
          <p class="card-text mb-2">
            “${comment}”
          </p>
        </div>
        `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}