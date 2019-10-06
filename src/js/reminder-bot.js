var botui = new BotUI("reminder-bot");
var name = "";
var email = "";
var gender = "";
var nopr = 0;
var glcl = 0;
var skin = 0;
var insulin = 0;
var bmi = 0;
var dpf = 0;
var age = 0;

//Make a List of what needs to be aksed , then based on the questions run stuff for validation
function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }

var questions = [
  {
    q: "Enter your Name",
    k: "name"
  },
  {
    q: "Enter your Email",
    k: "email",
    v: validateEmail
  },
  {
    q: "Gender",
    k:"sex"
  },
  {
    q: "Age",
    k:"age"
  },
  {
    q: "How many Pregnanancies",
    k:"pregnancies"
  },
  {
    q: "What is your BMI",
    k:"bmi"
  },
  {
    q: "What was the last measured Blood Pressure",
    k:"bp"
  },
  {
    q: "What was the last measured Glucode Level",
    k:"glucose"
  },
  {
    q: "Range your Chest Pain from 1-4",
    k:"chestPain"
  },
  {
    q: "What is yout Cholestrol Level",
    k:"cl"
  },
  {
    q: "Family History of Diabetes",
    k:"bloodSugar"
  },
  {
    q: "What are your ECG Levels?",
    k:"ecg"
  },
  {
    q: "Average Heart Rate Levels?",
    k:"heartRate"
  },
  {
    q: "Dietary Preference (0 for Veg or 1 f0r Non Veg)",
    k:"albumin"
  },
  {
    q: "Haemo",
    k:"haemoglobin"
  },
  {
    q: "Are you often tired or dizzy?",
    k:"hypertension"
  },
  {
    q: "Do you have any blood related issued",
    k:"rbc"
  },  
  {
    done:true
  }
];
let deets = {}
questions.reduce((prevPromise,question) => {
  console.log(question)
  return prevPromise.then(() => {
    if(question.done) {

      return saveToDB();
    }
    return createPromise(question)
  })
    
},Promise.resolve());




function saveToDB() {
    App.init()
        .then(() => {
           return App.isRegistered()
        })
        .then((a) => {
          if(a.toNumber() == 2) {
            console.log(deets)
            return Patient.savePatient(deets['name'],deets['email'],JSON.stringify(deets));
          } else {
            alert("Already Registered")
          }
        })
        .then((recpt) => {
          if(recpt) {
            alert("Registration Successful")
            //window.location.href = "/";
          }
        })
}
function createPromise(question) {
  return botui.message
  .bot(question.q)
  .then(function() {
    return botui.action.text({
      action: {placeholder: ""}
    });
  })
  .then(function(res) {
    if(isFunction(question.v) && !question.v(res.value)) {
      return createPromise(question)
    } 
    return res
  })
  .then(function(res) {
    deets[question.k] = res.value;
    return res.value;
  });
}





// botui.message
//   .bot("Please enter your name?")
//   .then(function() {
//     return botui.action.text({
//       action: {
//         placeholder: "Your name please!"
//       }
//     });
//   })
//   .then(function(res) {
//     name = res.value;
//     return botui.message.bot("Your email ID?");
//   })
//   .then(() =>
//     botui.action.text({
//       action: {
//         placeholder: "Email"
//       }
//     })
//   )
//   .then(function(res) {
//     if (validateEmail(res.value) == false) {
//       content: "Try Again!";
//     } else {
//       content: "Your ID is:" + res.value;
//       email = res.value;
//     }
//     return botui.message;
//   })
//   .then(function() {
//     return botui.action.button({
//       delay: 1000,
//       action: [
//         {
//           text: "Male",
//           value: "m"
//         },
//         {
//           text: "Female",
//           value: "f"
//         }
//       ]
//     });
//   })
//   .then(function(res) {
//     if (res.value == "m") {
//       gender = "Male";
//     } else {
//       gender = "Female";
//     }
//     return botui.message;
//   })
//   .then(function(res) {
//     return botui.message.bot("How many times have you been pregnant");
//   })
//   .then(() =>
//     botui.action.text({
//       action: {
//         placeholder: ""
//       }
//     })
//   )
//   .then(function(res) {
//     if (isNaN(res.value) == true && res.value > 13) {
//       content: "Incorrect Input";
//     } else {
//       nopr = res.value;
//     }
//   })
//   .then(function(res) {
//     return botui.message.bot("What are your glucose levels?");
//   })
//   .then(() =>
//     botui.action.text({
//       action: {
//         placeholder: ""
//       }
//     })
//   )
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       glcl = res.value;
//     }
//   })
//   .then(function(res) {
//     return botui.message.bot("What are your skin thickness levels?");
//   })
//   .then(() =>
//     botui.action.text({
//       action: {
//         placeholder: ""
//       }
//     })
//   )
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       skin = res.value;
//     }
//   })
//   .then(function(res) {
//     return botui.message.bot("What are your insulin levels?");
//   })
//   .then(() =>
//     botui.action.text({
//       action: {
//         placeholder: ""
//       }
//     })
//   )
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       insulin = res.value;
//     }
//   })
//   .then(function(res) {
//     return botui.message.bot("What is your Body Mass Index?");
//   })
//   .then(function() {
//     return botui.action.text({
//       action: {
//         placeholder: ""
//       }
//     });
//   })
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       bmi = res.value;
//     }
//   })
//   .then(function() {
//     return botui.action.text({
//       action: {
//         placeholder: "Define your diabetes pedigree function."
//       }
//     });
//   })
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       dpf = res.value;
//     }
//   })
//   .then(function() {
//     return botui.action.text({
//       action: {
//         placeholder: "What is your age?"
//       }
//     });
//   })
//   .then(function(res) {
//     if (isNaN(res.value) == true) {
//       content: "Incorrect Input";
//     } else {
//       age = res.value;
//     }
//   })
//   .then(() => {
//     var deets = {
//       gender: gender,
//       nopr: nopr,
//       glcl: glcl,
//       skin: skin,
//       insulin: insulin,
//       bmi: bmi,
//       dpf: dpf,
//       age: age
//     };
//     return Patient.savePatient(name, email, JSON.stringify(deets));
//   });

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var showReminderInput = function() {
  botui.message
    .bot({
      delay: 500,
      content: "Write your reminder below:"
    })
    .then(function() {
      return botui.action.text({
        delay: 1000,
        action: {
          placeholder: "Buy some milk"
        }
      });
    })
    .then(function(res) {
      botui.message.bot({
        delay: 500,
        content: "reminder added: " + res.value
      });

      return botui.action.button({
        delay: 1000,
        action: [
          {
            icon: "plus",
            text: "add another",
            value: "yes"
          }
        ]
      });
    })
    .then(showReminderInput);
};
