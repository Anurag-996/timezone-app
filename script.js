const x = document.getElementById("time-zone");
let lat;
let lon;

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log(`latitude is ${lat} and longitude is ${lon}`);
          resolve({ lat, lon });
        },
        error => {
          console.error("Error getting geolocation:", error);
          reject(error);
        }
      );
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
      reject("Geolocation is not supported");
    }
  });
}

async function getData(lat, lon) {
  try {
    let resp = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}4&apiKey=3c7c97d300d44f89b4ec7b263110bbb2`
    );

    let result = await resp.json();
    return result.features[0];
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(error);
  }
}

async function callFunction() {
  try {
    const { lat, lon } = await getLocation();
    let ans = await getData(lat, lon);
    await displayData(ans,"");
  } catch (error) {
    console.error("Error in callFunction:", error);
  }
}

async function displayData(ans,key){
    const name = ans.properties.timezone.name || "Not Found";
    const latitude = ans.properties.lat;
    const longitude = ans.properties.lon;
    const offsetStd = ans.properties.timezone.offset_STD;
    const offsetStd_sec = ans.properties.timezone.offset_STD_seconds;
    const offsetDst = ans.properties.timezone.offset_DST;
    const offsetDst_sec = ans.properties.timezone.offset_DST_seconds;
    const country = ans.properties.country;
    const postcode = ans.properties.postcode || 'Not Found';
    const city = ans.properties.city;


    document.querySelector(`#name${key}`).append(name)
    document.querySelector(`#lat${key}`).append(latitude)
    document.querySelector(`#std${key}`).append(offsetStd)
    document.querySelector(`#std-seconds${key}`).append(offsetStd_sec)
    document.querySelector(`#dst${key}`).append(offsetDst)
    document.querySelector(`#dst-seconds${key}`).append(offsetDst_sec)
    document.querySelector(`#country${key}`).append(country)
    document.querySelector(`#postcode${key}`).append(postcode)
    document.querySelector(`#city${key}`).append(city)
    document.querySelector(`#long${key}`).append(longitude)
    console.log(ans);
}

callFunction();

document.querySelector('#btn').addEventListener('click',async ()=>{
   const text = document.querySelector('#search').value.trim();
   
   try {
   let res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${text}&apiKey=3c7c97d300d44f89b4ec7b263110bbb2`);
   let result = await res.json();
   console.log(result);

   document.querySelector('.con2').style.display = "flex";

   displayData(result.features[0],1);

   } catch (error) {
    console.log(error);
   }

   
})
