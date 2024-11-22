import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Mousewheel } from "swiper/modules"; // Import from swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./BlogSlider.css";

const BlogSlider = () => {
  return (
    <div>
      <div className="blog-slider ">
        <Swiper
          modules={[Pagination, EffectFade, Mousewheel]} // Using modules correctly
          spaceBetween={30}
          effect="fade"
          loop={true}
          mousewheel={{ invert: false }}
          pagination={{ clickable: true, el: ".blog-slider__pagination" }}
          className="blog-slider__wrp swiper-wrapper relative overflow-visible"
        >
          <SwiperSlide className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img
                src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
                alt="Blog Image 1"
              />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">Lorem Ipsum Dolor</div>
              <div className="blog-slider__text">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Recusandae voluptate repellendus magni illo ea animi?
              </div>
              <a href="#" className="blog-slider__button">
                READ MORE
              </a>
            </div>
          </SwiperSlide>

          <SwiperSlide className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img
                src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
                alt="Blog Image 1"
              />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">Lorem Ipsum Dolor</div>
              <div className="blog-slider__text">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Recusandae voluptate repellendus magni illo ea animi?
              </div>
              <a href="#" className="blog-slider__button">
                READ MORE
              </a>
            </div>
          </SwiperSlide>

          <SwiperSlide className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img
                src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
                alt="Blog Image 1"
              />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">Lorem Ipsum Dolor</div>
              <div className="blog-slider__text">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Recusandae voluptate repellendus magni illo ea animi?
              </div>
              <a href="#" className="blog-slider__button">
                READ MORE
              </a>
            </div>
          </SwiperSlide>
        </Swiper>
        <div className="blog-slider__pagination"></div>
      </div>
    </div>
  );
};

export default BlogSlider;
