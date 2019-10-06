App = {
  web3Provider: null,
  contracts: {},
  account: null,
  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (App.web3Provider != null) {
      return;
    }
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
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
    return new Promise((res, rej) => {
      var i = 0;
      $.getJSON("/MedicalRecord.json", function(data) {
        var MedicalRecord = data;
        App.contracts.MedicalRecord = TruffleContract(MedicalRecord);
        App.contracts.MedicalRecord.setProvider(App.web3Provider);
        i++;
        if (i == 2) {
          res();
        }
      });
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#address").html("Your Account: " + account);
        }
        i++;
        if (i == 2) {
          res();
        }
      });
    });
  },

  isRegistered: () => {
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.isRegistered.call();
    });
  }
};

Patient = {
  conractInstance: null,
  savePatient: (name, email, patientDeails) => {
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.setPatientDetails(name, email, patientDeails);
    });
  },

  getPatient: patientAddress => {
    patientAddress = patientAddress ? patientAddress : App.account;
    return App.contracts.MedicalRecord.deployed()
      .then(instance => {
        contractInstance = instance;
        return contractInstance.getPatientInfo.call(patientAddress);
      })
  },

  approveDoctor: doctorAddress => {
    return App.contracts.MedicalRecord.deployed()
      .then(instance => {
        contractInstance = instance;
        return contractInstance.approveDoctor(doctorAddress);
      })
      .then(recpt => {
        console.log(recpt);
      })
      .catch(e => {
        console.log(e);
      });
  },


  getDiabetes : (address) => {
    return getPatient(address)
              .then((name) => {
                return axios.post("")
              })
  }
};

Doctor = {
  contractInstance: null,
  saveDoctorDetails: (name, email, speacialist, exp) => {
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.setDoctorDetails(name, email, speacialist, exp);
    });
  },
  getDoctorDetails: async _docAddress => {
    _docAddress = _docAddress ? _docAddress : App.account;
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.getDoctorDetails.call(_docAddress);
    });
  },
  getPatientCount: async () => {
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.getDocsPatientsCount.call();
    });
  },

  getApprovedPatients: async fn => {
    return Doctor.getPatientCount().then((a) => {
      for (var i = 0; i < a.toNumber(); i++) {
        contractInstance.getDocsPatientAtI.call(i)
          .then((e) => {
              fn(e,i);
          });
      }
    })
  },



  getDoctors: (fn) => {
    a = null;
    return App.contracts.MedicalRecord.deployed().then(instance => {
      contractInstance = instance;
      return contractInstance.docCount();
    }).then((c) => {
      c = c.toNumber();
      for(var i=0;i<c;i++) {
          contractInstance.docArray(i)
            .then((address) => {
              a = address;
              return Doctor.getDoctorDetails(address)
            })     
            .then((doc) => {
              fn(doc,a)
            })
      }

    });

  }




};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
