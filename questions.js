function sum(n1, n2) {
  if (arguments.length == 2) {
    // return result
    return n1+n2
  } else {
    // return sum function
    return (n2)=>{
      return sum(n1, n2)
    }
  }
}
console.log(sum(2)(3))
console.log(sum(2,3))


function sum(last) {
  // return sum function
  return (newVal) => {
    if (newVal) {
      return sum(last+newVal)
    } else return last
  }
}
console.log(sum(2)(1)(3)())
