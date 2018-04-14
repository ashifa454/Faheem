var app=require('express')();
var EC=require('elliptic').ec;
var ellipticCurve=new EC('secp256k1');
var crypto=require('crypto');
const PORT=process.env.PORT||8003
//DiffHell for Generating KSAK AND KPAK
/*
Using Diff Hell Algorithm we Ensure to Generate a Unique Pair of Mathametical Pair of 
KSAK AND KPAK
*/
var prime_length=60;
var diffhell=crypto.createDiffieHellman(prime_length);
diffhell.generateKeys('hex');
var http=require('http').Server(app);
var io=require('socket.io')(http);

var nodes=[];
// System Setup
const KSAK=diffhell.getPrivateKey('hex');
const KPAK=diffhell.getPublicKey('hex');
var clientConfig={};
io.on('connection',function(socket){
    /*
        Construction of SSK&PVT
    */
    socket.on('initiate_node',()=>{
        socket.join('wsn_room',()=>{
            var key=ellipticCurve.genKeyPair();
            var UniqueId=Object.keys(socket.rooms)[0];
            var Key=key.getPublic();
            clientConfig[UniqueId]={
                _id:UniqueId,
                PVT:[
                    2,
                    4
                ],
                SSK:key.getPrivate(),
                KPAK:126
            }  
            console.log(clientConfig);
            nodes.push(clientConfig);
            socket.emit('setup_credentials',clientConfig);
        })        
    });
    socket.on('let_me_go',(id)=>{

    })
});
http.listen(PORT,function(){
    console.log("RUNNING ON PORT "+PORT);
})