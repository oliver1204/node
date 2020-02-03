new Promise((resolve, reject) => {
  setTimeout(() => { console.log('1');   }, 3000)
  resolve(1);
})
.then(() => {
  Promise.resolve().then(() => { 
    Promise.resolve().then(()=> {console.log('2')})
  })
})
.then(() => {
console.log('3')
})