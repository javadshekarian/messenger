const {SimpleCrypto}=require('simple-crypto-js');

module.exports={
    encoding:(str)=>{
        const simpleCrypto=new SimpleCrypto(process.env.KEY);
        const cipherText=simpleCrypto.encrypt(str);
        return cipherText;
    },
    decoding:(ct)=>{
        const simpleCrypto=new SimpleCrypto(process.env.KEY);
        const text=simpleCrypto.decrypt(ct);
        return text;
    }
}