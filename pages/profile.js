import Link from 'next/link';
import React from 'react';
import {useState, useEffect} from "react";
import { storage, auth } from "../firebase/firebase.js";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import {v4} from 'uuid';
import AppAppBar from '../components/AppAppBar.tsx';
import { updateProfile } from 'firebase/auth';
import { useAuth } from "../firebase/auth";
import styles from './profile.module.css';

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
                    photoURL: url
                }).then(() => {
                    alert("Profile picture updated!");
                }).catch((error) => {
                    console.error("Error updating profile picture: ", error);
                });
            });
        });
    };

    return (
        <div className={styles.container}> {/* Applied container style */}
            <AppAppBar />
            {authUser && authUser.photoURL && ( // Changed from profilePicURl to photoURL
                <img 
                  src={authUser.photoURL} 
                  alt="Profile" 
                  className={styles.profileImage} // Applied profileImage style
                />
            )}
            <input 
              type="file" 
              onChange={(event) => setImageUpload(event.target.files[0])}
            />
            <button className={styles.uploadButton} onClick={uploadImage}>
              Upload Image
            </button>
            
        </div>
    );
}


export default App;


