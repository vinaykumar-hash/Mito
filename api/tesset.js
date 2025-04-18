const express = require('express');
const app = express();
const Web3 = require('web3');
const SimpleContract = require('../api/contracts/build/contracts/Patient.json');
const web3 = new Web3('http://localhost:7545'); // Ganache URL
const port = 3000
app.use(express.json())
app.get("/", async (req,res)=>{
    res.json("HI")
})
app.post('/signup', async (req, res) => {
    try {
        const data = req.body
        // Get accounts from Ganache
        const accounts = await web3.eth.getAccounts();
        
        // Create contract instance
        const contract = new web3.eth.Contract(SimpleContract.abi);
        
        // Deploy the contract
        const deployedContract = await contract.deploy({
            data: SimpleContract.bytecode,
            arguments: [data.pin,data.name,data.phone,data.gender]
        }).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000'
        });
        
        res.json({
            success: true,
            contractAddress: deployedContract.options.address,
            transactionHash: deployedContract.transactionHash,
            message: "Contract deployed successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to deploy contract",
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});