// import React, { useEffect } from "react";
// import Swiper from "swiper";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";
// import "./BlogSlider.css";

// const BlogSlider = () => {
//   useEffect(() => {
//     // Initialize Swiper after the component mounts
//     new Swiper(".blog-slider", {
//       spaceBetween: 30,
//       effect: "fade",
//       loop: true,
//       mousewheel: {
//         invert: false,
//       },
//       pagination: {
//         el: ".blog-slider__pagination",
//         clickable: true,
//       },
//     });
//   }, []);

//   return (
//     <div className="blog-slider">
//       <div className="blog-slider__wrp swiper-wrapper">
//         {/* Slide 1 */}
//         <div className="blog-slider__item swiper-slide">
//           <div className="blog-slider__img">
//             <img
//               src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
//               alt="Blog Image 1"
//             />
//           </div>
//           <div className="blog-slider__content">
//             <span className="blog-slider__code">26 December 2019</span>
//             <div className="blog-slider__title">Lorem Ipsum Dolor</div>
//             <div className="blog-slider__text">
//               Lorem ipsum dolor sit amet consectetur, adipisicing elit.
//               Recusandae voluptate repellendus magni illo ea animi?
//             </div>
//             <a href="#" className="blog-slider__button">
//               READ MORE
//             </a>
//           </div>
//         </div>

       

//       </div>
//       <div className="blog-slider__pagination"></div>
//     </div>
//   );
// };

// export default BlogSlider;
