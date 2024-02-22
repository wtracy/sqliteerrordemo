import React from 'react';
import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

import * as SQLite from 'expo-sqlite';

function App(): React.JSX.Element {
  const [status, setStatus] = useState("Working...");

  useEffect(() => {
    /* sqlite-next implementation
    async function run() {
        try {
            const db = await SQLite.openDatabaseAsync('database.db');

            await db.execAsync('CREATE TABLE IF NOT EXISTS Foo (Bar NUMBER NOT NULL PRIMARY KEY);', []);
            await db.runAsync('INSERT INTO Foo VALUES (?);', [1]);
            await db.runAsync('INSERT INTO Foo VALUES (?);', [1]);
            setStatus('Success!');
        } catch (err) {
            setStatus(String(err));
        }
    }
    run();*/
    const db = SQLite.openDatabase('database.db');
    db.transactionAsync(async tx => {
      try {
        await tx.executeSqlAsync('CREATE TABLE IF NOT EXISTS Foo (Bar NUMBER NOT NULL PRIMARY KEY);', []);
        await tx.executeSqlAsync('INSERT INTO Foo VALUES (?);', [1]);
        // Insert a duplicate: THIS SHOULD ERROR
        await tx.executeSqlAsync('INSERT INTO Foo VALUES (?);', [1]);
        // This line never gets reached
        setStatus('Success!');
      } catch (err) {
        // The SQL error SHOULD cause this to be executed
        setStatus(String(err));
      }
    }, false);
  }, []);
  
  return (
    <SafeAreaView>
          <Text>{status}</Text>
    </SafeAreaView>
  );
}

export default App;
