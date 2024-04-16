
import styles from './distance.module.css';
import Image from 'next/image';
import carIcon from '../public/google.png';


const commutesPerYear = 1 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 3.61;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {


  


  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    (leg.distance.value / 1000) * litreCostKM * commutesPerYear
  );

  return (
    <div className={styles.container}>
      {/* Display overall distance and duration */}
      <div className={styles.routeInfo}>
        <Image src={carIcon} alt="Car Icon" className={styles.icon} />
        <span className={styles.durationText}>{leg.duration.text}</span>
        <span className={styles.distanceText}>{leg.distance.text}</span>
      </div>

      {/* Display step by step instructions */}
      <div className={styles.stepsContainer}>
        {leg.steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
            <div className={styles.additionalInfo}>
              {step.distance?.text} - {step.duration?.text}
            </div>
          </div>
        ))}
      </div>
    </div>
    
  );
}
