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
  // let input = formData.get("artisttName");
  const input = new URLSearchParams(formData).toString();
  // input = input.split(',')
  // const result = Array.from(input, value => value.trim()) // trims white space from each value in array

  // input = encodeURI(input)

  // uncomment the following for block to view the contents of the formdata object
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}: '${pair[1]}'`);
  // }

  window.location.href = `/search?${input}`;
});

// window.onload = function() {
//   document.getElementById('img-info').innerHTML = testValue;
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