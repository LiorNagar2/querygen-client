import React, {useState} from 'react';
import axios from "axios";

export default function ConnectDatabase({onConnected}: { onConnected: (connected: boolean) => void }) {
    const [dbConfig, setDbConfig] = useState({id: '1', type: 'mysql', host: '127.0.0.1', user: 'root', password: '', name: 'todoapp'});

    const handleConnect = async () => {
        console.log(dbConfig);
        try {
            const response = await axios.post('http://localhost:3001/database/connect', dbConfig);
            alert(response.data.message);
            onConnected(true);
        }catch (e: any) {
            alert(e.data.message);
        }

    };

    return (
        <div>
            <h2>Connect Database</h2>
            <input placeholder="ID" onChange={e => setDbConfig({...dbConfig, id: e.target.value})}/>
            <input placeholder="Host" onChange={e => setDbConfig({...dbConfig, host: e.target.value})}/>
            <input placeholder="User" onChange={e => setDbConfig({...dbConfig, user: e.target.value})}/>
            <input placeholder="Password" type="password"
                   onChange={e => setDbConfig({...dbConfig, password: e.target.value})}/>
            <input placeholder="Name" onChange={e => setDbConfig({...dbConfig, name: e.target.value})}/>
            <button onClick={handleConnect}>Connect</button>
        </div>
    );
}
