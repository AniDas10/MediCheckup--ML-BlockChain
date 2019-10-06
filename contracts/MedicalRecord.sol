pragma solidity >=0.4.22 <0.6.0;

contract MedicalRecord {
    
    struct Doctor{
        string doctorName;
        string doctorEmail;
        address doctorAddress;
        string specailist; 
        bool exists;

        address[] hasAccess;
        uint hasAccessCount;

        uint[] ratings;
        uint ratingCount;

        uint experience;

        uint txCount;


    }






    
    struct Patient{
        string patientName;
        string patientEmail;
        string patientAllDetails;
        address[] hasAccess;

        address patientAddress;
        uint hasAccessCount;
        bool exists;
    }
    
    mapping(address => Patient) patients;
    mapping(address => Doctor) public doctors;

    uint public docCount = 0;
    address[] public docArray;

    
    function setDoctorDetails(string memory _docName,string memory _docEmail,string memory _spea,uint  _exp)  public {   //Set the details of doctors
        Doctor storage d = doctors[msg.sender];
        d.doctorName = _docName;
        d.doctorEmail = _docEmail;
        d.specailist = _spea;
        d.experience = _exp;
        d.ratingCount = 0;
        d.doctorAddress = msg.sender;
        d.hasAccessCount = 0;

        docArray.push(msg.sender);
        docCount += 1;

        d.exists = true;
    }

    function isRegistered() public view returns(uint role) {
        Patient memory p = patients[msg.sender];
        if(p.exists) {
            return 1; //Patient
        }
        Doctor memory a = doctors[msg.sender];
        if(a.exists) {
            return 0;
        }
        return 2;
    }
    
    function setPatientDetails(string memory _patientName,string memory _patientEmail,string memory _patientAllDetails) public  returns(bool sucess){
        Patient storage p = patients[msg.sender];
        p.patientName = _patientName;
        p.patientEmail = _patientEmail;
        p.patientAllDetails = _patientAllDetails;
        p.exists = true;
        p.hasAccessCount = 0;
        p.patientAddress = msg.sender;
        return true;
    }
    
    function getDoctorDetails(address _docAddress) public view returns(string memory doc, string memory,string memory,uint) {    //Get doctor details
        Doctor memory s = doctors[_docAddress];
        require(s.exists,"Only Doctor can see doctors information");

        // uint sum = 0;
        // for(uint i=0;i<s.ratingCount;i+=1) {
        //     sum += s.ratings[i];
        // }
        return (s.doctorName,s.doctorEmail,s.specailist,s.experience);//sum,s.ratingCount);
    }
    
    function getPatientInfo(address _patientAddress) public view returns(string memory, string memory, string memory,address) {    //Get Patient details.
        Patient storage a = patients[_patientAddress];
        require(a.exists,"Patient Does not exist");


        bool canI = msg.sender == _patientAddress;

            for(uint i=0;i<a.hasAccessCount;i+=1) {
                if(canI) {
                    break;
                }
                canI = a.hasAccess[i] == msg.sender;
            }

        require(canI,"NO Access");
        return (a.patientName,
                a.patientEmail,
                a.patientAllDetails,
                a.patientAddress
            );
    }

    function approveDoctor(address _docAddress) public returns(bool) {
        Patient storage a = patients[msg.sender];
        Doctor storage d = doctors[_docAddress];


        require(a.exists,"Patient Does not exist");
        require(msg.sender != _docAddress,"Address Was the Same");
        
        a.hasAccess.push(_docAddress);
        a.hasAccessCount += 1;
        
        
        d.hasAccess.push(msg.sender);
        d.hasAccessCount += 1;


        return true;
    }

    function getDocsPatientsCount() public view returns(uint){
        Doctor storage d = doctors[msg.sender];
        return d.hasAccessCount;
    }
    function getDocsPatientAtI(uint  _index) public view returns(string memory, string memory, string memory,address ){
        Doctor storage d = doctors[msg.sender];
        return getPatientInfo(d.hasAccess[_index]);
    }



    // function createTransaction(address _docAddress,uint _amount) public {
    //     Transaction storage d = txArray[txCount];

    //     d.docAddr = _docAddress;
    //     d.patientAddr = msg.sender;
    //     d.value = _amount;
        


    // }




}
