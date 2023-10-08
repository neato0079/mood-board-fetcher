const wtf = () => {
  console.log('wtf')
}

const show = () => {
  document.getElementById("referenceImage").innerHTML = "The function fun() is triggered !";
}
const searchForm = document.querySelector(".artistSearch");

searchForm.addEventListener("submit", e => {
  e.preventDefault() // This prevents the window from reloading

  const formData = new FormData(e.target);
  const input = new URLSearchParams(formData).toString();

  window.location.href = `/search?${input}`;
});

// window.onload = function() {
//   document.getElementById('img-info').innerHTML = testValue;
// }

// const favStatus = document.getElementById("favStatus");

// favStatus.addEventListener("click", async (e) => {
//   e.preventDefault();
//   // console.log('poo')
//   console.log(JSON.stringify(e))
//   const id = e.explicitOriginalTarget.value
//   // const data = document.getElementById("img-id")
//   // const id = data.getAttribute("value")
//   fetch(`http://localhost:3000/toggleFav/${id}`)
//   .then(console.log(`favorite status toggled for image id ${id}!`))
// });

const fetchStuff = async () => {
  const myReq = new Request('localhost:3000/getImageData/9')
  fetch(myReq).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.blob();
  }).then(function (response) {
    // var objectURL = URL.createObjectURL(myBlob); 
    // var sc = document.createElement("script");
    // sc.setAttribute("src", objectURL); 
    // sc.setAttribute("type", "text/javascript"); 
    // document.head.appendChild(sc);
    document.getElementById('img-info').innerHTML = response
  })

}

// fetchStuff()