const app = Vue.createApp({
  data() {
    return {
      search: "",
      person: {
        name: null,
        phone: null,
      },
      sitename: "sheik gumi academy",
      filters: [{
          id: 1,
          name: "Subject",
          checked: true,
        },
        {
          id: 2,
          name: "Location",
          checked: false,
        },
        {
          id: 3,
          name: "Price",
          checked: false,
        },
        {
          id: 4,
          name: "Availability",
          checked: false,
        },
      ],
      secondary_filters: [{
          id: 1,
          name: "Ascending",
          sign: "",
          checked: true,
        },
        {
          id: 2,
          name: "Descending",
          checked: false,
          sign: "-",
        },
      ],
      lessons: [],
     
      cart: [],
      total: 0,
    };
  },
  created() {
    const vm = this
    console.log("getting lessons from the server...");
    fetch("https://cws2main.herokuapp.com/lessons.js").then(
      function (res) {
        res.json().then(
          function (json) {
            vm.lessons = json;
          }
        )
      }
    )
  },

  methods: {
    addToCart(course) {
      if (course.spaces > 0) {
        this.cart.push(course);
        this.total += course.price;
        course.spaces--;
      }
    },
    showModal() {
      document.getElementById('ogmodal').classList.toggle('is-active')
    },
    checkoutModal() {
      document.getElementById('checkout-modal').classList.toggle('is-active')
    },
    closeOgModal() {
      document.getElementById('ogmodal').classList.remove('is-active')
    },
    closeModal() {
      document.getElementById('checkout-modal').classList.remove('is-active')
    },

    searching(event) {
      let value = event.target.value.toLowerCase();

      $(".single-lesson").each((i, ele) => {
        let filterableText = "";
        let hide = false;
        $(ele).addClass("d-none");

        $(ele)
          .find(".filterable-attribute")
          .each((i, ele2) => {
            filterableText +=
              " " + ele2.innerText.toLowerCase().replace(/\s\s+/g, " ");
          });

        show = filterableText.includes(value);

        if (show) {
          console.clear();
          $(ele).removeClass("d-none");
        }
      });
    },

    removeFromCart(course) {
      let index = this.cart.indexOf(course)
      this.cart.splice(index, 1)
      course.spaces++;
      this.total = this.total - course.price
    },

    resetVariable() {
      this.cart = [];
      this.total = 0;
    },
    checkout() {
      const vm = this
      let msg = `Thanks ${vm.person.name} your total price is .. (₦ ${vm.total} naira only)`;
      alert(msg);
      vm.resetVariable();
      fetch('https://cws2main.herokuapp.com/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: "cors",
          cache: "no-store",
          body: JSON.stringify(vm.person),
        })
        .then(response => response.json())
        .then(responseJSON => {})
        .catch((error) => {
          console.log(error);
        });
    },

    stopNumericInput(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode > 47 && keyCode < 58) {
        event.preventDefault();
      }
    },

    stopAlphabetsInput(event) {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      console.log(keyCode);
      if (keyCode >= 48 && keyCode <= 58) {
        // Allow
      } else {
        event.preventDefault();
      }
    },

    dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    },

    toggleMainFilter(filter) {
      this.filters.map((e) => {
        e.checked = false;
        if (e == filter) {
          // Change State
          e.checked = true;

          this.applyFilter();
        }
      });
    },

    toggleSecondaryFilter(sfilter) {
      this.secondary_filters.map((e) => {
        e.checked = false;
        if (e == sfilter) {
          // Change State
          e.checked = true;

          this.applyFilter();
        }
      });
    },

    applyFilter() {
      let sign = this.secondary_filters.filter((obj) => {
        return obj.checked;
      })[0].sign;

      let filter = this.filters
        .filter((obj) => {
          return obj.checked;
        })[0]
        .name.toLowerCase();

      if (filter == "availability") {
        filter = "spaces";
      }

      this.lessons = this.lessons.sort(this.dynamicSort(sign + filter));
    },
  },

});

app.mount("#app");
