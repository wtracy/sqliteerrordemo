import React from 'react';
import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

import * as SQLite from 'expo-sqlite';

function App(): React.JSX.Element {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=> {
    const db = SQLite.openDatabase('database.db');
    
    setSuccess(null);
    setError(null);
    
    db.transactionAsync(async tx => {
      try {
        await tx.executeSqlAsync('CREATE TABLE IF NOT EXISTS Foo (Bar NUMBER NOT NULL PRIMARY KEY);', []);
        await tx.executeSqlAsync('INSERT INTO Foo VALUES (?);', [1]);
        // Insert a duplicate: THIS SHOULD ERROR
        await tx.executeSqlAsync('INSERT INTO Foo VALUES (?);', [1]);
        // This line never gets reached
        setSuccess('Success!');
      } catch (err) {
        // The SQL error SHOULD cause this to be executed
        setError(err);
      }
    }, false);
  }, []);

  function RenderWorking() {
    if (error == null && success == null)
        return <Text>Working...</Text>
    return <View />;
  }

  function RenderError() {
    if (error == null)
      return <View />;
    return (<Text>{String(error)}</Text>);
  }
  
  function RenderSuccess(){
    if (success == null)
      return <View />;
    return (<Text>{String(success)}</Text>);
}
  
  return (
    <SafeAreaView>
        <RenderWorking />
        <RenderError />
        <RenderSuccess />
    </SafeAreaView>
  );
}

export default App;
