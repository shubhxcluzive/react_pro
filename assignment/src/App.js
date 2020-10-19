import React,{useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
const App = () =>{
  const filterTags = data =>{
    let output = [];
    data.map(camera =>{
      camera.Tags.map(tag => {
        if(!(output.includes(tag))){
          output.push(tag);
        }
      })
    })
    console.log(output);
  }
  const [imgUrl, setImgUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [cameraData, setCameraData] = useState([]);
  useEffect(() =>{
    let imgLinks = [];
    let count = 0;
    axios.get('https://cors-anywhere.herokuapp.com/https://s3.us-east-2.amazonaws.com/ftilab.com/api/traffic-counter-cameras.json')
      .then(res => res.data)
      .then(json => {
        const {data} = json;
        setCameraData(data);
        console.log(filterTags(data));
        data.map(({SnapshotSignedUrl}) =>{
          imgLinks.push(SnapshotSignedUrl);
        })
        setInterval(() =>{
          if(count === imgLinks.length){
            count = 0;
          }
          setImgUrl(imgLinks[count++]);
        }, 5000)
      })
  }, [])
  return(
    <div>
      <img src = {imgUrl} alt = {imgUrl}/>
      <table>
        <tr className = "pure-table">
          <th>Device ID</th>
          <th>Last Activity</th>
          <th>Tags</th>
        </tr>
        {
          cameraData.map(camera => {
            return(
              <tr key = {camera.DeviceID}>
                <td>{camera.DeviceID}</td>
                <td>{new String(camera.LatestActivityTime)}</td>
                <td>{JSON.stringify(camera.Tags)}</td>
              </tr>
            )
          })
        }

      </table>
    </div>
  )
}

export default App;
