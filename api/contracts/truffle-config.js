module.exports = {
  networks: {
    // Development network using Ganache
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ganache port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    
    // You can add other networks here (like mainnet, ropsten, etc.)
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",      // Fetch exact version from solc-bin
      // docker: true,       // Use "0.5.1" you've installed locally with docker
      settings: {            // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  },

  // Truffle DB is currently disabled by default
  db: {
    enabled: false
  }
};