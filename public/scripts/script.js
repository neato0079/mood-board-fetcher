const wtf = () => {
  console.log('wtf')
}

const show = () => {
  document.getElementById("referenceImage").innerHTML = "The function fun() is triggered !";
}



const searchForm = document.querySelector(".artistSearch");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault() // This prevents the window from reloading

  const formdata = new FormData(this);
  const input = formdata.get("artisttName");

  window.location.href = `/search_Artist_${input}`;
});


