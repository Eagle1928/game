const socket = io()
const log = document.getElementById('log')
const generate_btn = document.getElementById('generate');
const btn_container = document.getElementById('container');
const card = document.querySelectorAll('#card p');
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})


socket.on('roomData', ({room,users})=> {
    document.getElementById('name').innerHTML = room;
    log.innerHTML = ''
   users.forEach((user,index) => {
          let temp = document.createElement('div');
          if(username.toUpperCase() == user.username.toUpperCase() && user.type != undefined)
          {
    temp.innerHTML += user.username.toUpperCase();
    console.log(user.type)
    switch (user.type) {
        case 0:   card[0].innerHTML = 'SHOTACH'; card[1].innerHTML = 'SHOTACH';
        break; 
        case 1:    card[0].innerHTML = 'ADIEL'; card[1].innerHTML = 'ADIEL';
        break;
        case 2:  
        card[0].innerHTML = 'KOVID'; card[1].innerHTML = 'KOVID';
         break;
        default:   card[0].innerHTML = 'CHENDUSH'; card[1].innerHTML = 'CHENDUSH';
        
    }
          }
          else {
            temp.innerHTML += user.username.toUpperCase();

          }
    log.appendChild(temp)
    if(index == 0) {
        btn_container.style.display = 'block'
    }
   });
 
 })
 generate_btn.addEventListener('click', () => {

    console.log('hi')
    socket.emit('generate', (error) => {
        if(error) alert(error)
    })

 })

 socket.on('showType', (type) => {


 })


socket.emit('join', {username, room}, (error) => {
    if(error) {
    alert(error)
    location.href="/"
     }
})