import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import '../styles/Contact.css';

export default function Contact() {

  return (
    <div className="contact-page">

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="animate-fade-in">
              <h2 className="contact-info-title">Contact Us</h2>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="contact-info-label">Address</h3>
                    <p className="contact-info-text">
                      123 Dragon Street<br />Chinatown, NY 10013
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="contact-info-label">Phone</h3>
                    <p className="contact-info-text">(555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="contact-info-label">Email</h3>
                    <p className="contact-info-text">info@wokthisway.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Clock />
                  </div>
                  <div>
                    <h3 className="contact-info-label">Opening Hours</h3>
                    <p className="contact-info-text">
                      Mon - Thu: 11:00 AM - 10:00 PM<br />
                      Fri - Sat: 11:00 AM - 11:00 PM<br />
                      Sunday: 12:00 PM - 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
