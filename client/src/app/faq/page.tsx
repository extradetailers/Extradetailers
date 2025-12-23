'use client';

import Footer from '@/components/layout/Footer';
import React, { useState } from 'react';
import styles from "./faq.module.scss";
import Landing from '@/components/layout/Landing';

function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What Great Value do Our Car Detailing Services Offer?",
      answer:
        "Detailing is a meticulous process that goes far beyond a standard car wash. It involves in-depth cleaning, restoration, and protection of your vehicle's interior and exterior. Professional detailers use high-quality products, specialized tools, and advanced techniques to ensure every part of your car, from the wheels to the dashboard, is thoroughly cared for. The cost also reflects the time and effort required to address every detail, including hard-to-reach areas, stubborn stains, and surface imperfections. At Extra Detailers, we’re committed to delivering exceptional value by not only making your car look amazing but also preserving its condition and extending its lifespan. This level of care and quality ensures your investment is well worth it.",
    },
    {
      question: "How long does it take to detail a car?",
      answer:
        "The time it takes to detail a car depends on the type and level of service required. Typically, a basic detail can take a couple of hours, while a full detail can take a few hours.",
    },
    {
      question: "Can I schedule a recurring service?",
      answer:
        "Yes! You can set up recurring appointments based on your needs, whether you want weekly, bi-weekly, or monthly detailing services. This ensures your car stays clean and well-maintained.",
    },
    {
      question: "What should I do to prepare for the detailer’s arrival?",
      answer:
        "Just make sure your car is accessible and parked in a location where the detailer can work comfortably. If you’re at home, a driveway or street parking is ideal. If you’re at work, ensure the detailer has permission to access the parking area.",
    },
    {
      question: "What if I’m not satisfied with the service?",
      answer:
        "Customer satisfaction is our top priority. Before the detailer leaves, you will typically be asked to sign a satisfaction form to confirm the service meets your expectations. If any issues arise after the detailer leaves, please let us know within 24 hours, and we’ll work with you to resolve the matter. If necessary, we can arrange for a follow-up or provide a refund to ensure you're completely satisfied with your experience.",
    },
    {
      question: "Do I need to be present during the detailing?",
      answer:
        "You don’t have to be there! As long as the detailer has access to your car and any necessary keys, you can go about your day. Many customers prefer to have their car detailed while they’re at work or running errands.",
    },
    {
      question: "How do I pay for the service?",
      answer:
        "Payment is easy and secure through our platform. After the service is completed, the payment will be processed automatically via your preferred method (credit card, debit card, etc.).",
    },
  ];

  return (
    <>
      <main className={styles.faq}>
        {/* Hero Section */}
        <section className={styles.landing}>
          <Landing title="FAQ" />
        </section>

        {/* FAQ Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="text-center mb-5 fw-bold">Frequently Asked Questions</h2>
                <div className="accordion" id="faqAccordion">
                  {faqData.map((faq, index) => (
                    <div key={index} className="accordion-item mb-3 border-0 shadow-sm">
                      <h3 className="accordion-header">
                        <button
                          className={`accordion-button ${activeIndex === index ? "" : "collapsed"} fw-bold`}
                          type="button"
                          onClick={() => toggleAccordion(index)}
                        >
                          {faq.question}
                        </button>
                      </h3>
                      <div
                        className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
                      >
                        <div className="accordion-body text-muted">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default FAQPage;