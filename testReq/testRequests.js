// Please Run with new terminal!!!
const http = require('http')

for (let i = 1; i < 50; i++) {
    setTimeout(()=>{
        const request = http.request('http://localhost:3001/api/v1/users/all');
        console.log(`count-> ${i}`);
        request.end();
    }, i )   
}