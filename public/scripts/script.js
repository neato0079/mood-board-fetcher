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


