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
diffhell.generateKeys('base64');
var http=require('http').Server(app);
var io=require('socket.io')(http);

var nodes=[];
// System Setup
const KSAK=diffhell.getPrivateKey('base64');
const KPAK=diffhell.getPublicKey('base64');
var clientConfig={};
io.on('connection',function(socket){
    /*
        Construction of SSK&PVT
    */
    socket.on('initiate_node',()=>{
        var key=ellipticCurve.genKeyPair();
        socket.join('wsn_room',()=>{
            var UniqueId=Object.keys(socket.rooms)[0];
            clientConfig[UniqueId]={
                _id:UniqueId,
                PVT:key.getPublic(),
                SSK:key.getPrivate(),
                KPAK:KPAK
            }  
            nodes.push(clientConfig);
            console.log(UniqueId+" Just Joined");
            socket.emit('setup_credentials',clientConfig);
        })        
    });
});
http.listen(PORT,function(){
    console.log("RUNNING ON PORT "+PORT);
})