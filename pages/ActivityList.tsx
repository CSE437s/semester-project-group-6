// Another .tsx file where you use the TripCard component
import React, { useState } from 'react';
import TripCard from '../components/TripCard';
import ActivityCard from '../components/ActivityCard';
import Modal from '../components/Modal'; 
import styles from './ActivityList.module.css';


type ActivityCardData = {
  id: number;
  title: string;
  dateRange: string;
  imageUrl: string;
};

const defaultFormData = {
  title: "",
  dateRange: "",
  imageUrl: "",
}

const currentTripData = {

  trip_name: "St.Louis",
  trip_owner: "Shawn",
  start_date: "12/3/2024",
  end_date: "12/4/2024",
  participants: [
    { name: 'Andrew2', id: "1", imageURL: 'f1.png' },
    { name: 'Andrew', id: "2", imageURL: 'f1.png' }
  ]
};



export const ActivityList: React.FC = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState<ActivityCardData[]>([
 
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: ActivityCardData = {
      id: activities.length + 2, // Assuming ID 1 is taken by currentTripData
      ...formData,
    };
    setActivities([...activities, newActivity]);
    setShowModal(false); // Close the modal on form submit
    setFormData(defaultFormData); // Reset the form data to default
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const placeholderData = {
    id: 0,
    title: '',
    dateRange: '',
    imageUrl: '', // Placeholder image or leave it empty
  };

  const placeholdersCount = Math.max(0, 4 - activities.length);

  return (
    <div className={styles.activityList}>

      <TripCard trip_dest={''} {...currentTripData} />
      <button className={styles.addButton} onClick={handleAddClick}>
        +
      </button>
      
      {activities.map(activity => (
        <ActivityCard name={''} rating={0} review_count={0} image_url={''} url={''} latitude={0} longitude={0} key={activity.id} {...activity} />
      ))}
      
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>Add Activity</h2>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={formData.title} onChange={handleInputChange} />
          
          <label htmlFor="dateRange">Date Range:</label>
          <input type="text" id="dateRange" value={formData.dateRange} onChange={handleInputChange} />
          
          <label htmlFor="imageUrl">Image URL:</label>
          <input type="text" id="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
          
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCloseModal}>Close</button>
        </form>
      </Modal>
    </div>
  );
};

export default ActivityList;
