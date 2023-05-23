const wtf = () => {
  console.log('wtf')
}

const show = () => {
  document.getElementById("referenceImage").innerHTML = "The function fun() is triggered !";
}


// const idk = async() => {
//     const image_id = Math.floor(Math.random() * 25)
//     const imageURL = await database.getImagePath(image_id)
//     console.log(imageURL)
// }
// const baseURL = 'http://localhost:3000'
// const artistValue = document.querySelector('.artistSearch')
// // const artistInput = document.getElementById('search')
// artistValue.addEventListener('submit', async (e) => {
//   e.preventDefault()
//   const formdata = new FormData(this)
//   const input = formdata.get('aritstName')
//   alert(input)
// })


const searchForm = document.querySelector(".artistSearch");

searchForm.addEventListener("submit", function (e) {
  e.preventDefault() // This prevents the window from reloading

  const formdata = new FormData(this);
  const input = formdata.get("artisttName");

  alert(input);
});



// const asdf = async (e) => {
//   e.preventDefault()
//   // try{
//   //   const artistInput = await fetch(baseURL, {
//   //     headers: {
//   //       'Content-Type': 'application/json',
//   //       'Accept': 'application/json'
//   //     },
//   //     method: 'GET'
//   //   }).then(response => response.json())
//   //   .then(responseData => console.log(responseData));

//   //   // const res = await artistInput.json()
//   //   // console.log(res)
//   // } catch (error) {
//   //   console.log(error)
//   //   // console.error(error)
//   // }
//   try {
//     const artistInput = await fetch(baseURL, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       method: 'GET'
//     })

//     const res = JSON.stringify(artistInput)
//     console.log(res)

//     // const res = await artistInput.json()
//     // console.log(res)
//   } catch (error) {
//     console.log(error)
//     // console.error(error)
//   }
// }
// const asdf = async(res) => {
//   console.log(await res)
// }
// artistInput.addEventListener('click', asdf)