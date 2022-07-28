const pincode = document.getElementById("pincode");
const datepic = document.getElementById("date");
const search = document.getElementById("search");
const na = document.getElementById("name");
const lo = document.getElementById("lod");
const container = document.getElementById("tb");
const tabel = document.getElementById("mytable");
var countCenters = document.getElementById("testdata");
var filterButton = document.getElementById("filter");
var viewFilters = document.getElementById("viewFilters");
tabel.style.display = "none";
filterButton.style.display = "none";
// viewFilters.style.display = "none";
countCenters.style.display = "none";
var today = new Date();

search.style.display = "none";

const getVaccineData = (pincod, date) => {
  var pin = pincod;
  var date = date;

  lo.innerText = "Loading";

  return (
    fetch(
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" +
        pin +
        "&date=" +
        date,
    )
      // Status Code
      .then((response) => {
        if (response.status !== 200) {
          tabel.style.display = "none";
          na.innerText = "Please Select Valied Pincode";
          lo.innerText = "";
        } else {
          na.innerText = " ";
        }
        return response.json();
      })

      .then((result) => {
        console.log("No:Of Centers" + typeof result.centers.length);
        if (result.centers.length === 0) {
          console.log("no dAta AvaiL");
          na.innerText = `No Slots Available For ${pin} On ${date} Please Select Other Date's`;
          tabel.style.display = "none";
        }

        lo.innerText = "";
        tabel.style.display = "none";
        countCenters.style.display = "none";
        filterButton.style.display = "";

        for (let x = 0; x < result.centers.length; x++) {
          const name_up = result.centers[x].name;
          const address_uphc = result.centers[x].address;
          const block_name = result.centers[x].block_name;
          const district_name = result.centers[x].district_name;
          const state_name = result.centers[x].state_name;
          const fee_ty = result.centers[x].fee_type;
          const date = result.centers[x].sessions[0].date;
          const newDiv = document.createElement("tr");
          newDiv.classList.add("pannel");
          //All Data
          var res = [
            date,
            name_up,
            address_uphc,
            block_name,
            district_name,
            state_name,
            fee_ty,
          ];
          // res.sort();
          for (let m = 0; m < res.length; m++) {
            var dup = res[m] + "span";
            var dupdata = res[m] + "van";

            var dup = document.createElement("td");
            newDiv.appendChild(dup);
            var dupdata = document.createTextNode(res[m]);
            dup.appendChild(dupdata);
          }

          //Sessions Start

          m = result.centers[x].sessions[0];

          var sess_data = [
            result.centers[x].sessions.length,
            m.vaccine,
            m.min_age_limit,
            m.available_capacity,
          ];

          console.log(sess_data);
          for (let m = 0; m < sess_data.length; m++) {
            var dup = sess_data[m] + "span";
            var dupdata = sess_data[m] + "van";
            var dup = document.createElement("td");
            newDiv.appendChild(dup);
            var dupdata = document.createTextNode(sess_data[m]);
            dup.appendChild(dupdata);
          }
          container.append(newDiv);
          tabel.style.display = "";
        }
      })
  );
};

var auto_date = today.toISOString();
var mod_auto_date = auto_date.split("-");
var auto_year = mod_auto_date[0];
var auto_month = mod_auto_date[1];
var auto_day = mod_auto_date[2].split("");
var mod_auto_date = auto_day[0] + auto_day[1];
var final_auto_date = `${auto_year}-${auto_month}-${mod_auto_date}`;

pincode.addEventListener("input", function () {
  countCenters.style.display = "none";
  if (pincode.value.length === 6) {
    console.log("change");
    var pin = pincode.value;
    if (pin === "") {
      na.innerText = "Please Provide PinCode";
      tabel.style.display = "none";
      countCenters.style.display = "none";
      return;
    }

    var dat = datepic.value || final_auto_date;
    if (dat === "") {
      na.innerText = "Please Provide Date";
    }
    var date_spli = dat.split("-");
    var modified_date = `${date_spli[2]}-${date_spli[1]}-${date_spli[0]}`;
    console.log("Modified-Date:" + modified_date);
    getVaccineData(pin, modified_date);
    getVaccineDataByState(modified_date);
  } else {
    na.innerText = "";
    var Table = document.getElementById("tb");
    Table.innerHTML = "";
    tabel.style.display = "none";
  }
});

datepic.addEventListener("input", function () {
  var Table = document.getElementById("tb");
  Table.innerHTML = "";
  if (pincode.value.length === 6) {
    console.log("change");
    var pin = pincode.value;
    if (pin === "") {
      na.innerText = "Please Provide PinCode";
      return;
    }

    var dat = datepic.value;
    console.log(dat);
    if (dat === "") {
      na.innerText = "Please Provide Date";
    }
    var date_spli = dat.split("-");
    var modified_date = `${date_spli[2]}-${date_spli[1]}-${date_spli[0]}`;
    console.log("Modified-Date:" + modified_date);
    getVaccineData(pin, modified_date);
  } else {
    na.innerText = "";
    var Table = document.getElementById("tb");
    Table.innerHTML = "";
  }
});

//
//
//
//
//
//

var stateList = document.getElementById("stateList");
var districtList = document.getElementById("district");
var Table = document.getElementById("tb");

districtList.disabled = true;

fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
  .then((res) => res.json())
  .then((data) => {
    Table.innerHTML = "";
    na.innerText = "";

    for (let z = 0; z < data.states.length; z++) {
      var option = document.createElement("option");
      option.text = data.states[z].state_name;
      option.value = data.states[z].state_id;
      stateList.add(option);
    }

    // console.table(data.states);
  });

stateList.addEventListener("change", function () {
  lo.innerText = "Loading District";
  tabel.style.display = "none";
  districtList.innerText = "";
  Table.innerHTML = "";
  countCenters.style.display = "none";
  search.style.display = "none";

  var stateCode = stateList.value;
  fetch(
    `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateCode}`,
  )
    .then((response) => response.json())
    .then((fetchDistricts) => {
      lo.innerText = "";
      districtList.disabled = false;
      var option = document.createElement("option");
      option.text = "Select District";
      option.value = "Null";
      districtList.add(option);
      console.log(`Total No Of States - ${fetchDistricts.districts.length}`);
      for (let l = 0; l < fetchDistricts.districts.length; l++) {
        var option = document.createElement("option");
        option.text = fetchDistricts.districts[l].district_name;
        option.value = fetchDistricts.districts[l].district_id;
        districtList.add(option);
      }
    });
});

var dat = datepic.value || final_auto_date;
var date_spli = dat.split("-");
var modified_date = `${date_spli[2]}-${date_spli[1]}-${date_spli[0]}`;
districtList.addEventListener("change", function () {
  var districtCode = districtList.value;
  lo.innerText = "Loading Vaccination Centers Data";
  Table.innerHTML = "";
  console.log(districtCode);
  fetch(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtCode}&date=${modified_date}`,
  )
    .then((res) => res.json())
    .then((vaccinationCentersData) => {
      lo.innerText = "";
      na.innerText = "";
      filterButton.style.display = "";

      console.log(
        "Vaccination Centes is" + vaccinationCentersData.sessions.length,
      );
      var countCentersVal = vaccinationCentersData.sessions.length;
      var districtName = districtList.innerHTML;
      console.log("zzzzzzzzzzzzzzz" + districtName);
      countCenters.innerText = `Total Number Of Vaccination Centers Is - ${countCentersVal}`;
      countCenters.style.display = "";

      for (let m = 0; m < vaccinationCentersData.sessions.length; m++) {
        var short = vaccinationCentersData.sessions[m];
        var date = short.date;
        var centerName = short.name;
        var centerAddress = short.address;
        var blockName = short.block_name;
        var districtName = short.district_name;
        var stateName = short.state_name;
        var feeType = short.fee_type;
        var vaccineSessions = "-";
        var vaccineName = short.vaccine;
        var ageLimit = short.min_age_limit;
        var dosesAvailable = short.available_capacity;

        const newDiv = document.createElement("tr");
        newDiv.classList.add("pannel");

        // console.log(centerName);

        // Make Data InTo Array
        var fetchdata = [
          date,
          centerName,
          centerAddress,
          blockName,
          districtName,
          stateName,
          feeType,
          vaccineSessions,
          vaccineName,
          ageLimit,
          dosesAvailable,
        ];
        for (let v = 0; v < fetchdata.length; v++) {
          var dup = fetchdata[v] + "span";
          var dupdata = fetchdata[v] + "van";

          var dup = document.createElement("td");
          newDiv.appendChild(dup);
          var dupdata = document.createTextNode(fetchdata[v]);
          dup.appendChild(dupdata);
        }
        container.append(newDiv);
        tabel.style.display = "";
      }
      search.style.display = "";

      // Search
    });
});
const table = document.getElementById("mytable");
const tr = table.getElementsByTagName("tr");
search.addEventListener("input", function search() {
  const search = document.getElementById("search");
  filter = search.value.toUpperCase();
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        td.style.backgroundColor = "#1d85ec";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
});

// Filter Ends

// Global Filters
filterButton.addEventListener("click", function () {
  console.log("clicked");
  viewFilters.classList.toggle("view");
});

function startFilter(filterValue) {
  var filterreqVal = filterValue.value;
  filter = filterreqVal.toUpperCase();
  console.log(filter);
  if (filter == 18) {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[9];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          td.style.backgroundColor = "#1d85ec";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  } else if (filter == "COVAXIN") {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[8];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          td.style.backgroundColor = "#1d85ec";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  } else if (filter == "COVISHIELD") {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[8];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          td.style.backgroundColor = "#1d85ec";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  } else if (filter == "SPUTNIK V") {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[8];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          td.style.backgroundColor = "#1d85ec";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  } else if (filter == "FREE") {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[6];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          td.style.backgroundColor = "#1d85ec";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  } else if (filter == "ALL") {
    filter = modified_date;
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}
