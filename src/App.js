import logo from "./logo.svg";
import "./App.css";
import "clearblade-js-client/lib/mqttws31";
import { ClearBlade } from "clearblade-js-client";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    const cb = new ClearBlade();

    cb.init({
      URI: "https://platform.clearblade.com", // e.g., 'https://platform.clearblade.com'
      systemKey: "86daa4860cceef81fcbeef87a469",
      systemSecret: "86DAA4860CD8B5A7F7CDE4DFEC9101",
      email: "test@gmail.com", // use registerEmail instead if you wish to create a new user
      password: "test@gmail.com",
      callback: initCallback,
    });

    function initCallback(err, cb) {
      // err is a boolean, cb has APIs and constructors attached
      if (err) {
        throw new Error(cb);
      } else {
        console.log("success, ", { cb });
        var collection = cb.collection();
        /*
        collection.fetch(someQuery, collectionFetchCallback(err, rows) {
          if (err) {
            throw new Error(rows);
        } 
        })
        */
      }
    }
  }, []);

  return <div className="App">placeholder</div>;
}

export default App;
