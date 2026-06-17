import React from 'react';
import { FaEnvelope, FaFacebookF, FaGlobe, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from "react-router-dom";
import facebook from "../../Assets/img/facbook.png";
import insta from "../../Assets/img/insta.png";
import youtube from "../../Assets/img/utube.png";
import blog from "../../Assets/img/blog.png";
import twitt from "../../Assets/img/social-media.png"
import wp from "../../Assets/img/whatsapp.png";
import linked from "../../Assets/img/social.png";
// import "../../Footer/footer.css"
const links = [
  [FaGlobe, 'Website', 'https://technothlon.techniche.org.in'],
  [FaInstagram, 'Instagram', 'https://www.instagram.com/technothlon.iitg/'],
  [FaFacebookF, 'Facebook', 'https://www.facebook.com/technothlon.techniche'],
  [FaWhatsapp, 'WhatsApp', 'https://www.whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S'],
  [FaEnvelope, 'Email', 'mailto:technothlon@iitg.ac.in'],
];
const Footer = () => (
  <footer className="mt-6 w-full border-t border-sky-100/40 pb-6 pt-6 backdrop-blur-md">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
        
        {/* Copyright - Removed 'whitespace-nowrap' so it wraps safely on mobile screens */}
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-slate-600/90">
            Copyright © 2026–27 Technothlon. All Rights Reserved.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="https://www.facebook.com/technothlon/"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={facebook}
              alt="Facebook"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://www.youtube.com/@technothlon"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={youtube}
              alt="Youtube"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://technothlon.medium.com/"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={blog}
              alt="Blog"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://www.instagram.com/technothlon.iitg/"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={insta}
              alt="Instagram"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://twitter.com/TheTechnothlon"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={twitt}
              alt="Twitter"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={wp}
              alt="Whatsapp"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>

          <a
            href="https://in.linkedin.com/company/technothlon"
            target="_blank"
            rel="noreferrer"
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <img
              src={linked}
              alt="LinkedIn"
              className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
