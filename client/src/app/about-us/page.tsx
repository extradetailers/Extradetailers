import Footer from '@/components/layout/Footer';
import Landing from '@/components/layout/Landing';
import React from 'react';
import styles from "./about-us.module.scss";
import About from '@/components/home/About';

function AboutUsPage() {
  return (
    <React.Fragment>
      <section className={styles.landing}>
        <Landing title="About Us" />
      </section>
      <main>
              {/* About start  */}
      {/* Image ->  https://preview.themeforest.net/item/autorex-car-service-workshop-wordpress-theme/full_screen_preview/33387947?_ga=2.52420393.161412524.1738479323-1871772981.1710479217 */}
      <section className={`${styles.about} section-pt`}>
        <About styles={styles} />
      </section>
      {/* About end  */}
        <section className="section-pt"></section>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default AboutUsPage;