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

const addFavListen = () => {
  const favStatus = document.querySelectorAll("input.favStatus");
  // console.log(favStatus)
  for (node of favStatus) {
    const nodeID = node.getAttribute('id');
    const resultInstance = document.getElementById(nodeID)
    resultInstance.addEventListener("click", async (e) => {
      e.preventDefault();
      // console.log('poo')
      console.log(JSON.stringify(e))
      const id = e.explicitOriginalTarget.value
      // const data = document.getElementById("img-id")
      // const id = data.getAttribute("value")
      fetch(`http://localhost:3000/toggleFav/${id}`)
        .then(console.log(`favorite status toggled for image id ${id}!`))
    });
  }
}
window.onload = (event) => {
  console.log("page is fully loaded");
  addFavListen()
};
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

// const results = document.getElementById("referenceImage")


// for(image in expressImgs){
//   results.type = 'text';
//   results.id = 'favStatus' + image.img_id; // Give each input a unique ID
//   // console.log(results)

// }

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