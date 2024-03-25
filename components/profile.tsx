import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DefUserImg from '../public/AnonUser.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './profile.module.css';
import { useAuth } from '../firebase/auth';



const ProfileSidebar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  const sidebarItems = [
    { name: 'Homepage', href: '/', icon: '🏠' },
    { name: 'Trips', href: '/Trips', icon: '👫' },
    { name: 'Friends', href: '/friends', icon: '👫' },
    // Add other sidebar items as needed
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { // Type the event parameter as a MouseEvent
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.profileDropdownContainer} ref={dropdownRef}>
      {/* Profile image that toggles the dropdown */}
      <div 
        className={styles.profileImage}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Image
          src={DefUserImg}
          alt="User Profile"
          width={50}
          height={50}
          layout='fixed'
        />
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className={styles.dropdown}>
          {/* Dropdown menu items */}
          <nav className={styles.dropdownNav}>
            {sidebarItems.map((item) => (
              // Using the new Link API without <a> tag
              <Link key={item.name} href={item.href} passHref>
                <div className={styles.dropdownNavItem}>
                  {item.name}
                </div>
              </Link>
            ))}
            {/* Logout item */}
            <div 
              onClick={() => { signOut(); setShowDropdown(false); }} 
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