import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'
import { BsFillTrashFill } from 'react-icons/bs' 
import { GrDocumentUpdate } from 'react-icons/gr'

function App() {

  const [name,setName] = useState('')
  const [age,setAge] = useState('')
  const [listOfFriends,setListOfFriends] = useState([])



  const addFriend = () =>{
    // alert(name + age)
    axios.post('http://localhost:5000/addFriend',{
      name,
      age
    })
    .then( (resp) => {
      setListOfFriends([...listOfFriends,resp.data])
      setName('')
      setAge('')
      // console.log('-----------------------',resp)
    })
    .catch( (err) => console.error(err.message))
  };

  const updateFriend = (id) => {
    const newAge = prompt('Enter new age:')
    axios.put('http://localhost:5000/update',{
      newAge,
      id
    })
    .then( (resp)=> {
      console.log(resp);
      if(resp.data.error){
        console.log('cannot be updated')
        alert('Invalid input!')
      } else {
        setListOfFriends(listOfFriends.map( friend => {
      return friend._id === id ?  {_id: friend._id, name:friend.name, age: newAge} : friend }))
      }
    })
    .catch( e => console.log(e.message))
  }


  const deleteFriend = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`)
    .then( resp => {console.log(resp)
                    setListOfFriends(listOfFriends.filter( friend => !(friend._id === id)))})
    .catch( e =>  console.error(e.message))
  }

  useEffect(()=>{
    axios.get('http://localhost:5000/read')
    .then( (resp) => {console.log(resp);resp.data.forEach( friend => console.log(friend));setListOfFriends(resp.data)})
    .catch( (err) => console.error(err.message))
  },[])

  return (
    <div className="App">
      <div className='inputs' >
       <input type='text' placeholder='friend name' value={name} onChange={(e)=>{setName(e.target.value)}}></input>
       <input type='number' placeholder='friend age' value={age} onChange={(e)=>{setAge(e.target.value)}}></input>
       <button onClick={addFriend}>Add friend</button>
      </div>
      <div className='listOfFriends'>
      {
        listOfFriends.map((friend) => {
          return (<div className='friendContainer' key={friend._id}>
            <div className='friend' >
              <h3>Name : {friend.name}</h3>
              <h3>Age : {friend.age}</h3>
            </div>
            <button onClick={()=>{updateFriend(friend._id)}}>Update <GrDocumentUpdate/></button>
            <button id='remove' onClick={()=>{deleteFriend(friend._id)}}>Delete <BsFillTrashFill /></button>
          </div>)
        })
      }
      </div>
    </div>
  );
}

export default App;
