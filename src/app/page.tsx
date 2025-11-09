"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const GRADIENT = "linear-gradient(90deg, #F7931E, #FF6B35)";
const PRIMARY = "#FC7000";

const container = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-white text-slate-900"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Hero */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12"
      >
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Wash where you park.
          </h1>
          <p className="text-slate-700 text-lg mb-8 max-w-lg">
            Mico Car Wash brings professional, eco-friendly car cleaning
            services directly to your doorstep. Convenient, fast, and reliable.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/book-now"
              style={{ background: GRADIENT }}
              className="inline-flex items-center justify-center text-white font-semibold rounded-full px-8 py-3 shadow-md hover:opacity-95 transition-opacity"
              aria-label="Book Now"
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center text-sm text-slate-700 border border-slate-200 rounded-full px-6 py-3 hover:bg-slate-50"
            >
              View Services
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <motion.div
            variants={fadeUp}
            className="rounded-3xl shadow-lg overflow-hidden border border-slate-100"
            style={{ boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}
          >
            <Image
              src="/car-wash-hero.jpg"
              alt="Car being washed"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              priority={false}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-16"
      >
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Why Choose Mico Car Wash?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: PRIMARY }}
              aria-hidden
            >
              🚗
            </div>
            <h3 className="font-semibold mb-2">Convenience</h3>
            <p className="text-sm text-slate-600">
              Book your wash anytime and get it done wherever you park.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: GRADIENT }}
              aria-hidden
            >
              🧼
            </div>
            <h3 className="font-semibold mb-2">Professional Service</h3>
            <p className="text-sm text-slate-600">
              Experienced staff use top-quality products for a spotless finish.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: PRIMARY }}
              aria-hidden
            >
              🌿
            </div>
            <h3 className="font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-sm text-slate-600">
              We use biodegradable products and water-saving techniques.
            </p>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-16 bg-slate-50 rounded-xl"
      >
        <h2 className="text-3xl font-semibold mb-10 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: PRIMARY }}
              aria-hidden
            >
              1
            </div>
            <h3 className="font-semibold mb-2">Book Your Wash</h3>
            <p className="text-sm text-slate-700 max-w-xs mx-auto">
              Choose your preferred time and location with our easy booking
              system.
            </p>
          </div>
          <div>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: GRADIENT }}
              aria-hidden
            >
              2
            </div>
            <h3 className="font-semibold mb-2">We Come to You</h3>
            <p className="text-sm text-slate-700 max-w-xs mx-auto">
              Our professionals arrive on time with all the necessary equipment.
            </p>
          </div>
          <div>
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: PRIMARY }}
              aria-hidden
            >
              3
            </div>
            <h3 className="font-semibold mb-2">Drive Clean</h3>
            <p className="text-sm text-slate-700 max-w-xs mx-auto">
              Enjoy your freshly cleaned car without leaving your spot.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-16"
      >
        <h2 className="text-3xl font-semibold mb-10 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-700 italic mb-4">
              “Mico Car Wash made it so easy to get my car cleaned during a busy
              day. The team was professional and my car looks amazing!”
            </p>
            <div className="font-semibold text-primary">- Sarah L.</div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-700 italic mb-4">
              “I love that they use eco-friendly products and still deliver a
              fantastic wash. Highly recommend for anyone who values convenience
              and quality.”
            </p>
            <div className="font-semibold text-primary">- Jason K.</div>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-700 italic mb-4">
              “Booking was simple and the service was prompt. My car looks brand
              new without me having to go anywhere!”
            </p>
            <div className="font-semibold text-primary">- Emily R.</div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-r from-[#F7931E] to-[#FF6B35] rounded-xl text-white text-center"
      >
        <h2 className="text-4xl font-extrabold mb-6">
          Ready to get your car sparkling clean?
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-lg">
          Book your mobile car wash now and experience the convenience of Mico
          Car Wash.
        </p>
        <a
          href="#"
          onClick={() => {
            const ua = navigator.userAgent || navigator.vendor;
            if (/android/i.test(ua))
              window.location.href =
                "https://play.google.com/store/apps/details?id=com.mico.carwash";
            else
              window.location.href =
                "https://apps.apple.com/in/app/mico/id6754202822";
          }}
          className="inline-block bg-white text-primary font-semibold rounded-full px-10 py-4 shadow-lg hover:opacity-90 transition-opacity text-[#FC7000]"
        >
          Book Now
        </a>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-100 text-slate-600"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} Mico Car Wash. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-sm hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-sm hover:text-primary transition-colors"
              aria-label="Contact"
            >
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
