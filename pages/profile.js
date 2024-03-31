import Link from 'next/link';
import React from 'react';
import {useState, useEffect} from "react";
import { storage, auth } from "../firebase/firebase.js";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import {v4} from 'uuid';
import AppAppBar from '../components/AppAppBar.tsx';
import { updateProfile } from 'firebase/auth';
import { useAuth } from "../firebase/auth";

function App() {
    const [imageUpload, setImageUpload] = useState(null);
    //const [imageList, setImageList] = useState([]);
    //const imageListRef = ref(storage, "images/");
    const { authUser } = useAuth();

    const uploadImage = () => {
        if (imageUpload == null || !auth.currentUser) return;
        const uniqueSuffix = v4();
        const imageRef = ref(storage, `images/${imageUpload.name}-${uniqueSuffix}`);

        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                updateProfile(auth.currentUser, {
                    profilePicURL: url
                }).then(() => {
                    alert("Profile picture updated!");
                }).catch((error) => {
                    console.error("Error updating profile picture: ", error);
                });
            });
        });
    };

    return (
        <div className = "App">
            <AppAppBar />
            <input 
            type = "file" 
            onChange = {(event) => {
                setImageUpload(event.target.files[0]);
            }}
            />
            <button onClick={uploadImage}>Upload Image</button>
            {authUser && authUser.profilePicURl && (
                <div>
                    <img src={authUser.profilePicURL} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </div>
            )}
        </div>
    )
}


export default App;

