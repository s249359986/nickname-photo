const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getRandom = (m, n) =>{  
  return Math.floor(Math.random() * (n - m + 1)) + m
}

const getRandomColor = ()=>{
  const colors = ["red","rgb(179, 54, 54)","rgb(24, 199, 126)","rgb(14, 226, 50)","rgb(148, 14, 226)","rgb(23, 224, 39)"]
  return colors[getRandom(0,colors.length-1)]
}




const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  getRandomColor,
  getRandom,
  formatTime: formatTime
}
