App = {
  web3Provider: null,
  contracts: {},
  account: null,
  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if(App.web3Provider != null) {
      return ;
    }
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8545"
      );
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('MedicalRecord.json', function(data) {
      var MedicalRecord = data;
      App.contracts.MedicalRecord = TruffleContract(MedicalRecord);
      App.contracts.MedicalRecord.setProvider(App.web3Provider);
    });
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#address").html("Your Account: " + account);
      }
    });


  },

  isRegistered: () => {
    
    return App.contracts.MedicalRecord.deployed().then((instance) => {
      contractInstance = instance;
      return contractInstance.isRegistered.call();
    });
  }




};





















Patient = {



  conractInstance: null,
  savePatient:  (name,email,patientDeails) => {
      return App.contracts.MedicalRecord.deployed().then((instance) => {
          contractInstance = instance;
          return contractInstance.setPatientDetails(name,email,patientDeails);
      })
  },

  getPatient: (patientAddress) => {
      patientAddress = patientAddress ? patientAddress:App.account;
      return  App.contracts.MedicalRecord.deployed().then((instance) => {
          contractInstance = instance;
          return contractInstance.getPatientInfo.call(patientAddress);
      }).then(console.log)
  },

  approveDoctor: (doctorAddress) => {
      return App.contracts.MedicalRecord.deployed().then((instance) => {
          contractInstance = instance;
          return contractInstance.approveDoctor(doctorAddress);
      }).then((recpt) => {
        console.log(recpt);
      }).catch((e) => {
        console.log(e)
      }) 
  }
}

Doctor = {


  contractInstance: null,
  saveDoctorDetails:  (name,email,speacialist) => {
      return App.contracts.MedicalRecord.deployed().then((instance) => {
          contractInstance = instance;
          return contractInstance.setDoctorDetails(name,email,speacialist);
      })
  },
  getDoctorDetails:  (_docAddress) => {
      _docAddress = _docAddress? _docAddress:"P";
      return App.contracts.MedicalRecord.deployed().then((instance) => {
          contractInstance = instance;
          return contractInstance.getDoctorDetails.call(_docAddress);
      })
  },
  getPatientCount: () => {
    return App.contracts.MedicalRecord.deployed().then((instance) => {
      contractInstance = instance;
      return contractInstance.getDocsPatientsCount.call();
    })
  },

  getApprovedPatients: async () => {
    let patients = []
    let c =  await Doctor.getPatientCount()
    console.log(c.toNumber())
    for(var i=0;i<c.toNumber();i++) {
      let addr = await contractInstance.getDocsPatientsAtI.call(i);
      patients.push(addr);
    }
    return patients;
  }
  



}











$(function() {
  $(window).load(function() {
    App.init();
  });
});
