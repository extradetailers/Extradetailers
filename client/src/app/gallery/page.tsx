import Footer from '@/components/layout/Footer';
import Landing from '@/components/layout/Landing';
import React from 'react';
import styles from "./gallery.module.scss";
import About from '@/components/home/About';
import GalleryMain from '@/components/gallery/GalleryMain';

function GalleryPage() {
  return (
    <React.Fragment>
      <section className={`${styles.landing} position-relative`}>
        <Landing title="Gallery" />
      </section>
      <main>
              {/* About start  */}
      {/* Image ->  https://preview.themeforest.net/item/autorex-car-service-workshop-wordpress-theme/full_screen_preview/33387947?_ga=2.52420393.161412524.1738479323-1871772981.1710479217 */}
      <section className={`${styles.gallery} section-pt`}>
        <GalleryMain styles={styles} />
      </section>
      {/* About end  */}
        <section className="section-pt"></section>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default GalleryPage;