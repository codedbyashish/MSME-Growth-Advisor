import React from 'react'
import styles from './Home.module.css'
import { ArrowBigRight } from 'lucide-react'

function Home() {
  const paraItem=`rafting ultra-personalized journeys across the Indian subcontinent.
From the misty hills of Munnar to the spiritual ghats of Varanasi, let Al
design your perfect escape.`
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.backgroundimage}>
            <div className={styles.maincontent}>
              <div>
                <h1>India's Smartest AI Travel Planner</h1>
                <p> {paraItem} </p>
                <div className={styles.button}>
                  <button>Start Planning <ArrowBigRight /></button>
                  <button> Explore Destinations </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home