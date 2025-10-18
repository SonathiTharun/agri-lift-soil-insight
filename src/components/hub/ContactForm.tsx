import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import HubCard from "./HubCard";
import HubButton from "./HubButton";

interface ContactFormProps {
  hubName: string;
  accentColor?: string;
  onSubmit?: (data: ContactFormData) => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  hubName,
  accentColor = "#3B82F6",
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-1 space-y-6"
      >
        <HubCard variant="elevated">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Phone size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
              <p className="text-sm text-gray-600">+91 (555) 123-4567</p>
            </div>
          </div>
        </HubCard>

        <HubCard variant="elevated">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <Mail size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Email</h4>
              <p className="text-sm text-gray-600">support@{hubName.toLowerCase()}.com</p>
            </div>
          </div>
        </HubCard>

        <HubCard variant="elevated">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <MapPin size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Location</h4>
              <p className="text-sm text-gray-600">Hyderabad, India</p>
            </div>
          </div>
        </HubCard>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-2"
      >
        <HubCard variant="elevated" className="p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Send size={32} style={{ color: accentColor }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-600">
                Thank you for contacting us. We'll get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: accentColor }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={{ focusRingColor: accentColor }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: accentColor }}
                  placeholder="+91 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: accentColor }}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{ focusRingColor: accentColor }}
                  placeholder="Your message..."
                />
              </div>

              <HubButton
                type="submit"
                fullWidth
                accentColor={accentColor}
                icon={<Send size={18} />}
                iconPosition="right"
              >
                Send Message
              </HubButton>
            </form>
          )}
        </HubCard>
      </motion.div>
    </div>
  );
};

export default ContactForm;

