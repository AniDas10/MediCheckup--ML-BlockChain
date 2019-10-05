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
    }





    
    struct Patient{
        string patientName;
        string patientEmail;
        string patientAllDetails;
        address[] hasAccess;
        uint hasAccessCount;
        bool exists;
    }
    
    mapping(address => Patient) patients;
    mapping(address => Doctor) doctors;

    
    function setDoctorDetails(string memory _docName,string memory _docEmail,string memory _spea)  public {   //Set the details of doctors
        Doctor storage d = doctors[msg.sender];
        d.doctorName = _docName;
        d.doctorEmail = _docEmail;
        d.specailist = _spea;
        d.doctorAddress = msg.sender;
        d.hasAccessCount = 0;
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
        return true;
    }
    
    function getDoctorDetails() public view returns(string memory doc, string memory,string memory) {    //Get doctor details
        Doctor memory s = doctors[msg.sender];
        require(s.exists,"Only Doctor can see doctors information");
        return (s.doctorName,s.doctorEmail,s.specailist);
    }
    
    function getPatientInfo(address _patientAddress) public view returns(string memory, string memory, string memory) {    //Get Patient details.
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
                a.patientAllDetails
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
    function getDocsPatientAtI(uint  _index) public view returns(string memory, string memory, string memory){
        Doctor storage d = doctors[msg.sender];
        return getPatientInfo(d.hasAccess[_index]);
    }

}
