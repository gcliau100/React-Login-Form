import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

// ADDED
import { database } from "../firebase";
// END ADDED

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  // ADDED
  function generateKeys() {
    const { generateKeyPair } = require("crypto");
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "top secret",
        },
      },
      (err, publicKey, privateKey) => {
        // Callback function
        if (err) {
          console.log("Error is: ", err);
        } else {
          console.log("Public Key is: ", publicKey.toString("hex"));
          console.log();
          console.log("Private Key is: ", privateKey.toString("hex"));

          // var public_key = publicKey.toString("hex");
          // var private_key = privateKey.toString("hex");
          // console.log("Public Key is: ", public_key);
          // console.log();
          // console.log("Private Key is: ", private_key);
          // keysDB(public_key, private_key);
        }
      }
    );
  }
  function keysDB(pub_key, pri_key) {
    var public_name = currentUser.uid + "_publickey";
    var private_name = currentUser.uid + "_privatekey";
    const dataPublic = {
      name: public_name,
      createdAt: database.getCurrentTimestamp(),
      userId: currentUser.uid,
      key: pub_key,
    };
    const resPub = database.collection("public").set(dataPublic);
    console.log("Set: ", resPub);

    const dataPrivate = {
      name: private_name,
      createdAt: database.getCurrentTimestamp(),
      userId: currentUser.uid,
      key: pri_key,
    };
    const resPri = database.collection("private").set(dataPrivate);
    console.log("Set: ", resPri);
  }
  // END ADDED

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
        {/* ADDED */}
        <Button variant="link" onClick={generateKeys}>
          Generate Keys
        </Button>
        {/* END ADDED */}
      </div>
    </>
  );
}
