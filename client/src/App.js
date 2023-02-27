import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function App() {
  const [message, setMessage] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [accname, setAccname] = useState("");
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState("");
  const [phone, setPhone] = useState("");
  const [id,setId] = useState("");
  const [showedit,setShowedit] = useState(false);
  const [term, setTerm] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setId("");
    setAccname("");
    setPhone("");
    setRating("");
    setShowedit(false);
    setShow(true);
  }

  useEffect(() => {
    GetData();
    GetAccounts();
   }, []);

  const GetData = async()=>{
    const res = await axios.get("http://localhost:8000/salesforce/home");
    const result = await res.data;
    setMessage(result); 
  }

  const GetAccounts = async() => {
    const res = await axios.get(`http://localhost:8000/salesforce/accounts?key=${term}`);
    //console.log(res); 
    const result = await res.data;
    console.log(result); 
    setAccounts(result.acc);
  }

  const CreateAccount = async() => {
    if(accname && phone && rating){
      const res = await axios.post('http://localhost:8000/salesforce/new-account', {
      name: accname,
      phone: phone,
      rating: rating
    });
    const result = await res.data;
    console.log(result.msg);
    setShow(false)
    }
    else{
      alert("Fill all fields.")
    }
  }

  const EditAccount = async(id,name,phone,rating) => {
    setId(id);
    setAccname(name);
    setPhone(phone);
    setRating(rating);
    setShowedit(true);
    setShow(true);
  }

  const SaveEdit = async() => {
    const res = await axios.patch('http://localhost:8000/salesforce/edit-account', {
      name: accname,
      id:id,
      phone:phone,
      rating:rating
    });
    const result = await res.data;
    console.log(result.msg);
    setShowedit(false);
    setShow(false);
  }

  const DeleteAccount = async(id) => {
    const res = await axios.delete(`http://localhost:8000/salesforce/delete-account/${id}`);
    const result = await res.data;
    console.log(result.msg);
    alert(result.msg);
  }


  return (
    <>
    <div style={{paddingLeft:"5rem",paddingRight:"5rem"}}>
      <div style={{marginBottom:"1rem",textAlign:"center"}}>
      <p style={{fontWeight:"600"}}>Connected (<a href={message.url}>{message.url}</a>)</p>
        <div>
          <input onChange={(event) => setTerm(event.target.value)} placeholder="Search..."/>
          <button onClick={GetAccounts} style={{marginLeft:"0.2rem",backgroundColor:"#D2DAFF",borderColor:"#D2DAFF"}}>SEARCH</button>
          <button style={{marginLeft:"0.8rem",backgroundColor:"#CFF5E7",borderColor:"#CFF5E7"}} onClick={handleShow}>+ CREATE NEW ACCOUNT</button> 
        </div>
      </div>
      {accounts.map((i,j) => {
        return(
          <div key={i.Id} style={{padding:"0.5rem",backgroundColor:"#2C3639",color:"white",marginBottom:"0.3rem"}}>
            <p style={{fontWeight:"600"}}><span style={{color:"#FFEFD6",fontWeight:"900",textDecoration:"underline"}}>{i.Name}</span>&nbsp;({i.Id})</p>
            <p style={{fontWeight:"600"}}>{(i.Phone) ? "Phone : "+i.Phone : "NA"} &nbsp; {(i.Rating) ? "Rating : "+i.Rating : "NA"}</p>
            
            <div>
              <button style={{color:"purple",border:"none"}} onClick={() => EditAccount(i.Id,i.Name,i.Phone,i.Rating)}>EDIT</button>
              <button style={{marginLeft:"0.4rem",color:"#CF0A0A",border:"none"}} onClick={() => DeleteAccount(i.Id)}>DELETE</button>
            </div>
          </div>
        )
      })}
    </div>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{showedit === false ? "New Account" : "Edit Account"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <label for="name">Account name :</label><br/>
         <input value={accname} name="name" style={{}} onChange={(event) => setAccname(event.target.value)} placeholder="Jack"/><br/><br/>
         <label for="phone">Phone :</label><br/>
         <input value={phone} name="phone" style={{}} onChange={(event) => setPhone(event.target.value)} placeholder="Ex : 9867453421"/><br/><br/>
         <label for="rating">Rating :</label><br/>
         <select value={rating} name="rating" onChange={(event) => setRating(event.target.value)} style={{width:"190px"}}>
         <option value=""></option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
         </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {showedit === false ? <Button variant="primary" onClick={CreateAccount}>
            Submit
          </Button> : <Button variant="primary" onClick={SaveEdit}>
            Save Changes
          </Button> }
        </Modal.Footer>
      </Modal>
    

    </>
  );
}

export default App