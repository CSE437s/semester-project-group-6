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
import { ref as dbRef, getDatabase, update } from 'firebase/database';


function App() {
    const [imageUpload, setImageUpload] = useState(null);
    //const [imageList, setImageList] = useState([]);
    //const imageListRef = ref(storage, "images/");
    const { authUser } = useAuth();
    const [firstName, setFirstName] = useState(authUser?.firstName || '');
    const [lastName, setLastName] = useState(authUser?.lastName || '');


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

    const updateName = () => {
        if (!auth.currentUser) return;
        if (!firstName.trim() || !lastName.trim()) {
            alert('Please enter both first and last name.');
            return;
        }

        const db = getDatabase();
        const userRef = dbRef(db, `users/${auth.currentUser.uid}`);
        
        update(userRef, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
        }).then(() => {
            return updateProfile(auth.currentUser, {
                displayName: `${firstName.trim()} ${lastName.trim()}`,
            });
        }).then(() => {
            alert("Username changed!");
        }).catch((error) => {
            console.error("Error updating profile: ", error);
        });
    };

    return (
        <div className={styles.container}>
            <AppAppBar />
            
            {authUser && authUser.photoURL && ( 
                <img 
                  src={authUser.photoURL} 
                  alt="Profile" 
                  className={styles.profileImage} 
                />
            )}
            <div className={styles.userName}>
                {authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Loading user data...'}
            </div>

            <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className={styles.textInput}
            />
            <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className={styles.textInput}
            />
            <button className={styles.uploadButton} onClick={updateName}>
              Update Username
            </button>

            <input 
              type="file" 
              onChange={(event) => setImageUpload(event.target.files[0])}
              className={styles.fileInput}
            />
            <button className={styles.uploadButton} onClick={uploadImage}>
              Upload Image
            </button>
            
        </div>
    );
}


export default App;


