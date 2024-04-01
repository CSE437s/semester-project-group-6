import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
const DefUserImg = "https://firebasestorage.googleapis.com/v0/b/tripify-93d9a.appspot.com/o/images%2FBeautiful%20China%205k.jpg-3f9b964c-ff0a-48fb-a910-6b64820df9e7?alt=media&token=5edab783-615c-4838-9d8d-c4ca91b39e1c";
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './profile.module.css';
import { useAuth } from '../firebase/auth';

interface ProfileSidebarProps {
  profilePicURL: string;
}

const ProfileSidebar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { signOut, isLoading, authUser } = useAuth() as {
    signOut: Function;
    isLoading: boolean;
    authUser: User | null;
  };

  const sidebarItems = [
    { name: 'View Profile', href: '/profile', icon: '🏠' },
    { name: 'Trips', href: '/dashboard', icon: '👫' },

  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  return (
    <div className={styles.profileDropdownContainer} ref={dropdownRef}>
      <div 
        className={styles.profileImage}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Image
          src={authUser?.profilePicURL || DefUserImg}
          alt="User Profile"
          width={50}
          height={50}
          layout='fixed'
        />
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          <nav className={styles.dropdownNav}>
            {sidebarItems.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <div className={styles.dropdownNavItem}>
                  {item.name}
                </div>
              </Link>
            ))}
            <div 
              onClick={() => { 
                signOut(); 
                router.push('/');
                setShowDropdown(false); 
              }} 
              className={styles.dropdownNavItem}
            >
              Logout
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
