import React from 'react';
import styles from './ActivityCard.module.css';

type ActivityCardData = {
  id: number;
  title: string;
  dateRange: string;
  imageUrl: string;
};

const ActivityCard: React.FC<ActivityCardData> = ({ title, dateRange, imageUrl }) => {
  return (
    <div className={styles.activityCard}>
      <img src={imageUrl} alt="Activity Location" className={styles.activityImage} />
      <div className={styles.activityInfo}>
        <h2 className={styles.activityTitle}>{title}</h2>
        <p className={styles.activityDate}>{dateRange}</p>
      </div>
    </div>
  );
};

export default ActivityCard;