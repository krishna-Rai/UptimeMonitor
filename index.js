//Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')

// the server should respond to all requests with a string


const server = http.createServer((req,res)=>{

    //get the url and parse it
    const parsedUrl = url.parse(req.url,true)

    //get the path from the url
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g,'')
    
    // get the query string as an object

    const queryStringObject = parsedUrl.query
    


    //get the http method

    const method = req.method.toLowerCase();
    //get the headers as an object
    const headers = req.headers
    

    //get the payload , if any
    let decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data',(data)=>{
        buffer += decoder.write(data)
    })
    req.on('end',()=>{
        buffer += decoder.end()

        //choose the handler this request goes to

        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
        //construct the data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        //route the request to the handler speccified in the router
        chosenHandler(data,(statusCode,payload)=>{
            //use the status code called back by the handler, or defualt 

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            //use the payload called back by the handler, or default to empty
            payload = typeof(payload) == 'object' ? payload : {}

            //convert the payload to string
            let payloadString = JSON.stringify(payload)

            //return the response
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            //log the request
            console.log("Returning this reponse: ",statusCode,payloadString)
        })
        
    })


})

// start the server, and have it listen on port 3000

server.listen(config.port,()=>{
    console.log("The server is up on "+config.port+"in environemnt "+config.envName)
})
//define the handlers
let handlers = {}
handlers.sample = (data,callback)=>{
    callback(406,{"name" : "sample handler"})
}
//not found handler
handlers.notFound = (data,callback)=>{
    callback(404)
}
// define a request handler
let router = {
    'sample' : handlers.sample
}