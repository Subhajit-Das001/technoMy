import { FiBarChart, FiBell, FiDollarSign, FiPlay } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "./useWindowSize";
import { useState } from "react";

import OPI1 from "../Assets/OPI/OPI1.png"
import OPI2 from "../Assets/OPI/OPI2.png"
import OPI3 from "../Assets/OPI/OPI3.png"
import OPI4 from "../Assets/OPI/OPI4.png"
import OPI5 from "../Assets/OPI/OPI5.png"
import OPI6 from "../Assets/OPI/OPI6.png"
import OPI7 from "../Assets/OPI/OPI7.png"


const VerticalAccordion = () => {
  const [open, setOpen] = useState(items[0].id);

  return (
    <section className="p-4 bg-indigo-600">
      <div className="flex flex-col lg:flex-row h-fit lg:h-[60vh] lg:w-[80vw] w-full max-w-6xl mx-auto  overflow-hidden">
        {items.map((item) => {
          return (
            <Panel
              key={item.id}
              open={open}
              setOpen={setOpen}
              id={item.id}
              link={item.link}
              title={item.title}
              imgSrc={item.imgSrc}
            />
          );
        })}
      </div>
    </section>
  );
};



const Panel = ({ open, setOpen, id, title, imgSrc, link }) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="bg-white hover:bg-slate-50 transition-colors p-2 border-r-[1px] border-b-[1px] border-slate-200 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group"
        onClick={() => setOpen(id)}
      >

<span className="block lg:hidden text-xl font-light">{title}</span>


        
         <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xl font-light rotate-180"
        >
          {title}
        </span>
        
        
        <span className="w-4 h-4 bg-white group-hover:bg-slate-50 transition-colors border-r-[1px] border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-slate-200 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20" />
      </button>




               <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            className="w-full h-full overflow-hidden relative bg-blue-100 flex flex-col items-start"
          >
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-full object-contain"
            /> 
           
            <button
  onClick={() => handleClick(link)} // Pass the link to the handleClick function
  className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
  View More
</button>

            {/* Title at the Bottom */}
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="w-full px-4 py-2 bg-black/60 text-white mt-auto"
            >
              {/* <h3 className="text-lg font-bold">{title}</h3> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default VerticalAccordion;

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
  },
};
const handleClick = (link) => {
  // Open the link in a new tab
  window.open(link, "_blank", "noopener noreferrer");
};


const panelVariantsSm = {
  open: {
    width: "80vw",
    height: "55vh",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "Odyssey of Realms",
    imgSrc: OPI1,
      link: "https://www.instagram.com/p/DDRsjmjPGfJ/?hl=en&img_index=1", // Add specific link
  },
  {
    id: 2,
    title: "Dust Dynamix",
    imgSrc:OPI2,
     link: "https://www.instagram.com/p/DCqWduZPuwz/?img_index=1" // Add specific link
  },
  {
    id: 3,
    title: "Fauna Fantastico",
    imgSrc:OPI3,
     link: "https://www.instagram.com/p/DDHF4UYvNju/?hl=en&img_index=1" // Add specific link
  },
  {
    id: 4,
    title: "InfraVision",
    imgSrc:OPI4,
     link: "https://www.instagram.com/p/DC0twmRPvYB/?hl=en&img_index=1" // Add specific link
  },
  {
    id: 5,
    title: "Trial Trifecta",
    imgSrc:OPI5,
     link: "https://www.instagram.com/p/DC8rscpPR9E/?hl=en&img_index=1" // Add specific link
  },
  {
    id: 6,
    title: "Crowned Quest",
    imgSrc:OPI6,
    // Add specific link
     link: "https://www.instagram.com/p/DDl0JgPP5st/?hl=en&img_index=1"
  },
  {
    id: 7,
    title: "Merge Blocker",
    imgSrc:OPI7,
      link: "https://www.instagram.com/p/DDeJOrCPC0D/?hl=en&img_index=1", // Add specific link
  },
];